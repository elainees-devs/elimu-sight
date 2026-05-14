import { useQuery } from '@tanstack/react-query'
import { studentClient } from '../api/student-client'

export function useStudents(params?: { schoolId?: string; classId?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['students', params],
    queryFn: async () => {
      const res = await studentClient.list(params)
      return res.data
    },
  })
}
