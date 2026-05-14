import { useQuery } from '@tanstack/react-query'
import { dashboardClient } from '../api/dashboard-client'

export function useDashboardStats(classId?: string) {
  return useQuery({
    queryKey: ['dashboard', 'stats', classId ?? 'all'],
    queryFn: async () => {
      const res = await dashboardClient.stats(classId)
      return res.data.data
    },
  })
}

export function useRecentActivity(classId?: string) {
  return useQuery({
    queryKey: ['dashboard', 'recent-activity', classId ?? 'all'],
    queryFn: async () => {
      const res = await dashboardClient.recentActivity(classId)
      return res.data.data
    },
  })
}
