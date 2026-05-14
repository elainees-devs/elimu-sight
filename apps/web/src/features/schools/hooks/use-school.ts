import { useQuery } from '@tanstack/react-query'
import { schoolClient } from '../api/school-client'

export function useSchool(id: string) {
  return useQuery({
    queryKey: ['schools', id],
    queryFn: async () => {
      const res = await schoolClient.get(id)
      return res.data.data
    },
    enabled: !!id,
  })
}
