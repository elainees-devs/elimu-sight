import { Prisma } from "@prisma/client";
import type {
  announcement_priority,
  announcement_status,
  ticket_priority,
  ticket_status,
} from "@prisma/client";
import { prisma, ApiError, logger, hashPassword } from "@utils/index";

export interface AdminOverview {
  totalSchools: number;
  totalUsers: number;
  totalStudents: number;
  totalAssessments: number;
  totalInsights: number;
  aiRequests: number;
  activeSchools: number;
  systemHealth: "HEALTHY" | "DEGRADED";
}

export interface SystemHealth {
  database: { status: "connected" | "disconnected"; latency: number | null };
  api: { status: "running"; uptime: number; memory: NodeJS.MemoryUsage };
  responseTime: number;
}

export interface AIUsageStats {
  totalRequests: number;
  modelDistribution: { model: string; count: number }[];
  topSchools: { schoolId: string; schoolName: string; count: number }[];
}

export interface AIUsageTrend {
  date: string;
  requests: number;
}

export interface InsightStats {
  totalInsights: number;
  perSchool: { schoolId: string; schoolName: string; count: number }[];
}

export interface AuditLogStats {
  totalLogs: number;
  byAction: { action: string; count: number }[];
  byResource: { resource: string; count: number }[];
  recentDays: number;
}

export interface SecurityOverview {
  failedLogins: number;
  roleChanges: number;
  recentAlerts: number;
}

export interface BillingOverview {
  plans: { plan: string; count: number }[];
  totalRevenue: number;
  activeSubscriptions: number;
}

export class AdminService {
  async getOverview(): Promise<AdminOverview> {
    try {
      const [
        totalSchools,
        totalUsers,
        totalStudents,
        totalAssessments,
        totalInsights,
        aiRequests,
        activeSchools,
      ] = await Promise.all([
        prisma.schools.count(),
        prisma.users.count(),
        prisma.students.count(),
        prisma.assessments.count(),
        prisma.insights.count(),
        prisma.ai_logs.count(),
        prisma.schools.count({ where: { is_active: true } }),
      ]);

      return {
        totalSchools,
        totalUsers,
        totalStudents,
        totalAssessments,
        totalInsights,
        aiRequests,
        activeSchools,
        systemHealth: "HEALTHY",
      };
    } catch {
      logger.error("Failed to fetch admin overview");
      throw new ApiError(500, "Failed to fetch admin overview");
    }
  }

  async getHealth(): Promise<SystemHealth> {
    const start = Date.now();
    let dbLatency: number | null = null;
    let dbStatus: "connected" | "disconnected" = "disconnected";

    try {
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - dbStart;
      dbStatus = "connected";
    } catch {
      dbStatus = "disconnected";
    }

    return {
      database: { status: dbStatus, latency: dbLatency },
      api: {
        status: "running",
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      },
      responseTime: Date.now() - start,
    };
  }

