import { useQuery } from '@tanstack/react-query'
import { studentClient } from '../api/student-client'

export function useStudent(id: string) {
  return useQuery({
    queryKey: ['students', id],
    queryFn: async () => {
      const res = await studentClient.get(id)
      return res.data.data
    },
    enabled: !!id,
  })
}
