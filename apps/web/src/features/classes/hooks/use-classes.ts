import { useQuery } from '@tanstack/react-query'
import { classClient } from '../api/class-client'

export function useClasses(schoolId: string) {
  return useQuery({
    queryKey: ['classes', schoolId],
    queryFn: async () => {
      const res = await classClient.listBySchool(schoolId)
      return res.data.data
    },
    enabled: !!schoolId,
  })
}
