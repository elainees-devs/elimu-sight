import { useQuery } from '@tanstack/react-query'
import { subjectClient } from '../api/subject-client'
import { useAuthStore } from '@stores/auth-store'

export function useSubjects() {
  const schoolId = useAuthStore((s) => s.user?.schoolId)

  return useQuery({
    queryKey: ['subjects', schoolId],
    queryFn: async () => {
      if (!schoolId) return []
      const res = await subjectClient.list(schoolId)
      return res.data.data
    },
    enabled: !!schoolId,
  })
}
