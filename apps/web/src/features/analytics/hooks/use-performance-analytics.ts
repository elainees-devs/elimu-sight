import { useQuery } from '@tanstack/react-query'
import { analyticsClient } from '../api/analytics-client'

export function usePerformanceAnalytics(schoolId: string) {
  return useQuery({
    queryKey: ['analytics', 'performance', schoolId],
    queryFn: async () => {
      const res = await analyticsClient.performance(schoolId)
      return res.data.data
    },
    enabled: !!schoolId,
  })
}
