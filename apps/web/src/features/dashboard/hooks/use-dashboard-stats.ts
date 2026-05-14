import { useQuery } from '@tanstack/react-query'
import { dashboardClient } from '../api/dashboard-client'

export function useDashboardStats(schoolId: string) {
  return useQuery({
    queryKey: ['dashboard', 'stats', schoolId],
    queryFn: async () => {
      const res = await dashboardClient.stats(schoolId)
      return res.data.data
    },
    enabled: !!schoolId,
  })
}
