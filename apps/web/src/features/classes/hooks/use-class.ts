import { useQuery } from '@tanstack/react-query'
import { classClient } from '../api/class-client'

export function useClass(id: string) {
  return useQuery({
    queryKey: ['classes', id],
    queryFn: async () => {
      const res = await classClient.get(id)
      return res.data.data
    },
    enabled: !!id,
  })
}
