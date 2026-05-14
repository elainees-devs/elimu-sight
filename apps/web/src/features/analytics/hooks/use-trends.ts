import { useQuery } from '@tanstack/react-query'
import { analyticsClient } from '../api/analytics-client'

export function useTrends(schoolId: string) {
  return useQuery({
    queryKey: ['analytics', 'trends', schoolId],
    queryFn: async () => {
      const res = await analyticsClient.trends(schoolId)
      return res.data.data
    },
    enabled: !!schoolId,
  })
}
