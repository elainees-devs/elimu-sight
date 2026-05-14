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
