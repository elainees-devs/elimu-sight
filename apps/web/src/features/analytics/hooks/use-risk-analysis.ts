import { useQuery } from '@tanstack/react-query'
import { analyticsClient } from '../api/analytics-client'

export function useRiskAnalysis(schoolId: string) {
  return useQuery({
    queryKey: ['analytics', 'risk', schoolId],
    queryFn: async () => {
      const res = await analyticsClient.riskMatrix(schoolId)
      return res.data.data
    },
    enabled: !!schoolId,
  })
}
