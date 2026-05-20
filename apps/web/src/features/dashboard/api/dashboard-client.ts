import { apiClient } from '@shared/lib/axios'
import type { ApiResponse } from '@shared/types/api'
import type { DashboardStats, RecentActivity, ClassPerformance } from '../types'

export const dashboardClient = {
  stats: (classId?: string) => {
    const params = classId ? `?classId=${classId}` : ''
    return apiClient.get<ApiResponse<DashboardStats>>(`/dashboard/stats${params}`)
  },

  recentActivity: (classId?: string) => {
    const params = classId ? `?classId=${classId}` : ''
    return apiClient.get<ApiResponse<RecentActivity[]>>(`/dashboard/recent-activity${params}`)
  },

  classPerformance: (classId: string) =>
    apiClient.get<ApiResponse<ClassPerformance>>(`/dashboard/class-performance/${classId}`),
}
