import { useQuery } from '@tanstack/react-query'
import { teacherClient } from '../api/teacher-client'

export function useTeacher(id: string) {
  return useQuery({
    queryKey: ['teachers', id],
    queryFn: async () => {
      const res = await teacherClient.detail(id)
      return res.data.data
    },
    enabled: !!id,
  })
}
