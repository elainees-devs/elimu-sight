import { apiClient } from '@shared/lib/axios'
import type { ApiResponse } from '@shared/types/api'
import type { DashboardStats, RecentActivity } from '../types'

export const dashboardClient = {
  stats: (schoolId: string) =>
    apiClient.get<ApiResponse<DashboardStats>>(`/dashboard/stats?schoolId=${schoolId}`),

  recentActivity: (schoolId: string) =>
    apiClient.get<ApiResponse<RecentActivity[]>>(`/dashboard/recent-activity?schoolId=${schoolId}`),
}
