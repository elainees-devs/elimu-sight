import { useQuery } from '@tanstack/react-query'
import { assessmentClient } from '../api/assessment-client'

export function useAssessments(schoolId: string, params?: { classId?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['assessments', schoolId, params],
    queryFn: async () => {
      const res = await assessmentClient.listBySchool(schoolId, params)
      return res.data
    },
    enabled: !!schoolId,
  })
}
