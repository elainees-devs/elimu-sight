import { useQuery } from '@tanstack/react-query'
import { teacherClient } from '../api/teacher-client'

export function useTeachers() {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const res = await teacherClient.list()
      return res.data.data
    },
  })
}
