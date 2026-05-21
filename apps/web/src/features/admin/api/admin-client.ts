import { apiClient } from '@shared/lib/axios'
import type { ApiResponse, ApiPaginatedResponse, PaginationMeta } from "@elimu-sight/types"
import type {
  AdminOverview,
  SystemHealth,
  SchoolWithStats,
  AdminUser,
  AIUsageStats,
  AIUsageTrend,
  InsightStats,
  AuditLogEntry,
  AuditLogStats,
  SecurityOverview,
  BillingOverview,
  Announcement,
  SupportTicket,
  SchoolDetail,
} from '../types'

export const adminClient = {
  overview: () =>
    apiClient.get<ApiResponse<AdminOverview>>('/admin/overview'),

  health: () =>
    apiClient.get<ApiResponse<SystemHealth>>('/admin/health'),

  schools: (params?: Record<string, string>) =>
    apiClient.get<ApiPaginatedResponse<SchoolWithStats>>('/admin/schools', { params }),

  schoolDetail: (id: string) =>
    apiClient.get<ApiResponse<SchoolDetail>>(`/admin/schools/${id}`),

  createSchool: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse<SchoolWithStats>>('/admin/schools', data),

  updateSchool: (id: string, data: Record<string, unknown>) =>
    apiClient.patch<ApiResponse<SchoolWithStats>>(`/admin/schools/${id}`, data),

  deleteSchool: (id: string) =>
    apiClient.delete<ApiResponse<SchoolWithStats>>(`/admin/schools/${id}`),

  users: (params?: Record<string, string>) =>
    apiClient.get<ApiPaginatedResponse<AdminUser>>('/admin/users', { params }),

  userDetail: (id: string) =>
    apiClient.get<ApiResponse<AdminUser>>(`/admin/users/${id}`),

  createUser: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse<AdminUser>>('/admin/users', data),

  updateUser: (id: string, data: Record<string, unknown>) =>
    apiClient.patch<ApiResponse<AdminUser>>(`/admin/users/${id}`, data),

  deactivateUser: (id: string) =>
    apiClient.delete<ApiResponse<AdminUser>>(`/admin/users/${id}`),

  aiUsage: () =>
    apiClient.get<ApiResponse<AIUsageStats>>('/admin/analytics/ai-usage'),

  aiUsageTrends: (days?: number) =>
    apiClient.get<ApiResponse<AIUsageTrend[]>>('/admin/analytics/ai-usage/trends', {
      params: days ? { days: String(days) } : undefined,
    }),

  insightStats: () =>
    apiClient.get<ApiResponse<InsightStats>>('/admin/analytics/insights'),

  auditLogs: (params?: Record<string, string>) =>
    apiClient.get<ApiPaginatedResponse<AuditLogEntry>>('/admin/audit-logs', { params }),

  auditLogStats: () =>
    apiClient.get<ApiResponse<AuditLogStats>>('/admin/audit-logs/stats'),

  securityOverview: () =>
    apiClient.get<ApiResponse<SecurityOverview>>('/admin/security/overview'),

  billingOverview: () =>
    apiClient.get<ApiResponse<BillingOverview>>('/admin/billing/overview'),

  changeSchoolPlan: (id: string, plan: string) =>
    apiClient.patch<ApiResponse<SchoolWithStats>>(`/admin/billing/schools/${id}/plan`, { plan }),

  announcements: (params?: Record<string, string>) =>
    apiClient.get<ApiPaginatedResponse<Announcement>>('/admin/announcements', { params }),

  createAnnouncement: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse<Announcement>>('/admin/announcements', data),

  updateAnnouncement: (id: string, data: Record<string, unknown>) =>
    apiClient.patch<ApiResponse<Announcement>>(`/admin/announcements/${id}`, data),

  deleteAnnouncement: (id: string) =>
    apiClient.delete<ApiResponse<Announcement>>(`/admin/announcements/${id}`),

  supportTickets: (params?: Record<string, string>) =>
    apiClient.get<ApiPaginatedResponse<SupportTicket>>('/admin/support-tickets', { params }),

  supportTicketDetail: (id: string) =>
    apiClient.get<ApiResponse<SupportTicket>>(`/admin/support-tickets/${id}`),

  updateSupportTicket: (id: string, data: Record<string, unknown>) =>
    apiClient.patch<ApiResponse<SupportTicket>>(`/admin/support-tickets/${id}`, data),
}
