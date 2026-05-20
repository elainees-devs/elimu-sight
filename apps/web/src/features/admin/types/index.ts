export interface AdminOverview {
  totalSchools: number
  totalUsers: number
  totalStudents: number
  totalAssessments: number
  totalInsights: number
  aiRequests: number
  activeSchools: number
  systemHealth: 'HEALTHY' | 'DEGRADED'
}

export interface SystemHealth {
  database: { status: 'connected' | 'disconnected'; latency: number | null }
  api: { status: 'running'; uptime: number; memory: { rss: number; heapTotal: number; heapUsed: number } }
  responseTime: number
}

export interface SchoolWithStats {
  id: string
  name: string
  email: string
  phone: string
  address: string | null
  subscriptionPlan: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count: {
    users: number
    students: number
    classes: number
  }
}

export interface AdminUser {
  id: string
  schoolId: string | null
  schoolName: string | null
  fullName: string
  email: string
  role: string
  assignedClassId: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AIUsageStats {
  totalRequests: number
  modelDistribution: { model: string; count: number }[]
  topSchools: { schoolId: string; schoolName: string; count: number }[]
}

export interface AIUsageTrend {
  date: string
  requests: number
}

export interface InsightStats {
  totalInsights: number
  perSchool: { schoolId: string; schoolName: string; count: number }[]
}

export interface AuditLogEntry {
  id: string
  schoolId: string | null
  schoolName: string | null
  userId: string | null
  userName: string | null
  userEmail: string | null
  action: string
  resource: string
  resourceId: string | null
  details: Record<string, unknown> | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
}

export interface AuditLogStats {
  totalLogs: number
  byAction: { action: string; count: number }[]
  byResource: { resource: string; count: number }[]
  recentDays: number
}

export interface SecurityOverview {
  failedLogins: number
  roleChanges: number
  recentAlerts: number
}

export interface BillingOverview {
  plans: { plan: string; count: number }[]
  totalRevenue: number
  activeSubscriptions: number
}

export interface Announcement {
  id: string
  title: string
  body: string
  priority: string
  status: string
  createdBy: string
  creatorName: string
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface SupportTicket {
  id: string
  schoolId: string
  schoolName: string
  subject: string
  description: string
  status: string
  priority: string
  assignedTo: string | null
  assignedToName: string | null
  createdBy: string
  creatorName: string
  resolvedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface SchoolDetail {
  id: string
  name: string
  email: string
  phone: string
  address: string | null
  subscriptionPlan: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  _count: {
    users: number
    students: number
    classes: number
    assessments: number
    insights: number
  }
}
