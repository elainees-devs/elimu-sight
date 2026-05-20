import { Response, NextFunction } from "express";
import { AdminService } from "../services/index";
import { sendSuccess, sendCreated, sendPaginated } from "@utils/index";
import { logAudit } from "@utils/index";
import { AuthRequest } from "../types/express";

function qs(val: unknown): string | undefined {
  if (typeof val === "string") return val;
  if (Array.isArray(val)) return val[0];
  return undefined;
}

export class AdminController {
  private adminService = new AdminService();

  async getOverview(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.adminService.getOverview();
      return sendSuccess(res, data, "Admin overview fetched successfully");
    } catch (error) {
      return next(error);
    }
  }

  async getHealth(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.adminService.getHealth();
      return sendSuccess(res, data, "System health fetched successfully");
    } catch (error) {
      return next(error);
    }
  }

  async getSchools(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await this.adminService.getSchools({
        page: parseInt(qs(req.query.page) || "1"),
        limit: parseInt(qs(req.query.limit) || "20"),
        search: qs(req.query.search),
        sortBy: qs(req.query.sortBy),
        sortOrder: qs(req.query.sortOrder) as "asc" | "desc" | undefined,
      });
      return sendPaginated(res, result.data, result.meta, "Schools fetched successfully");
    } catch (error) {
      return next(error);
    }
  }

  async getSchoolDetail(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.adminService.getSchoolDetail(req.params.id!);
      return sendSuccess(res, data, "School detail fetched successfully");
    } catch (error) {
      return next(error);
    }
  }

  async createSchool(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.adminService.createSchool(req.body);
      await logAudit({
        action: "SCHOOL_CREATED",
        resource: "schools",
        resourceId: data.id,
        schoolId: data.id,
        userId: req.user!.id,
        details: { name: req.body.name, email: req.body.email },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return sendCreated(res, data, "School created successfully");
    } catch (error) {
      return next(error);
    }
  }

  async updateSchool(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.adminService.updateSchool(req.params.id!, req.body);
      await logAudit({
        action: "SCHOOL_UPDATED",
        resource: "schools",
        resourceId: data.id,
        schoolId: data.id,
        userId: req.user!.id,
        details: req.body,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return sendSuccess(res, data, "School updated successfully");
    } catch (error) {
      return next(error);
    }
  }

  async deleteSchool(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.adminService.deleteSchool(req.params.id!);
      await logAudit({
        action: "SCHOOL_DEACTIVATED",
        resource: "schools",
        resourceId: data.id,
        schoolId: data.id,
        userId: req.user!.id,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return sendSuccess(res, data, "School deactivated successfully");
    } catch (error) {
      return next(error);
    }
  }

  async getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const isActiveVal = qs(req.query.isActive);
      const result = await this.adminService.getUsers({
        page: parseInt(qs(req.query.page) || "1"),
        limit: parseInt(qs(req.query.limit) || "20"),
        search: qs(req.query.search),
        role: qs(req.query.role),
        schoolId: qs(req.query.schoolId),
        isActive: isActiveVal === "true" ? true : isActiveVal === "false" ? false : undefined,
        sortBy: qs(req.query.sortBy),
        sortOrder: qs(req.query.sortOrder) as "asc" | "desc" | undefined,
      });
      return sendPaginated(res, result.data, result.meta, "Users fetched successfully");
    } catch (error) {
      return next(error);
    }
  }

  async getUserDetail(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.adminService.getUserDetail(qs(req.params.id)!);
      return sendSuccess(res, data, "User detail fetched successfully");
    } catch (error) {
      return next(error);
    }
  }

  async createUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.adminService.createUser(req.body);
      await logAudit({
        action: "USER_CREATED",
        resource: "users",
        resourceId: data.id,
        schoolId: data.school_id,
        userId: req.user!.id,
        details: { role: data.role, email: data.email },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return sendCreated(res, data, "User created successfully");
    } catch (error) {
      return next(error);
    }
  }

  async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.adminService.updateUser(qs(req.params.id)!, req.body);
      await logAudit({
        action: "USER_UPDATED",
        resource: "users",
        resourceId: data.id,
        schoolId: data.school_id,
        userId: req.user!.id,
        details: req.body,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return sendSuccess(res, data, "User updated successfully");
    } catch (error) {
      return next(error);
    }
  }

  async deactivateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.adminService.deactivateUser(qs(req.params.id)!);
      await logAudit({
        action: "USER_DEACTIVATED",
        resource: "users",
        resourceId: data.id,
        schoolId: data.school_id,
        userId: req.user!.id,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return sendSuccess(res, data, "User deactivated successfully");
    } catch (error) {
      return next(error);
    }
  }

  async getAIUsage(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.adminService.getAIUsage();
      return sendSuccess(res, data, "AI usage stats fetched successfully");
    } catch (error) {
      return next(error);
    }
  }

  async getAIUsageTrends(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const days = parseInt(qs(req.query.days) || "30");
      const data = await this.adminService.getAIUsageTrends(days);
      return sendSuccess(res, data, "AI usage trends fetched successfully");
    } catch (error) {
      return next(error);
    }
  }

  async getInsightStats(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.adminService.getInsightStats();
      return sendSuccess(res, data, "Insight stats fetched successfully");
    } catch (error) {
      return next(error);
    }
  }

  async getAuditLogs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await this.adminService.getAuditLogs({
        page: parseInt(qs(req.query.page) || "1"),
        limit: parseInt(qs(req.query.limit) || "20"),
        action: qs(req.query.action),
        resource: qs(req.query.resource),
        userId: qs(req.query.userId),
        schoolId: qs(req.query.schoolId),
        startDate: qs(req.query.startDate),
        endDate: qs(req.query.endDate),
      });
      return sendPaginated(res, result.data, result.meta, "Audit logs fetched successfully");
    } catch (error) {
      return next(error);
    }
  }

  async getAuditLogStats(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.adminService.getAuditLogStats();
      return sendSuccess(res, data, "Audit log stats fetched successfully");
    } catch (error) {
      return next(error);
    }
  }

  async getSecurityOverview(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.adminService.getSecurityOverview();
      return sendSuccess(res, data, "Security overview fetched successfully");
    } catch (error) {
      return next(error);
    }
  }

  async getBillingOverview(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.adminService.getBillingOverview();
      return sendSuccess(res, data, "Billing overview fetched successfully");
    } catch (error) {
      return next(error);
    }
  }

  async changeSchoolPlan(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.adminService.changeSchoolPlan(qs(req.params.id)!, req.body.plan);
      await logAudit({
        action: "SCHOOL_PLAN_CHANGED",
        resource: "subscriptions",
        resourceId: data.id,
        schoolId: data.id,
        userId: req.user!.id,
        details: { new_plan: req.body.plan },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return sendSuccess(res, data, "School plan updated successfully");
    } catch (error) {
      return next(error);
    }
  }

  async getAnnouncements(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await this.adminService.getAnnouncements({
        page: parseInt(qs(req.query.page) || "1"),
        limit: parseInt(qs(req.query.limit) || "20"),
        status: qs(req.query.status),
      });
      return sendPaginated(res, result.data, result.meta, "Announcements fetched successfully");
    } catch (error) {
      return next(error);
    }
  }

  async createAnnouncement(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.adminService.createAnnouncement({
        ...req.body,
        createdBy: req.user!.id,
      });
      await logAudit({
        action: "ANNOUNCEMENT_CREATED",
        resource: "announcements",
        resourceId: data.id,
        userId: req.user!.id,
        details: { title: data.title, priority: data.priority },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return sendCreated(res, data, "Announcement created successfully");
    } catch (error) {
      return next(error);
    }
  }

  async updateAnnouncement(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.adminService.updateAnnouncement(qs(req.params.id)!, req.body);
      await logAudit({
        action: "ANNOUNCEMENT_UPDATED",
        resource: "announcements",
        resourceId: data.id,
        userId: req.user!.id,
        details: req.body,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return sendSuccess(res, data, "Announcement updated successfully");
    } catch (error) {
      return next(error);
    }
  }

  async deleteAnnouncement(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.adminService.deleteAnnouncement(qs(req.params.id)!);
      await logAudit({
        action: "ANNOUNCEMENT_DELETED",
        resource: "announcements",
        resourceId: data.id,
        userId: req.user!.id,
        details: { title: data.title },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return sendSuccess(res, data, "Announcement deleted successfully");
    } catch (error) {
      return next(error);
    }
  }

  async getSupportTickets(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await this.adminService.getSupportTickets({
        page: parseInt(qs(req.query.page) || "1"),
        limit: parseInt(qs(req.query.limit) || "20"),
        status: qs(req.query.status),
        priority: qs(req.query.priority),
      });
      return sendPaginated(res, result.data, result.meta, "Support tickets fetched successfully");
    } catch (error) {
      return next(error);
    }
  }

  async getSupportTicketDetail(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.adminService.getSupportTicketDetail(qs(req.params.id)!);
      return sendSuccess(res, data, "Support ticket detail fetched successfully");
    } catch (error) {
      return next(error);
    }
  }

  async updateSupportTicket(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.adminService.updateSupportTicket(qs(req.params.id)!, req.body);
      await logAudit({
        action: "SUPPORT_TICKET_UPDATED",
        resource: "support_tickets",
        resourceId: data.id,
        schoolId: data.school_id,
        userId: req.user!.id,
        details: req.body,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return sendSuccess(res, data, "Support ticket updated successfully");
    } catch (error) {
      return next(error);
    }
  }
}
