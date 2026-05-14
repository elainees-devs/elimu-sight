import { useQuery } from '@tanstack/react-query'
import { insightClient } from '../api/insight-client'

export function useInsight(id: string) {
  return useQuery({
    queryKey: ['insights', id],
    queryFn: async () => {
      const res = await insightClient.get(id)
      return res.data.data
    },
    enabled: !!id,
  })
}

export function useSchoolInsights(schoolId: string, page?: number) {
  return useQuery({
    queryKey: ['insights', 'school', schoolId, page ?? 1],
    queryFn: async () => {
      const res = await insightClient.listBySchool(schoolId, page)
      return res.data.data
    },
    enabled: !!schoolId,
  })
}