  async getSchools(params: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const { page, limit, search, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.schoolsWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy: Prisma.schoolsOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || "asc" }
      : { created_at: "desc" };

    const [schools, total] = await Promise.all([
      prisma.schools.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          _count: {
            select: { users: true, students: true, classes: true },
          },
        },
      }),
      prisma.schools.count({ where }),
    ]);

    return {
      data: schools,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getSchoolDetail(id: string) {
    const school = await prisma.schools.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            students: true,
            classes: true,
            assessments: true,
            insights: true,
          },
        },
      },
    });

    if (!school) throw new ApiError(404, "School not found");
    return school;
  }

  async createSchool(data: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    subscriptionPlan: string;
  }) {
    const existing = await prisma.schools.findFirst({
      where: { email: data.email },
    });
    if (existing) throw new ApiError(409, "A school with this email already exists");

    return prisma.schools.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address || null,
        subscription_plan: data.subscriptionPlan,
      },
    });
  }

  async updateSchool(
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      subscriptionPlan?: string;
      isActive?: boolean;
    }
  ) {
    const school = await prisma.schools.findUnique({ where: { id } });
    if (!school) throw new ApiError(404, "School not found");

    const updateData: Prisma.schoolsUpdateInput = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.subscriptionPlan !== undefined) updateData.subscription_plan = data.subscriptionPlan;
    if (data.isActive !== undefined) updateData.is_active = data.isActive;

    return prisma.schools.update({ where: { id }, data: updateData });
  }

  async deleteSchool(id: string) {
    const school = await prisma.schools.findUnique({ where: { id } });
    if (!school) throw new ApiError(404, "School not found");

    return prisma.schools.update({
      where: { id },
      data: { deleted_at: new Date(), is_active: false },
    });
  }

  async getUsers(params: {
    page: number;
    limit: number;
    search?: string;
    role?: string;
    schoolId?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const { page, limit, search, role, schoolId, isActive, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.usersWhereInput = {};
    if (search) {
      where.OR = [
        { full_name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    if (role) where.role = role;
    if (schoolId) where.school_id = schoolId;
    if (isActive !== undefined) where.is_active = isActive;

    const orderBy: Prisma.usersOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || "asc" }
      : { created_at: "desc" };

    const [users, total] = await Promise.all([
      prisma.users.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { schools: { select: { name: true } } },
      }),
      prisma.users.count({ where }),
    ]);

    return {
      data: users.map((u) => ({
        id: u.id,
        schoolId: u.school_id,
        schoolName: u.schools?.name || null,
        fullName: u.full_name,
        email: u.email,
        role: u.role,
        assignedClassId: u.assigned_class_id,
        isActive: u.is_active,
        createdAt: u.created_at,
        updatedAt: u.updated_at,
      })),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getUserDetail(id: string) {
    const user = await prisma.users.findUnique({
      where: { id },
      include: { schools: { select: { name: true } } },
    });
    if (!user) throw new ApiError(404, "User not found");
    return user;
  }

  async createUser(data: {
    schoolId: string;
    fullName: string;
    email: string;
    password: string;
    role: string;
    assignedClassId?: string | null;
  }) {
    const existing = await prisma.users.findUnique({ where: { email: data.email } });
    if (existing) throw new ApiError(409, "A user with this email already exists");

    const school = await prisma.schools.findUnique({ where: { id: data.schoolId } });
    if (!school) throw new ApiError(404, "School not found");

    const password_hash = await hashPassword(data.password);

    return prisma.users.create({
      data: {
        school_id: data.schoolId,
        full_name: data.fullName,
        email: data.email,
        password_hash,
        role: data.role,
        assigned_class_id: data.assignedClassId || null,
      },
    });
  }

  async updateUser(
    id: string,
    data: {
      fullName?: string;
      email?: string;
      role?: string;
      schoolId?: string;
      isActive?: boolean;
      assignedClassId?: string | null;
    }
  ) {
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) throw new ApiError(404, "User not found");

    const updateData: Prisma.usersUncheckedUpdateInput = {};
    if (data.fullName !== undefined) updateData.full_name = data.fullName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.schoolId !== undefined) updateData.school_id = data.schoolId;
    if (data.isActive !== undefined) updateData.is_active = data.isActive;
    if (data.assignedClassId !== undefined)
      updateData.assigned_class_id = data.assignedClassId;

    return prisma.users.update({ where: { id }, data: updateData });
  }

  async deactivateUser(id: string) {
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) throw new ApiError(404, "User not found");

    return prisma.users.update({
      where: { id },
      data: { is_active: false },
    });
  }

  async getAIUsage(): Promise<AIUsageStats> {
    const totalRequests = await prisma.ai_logs.count();

    const modelRaw = await prisma.ai_logs.groupBy({
      by: ["model_version"],
      _count: { id: true },
    });
    const modelDistribution = modelRaw
      .filter((m) => m.model_version)
      .map((m) => ({ model: m.model_version!, count: m._count.id }));

    const schoolRaw = await prisma.ai_logs.groupBy({
      by: ["school_id"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    });
    const schoolIds = schoolRaw.map((s) => s.school_id);
    const schools = await prisma.schools.findMany({
      where: { id: { in: schoolIds } },
      select: { id: true, name: true },
    });
    const schoolMap = new Map(schools.map((s) => [s.id, s.name]));

    const topSchools = schoolRaw.map((s) => ({
      schoolId: s.school_id,
      schoolName: schoolMap.get(s.school_id) || "Unknown",
      count: s._count.id,
    }));

    return { totalRequests, modelDistribution, topSchools };
  }

  async getAIUsageTrends(days = 30): Promise<AIUsageTrend[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const logs = await prisma.ai_logs.findMany({
      where: { created_at: { gte: since } },
      select: { created_at: true },
      orderBy: { created_at: "asc" },
    });

    const dailyMap = new Map<string, number>();
    for (const log of logs) {
      const date = log.created_at.toISOString().slice(0, 10);
      dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
    }

    const trends: AIUsageTrend[] = [];
    const start = new Date(since);
    for (let i = 0; i <= days; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const key = date.toISOString().slice(0, 10);
      trends.push({ date: key, requests: dailyMap.get(key) || 0 });
    }

    return trends;
  }

  async getInsightStats(): Promise<InsightStats> {
    const totalInsights = await prisma.insights.count();

    const perSchoolRaw = await prisma.insights.groupBy({
      by: ["school_id"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 20,
    });

    const schoolIds = perSchoolRaw.map((s) => s.school_id);
    const schools = await prisma.schools.findMany({
      where: { id: { in: schoolIds } },
      select: { id: true, name: true },
    });
    const schoolMap = new Map(schools.map((s) => [s.id, s.name]));

    const perSchool = perSchoolRaw.map((s) => ({
      schoolId: s.school_id,
      schoolName: schoolMap.get(s.school_id) || "Unknown",
      count: s._count.id,
    }));

    return { totalInsights, perSchool };
  }

  async getAuditLogs(params: {
    page: number;
    limit: number;
    action?: string;
    resource?: string;
    userId?: string;
    schoolId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const { page, limit, action, resource, userId, schoolId, startDate, endDate } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.audit_logsWhereInput = {};
    if (action) where.action = action;
    if (resource) where.resource = resource;
    if (userId) where.user_id = userId;
    if (schoolId) where.school_id = schoolId;
    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at.gte = new Date(startDate);
      if (endDate) where.created_at.lte = new Date(endDate);
    }

    const [logs, total] = await Promise.all([
      prisma.audit_logs.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
        include: {
          users: { select: { full_name: true, email: true } },
          schools: { select: { name: true } },
        },
      }),
      prisma.audit_logs.count({ where }),
    ]);

    return {
      data: logs.map((l) => ({
        id: l.id,
        schoolId: l.school_id,
        schoolName: l.schools?.name || null,
        userId: l.user_id,
        userName: l.users?.full_name || null,
        userEmail: l.users?.email || null,
        action: l.action,
        resource: l.resource,
        resourceId: l.resource_id,
        details: l.details,
        ipAddress: l.ip_address,
        userAgent: l.user_agent,
        createdAt: l.created_at,
      })),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getAuditLogStats(): Promise<AuditLogStats> {
    const totalLogs = await prisma.audit_logs.count();

    const byActionRaw = await prisma.audit_logs.groupBy({
      by: ["action"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 20,
    });

    const byResourceRaw = await prisma.audit_logs.groupBy({
      by: ["resource"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 20,
    });

    return {
      totalLogs,
      byAction: byActionRaw.map((a) => ({ action: a.action, count: a._count.id })),
      byResource: byResourceRaw.map((r) => ({ resource: r.resource, count: r._count.id })),
      recentDays: 30,
    };
  }

  async getSecurityOverview(): Promise<SecurityOverview> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [failedLogins, roleChanges, recentAlerts] = await Promise.all([
      prisma.audit_logs.count({
        where: { action: "LOGIN_FAILED", created_at: { gte: thirtyDaysAgo } },
      }),
      prisma.audit_logs.count({
        where: { action: "USER_ROLE_CHANGED", created_at: { gte: thirtyDaysAgo } },
      }),
      prisma.audit_logs.count({
        where: {
          action: { in: ["SECURITY_ALERT", "SUSPICIOUS_ACTIVITY"] },
          created_at: { gte: thirtyDaysAgo },
        },
      }),
    ]);

    return { failedLogins, roleChanges, recentAlerts };
  }

  async getBillingOverview(): Promise<BillingOverview> {
    const planRaw = await prisma.schools.groupBy({
      by: ["subscription_plan"],
      _count: { id: true },
      where: { deleted_at: null },
    });

    const plans = planRaw.map((p) => ({
      plan: p.subscription_plan,
      count: p._count.id,
    }));

    const activeSubscriptions = await prisma.schools.count({
      where: { is_active: true, deleted_at: null },
    });

    const planPrices: Record<string, number> = { FREE: 0, BASIC: 99, PREMIUM: 299 };
    const totalRevenue = plans.reduce((sum, p) => sum + (planPrices[p.plan] || 0) * p.count, 0);

    return { plans, totalRevenue, activeSubscriptions };
  }

  async changeSchoolPlan(schoolId: string, plan: string) {
    const school = await prisma.schools.findUnique({ where: { id: schoolId } });
    if (!school) throw new ApiError(404, "School not found");

    return prisma.schools.update({
      where: { id: schoolId },
      data: { subscription_plan: plan },
    });
  }

  async getAnnouncements(params: { page: number; limit: number; status?: string }) {
    const { page, limit, status } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.announcementsWhereInput = {};
    if (status) where.status = status as announcement_status;

    const [announcements, total] = await Promise.all([
      prisma.announcements.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
        include: {
          creator: { select: { full_name: true, email: true } },
        },
      }),
      prisma.announcements.count({ where }),
    ]);

    return {
      data: announcements.map((a) => ({
        id: a.id,
        title: a.title,
        body: a.body,
        priority: a.priority,
        status: a.status,
        createdBy: a.created_by,
        creatorName: a.creator.full_name,
        publishedAt: a.published_at,
        createdAt: a.created_at,
        updatedAt: a.updated_at,
      })),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async createAnnouncement(data: {
    title: string;
    body: string;
    priority: string;
    status: string;
    createdBy: string;
  }) {
    return prisma.announcements.create({
      data: {
        title: data.title,
        body: data.body,
        priority: data.priority as announcement_priority,
        status: data.status as announcement_status,
        created_by: data.createdBy,
        published_at: data.status === "PUBLISHED" ? new Date() : null,
      },
    });
  }

  async updateAnnouncement(
    id: string,
    data: { title?: string; body?: string; priority?: string; status?: string }
  ) {
    const announcement = await prisma.announcements.findUnique({ where: { id } });
    if (!announcement) throw new ApiError(404, "Announcement not found");

    const updateData: Prisma.announcementsUpdateInput = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.body !== undefined) updateData.body = data.body;
    if (data.priority !== undefined) updateData.priority = data.priority as announcement_priority;
    if (data.status !== undefined) {
      updateData.status = data.status as announcement_status;
      if (data.status === "PUBLISHED" && !announcement.published_at) {
        updateData.published_at = new Date();
      }
    }

    return prisma.announcements.update({ where: { id }, data: updateData });
  }

  async deleteAnnouncement(id: string) {
    const announcement = await prisma.announcements.findUnique({ where: { id } });
    if (!announcement) throw new ApiError(404, "Announcement not found");

    return prisma.announcements.delete({ where: { id } });
  }

  async getSupportTickets(params: {
    page: number;
    limit: number;
    status?: string;
    priority?: string;
  }) {
    const { page, limit, status, priority } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.support_ticketsWhereInput = {};
    if (status) where.status = status as ticket_status;
    if (priority) where.priority = priority as ticket_priority;

    const [tickets, total] = await Promise.all([
      prisma.support_tickets.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
        include: {
          school: { select: { name: true } },
          creator: { select: { full_name: true, email: true } },
          assigned_to_user: { select: { full_name: true } },
        },
      }),
      prisma.support_tickets.count({ where }),
    ]);

    return {
      data: tickets.map((t) => ({
        id: t.id,
        schoolId: t.school_id,
        schoolName: t.school.name,
        subject: t.subject,
        description: t.description,
        status: t.status,
        priority: t.priority,
        assignedTo: t.assigned_to,
        assignedToName: t.assigned_to_user?.full_name || null,
        createdBy: t.created_by,
        creatorName: t.creator.full_name,
        resolvedAt: t.resolved_at,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
      })),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getSupportTicketDetail(id: string) {
    const ticket = await prisma.support_tickets.findUnique({
      where: { id },
      include: {
        school: { select: { name: true, email: true, phone: true } },
        creator: { select: { full_name: true, email: true } },
        assigned_to_user: { select: { full_name: true, email: true } },
      },
    });
    if (!ticket) throw new ApiError(404, "Support ticket not found");
    return ticket;
  }

  async updateSupportTicket(
    id: string,
    data: { status?: string; priority?: string; assignedTo?: string | null }
  ) {
    const ticket = await prisma.support_tickets.findUnique({ where: { id } });
    if (!ticket) throw new ApiError(404, "Support ticket not found");

    const updateData: Prisma.support_ticketsUncheckedUpdateInput = {};
    if (data.status !== undefined) {
      updateData.status = data.status as ticket_status;
      if (data.status === "RESOLVED") updateData.resolved_at = new Date();
    }
    if (data.priority !== undefined) updateData.priority = data.priority as ticket_priority;
    if (data.assignedTo !== undefined) updateData.assigned_to = data.assignedTo;

    return prisma.support_tickets.update({ where: { id }, data: updateData });
  }
}
