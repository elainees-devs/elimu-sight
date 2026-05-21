import { useMutation, useQueryClient } from '@tanstack/react-query'
import { subjectClient } from '../api/subject-client'
import type { SubjectFormData } from '../schemas/subject-schema'
import { useAuthStore } from '@stores/auth-store'

export function useCreateSubject() {
  const queryClient = useQueryClient()
  const schoolId = useAuthStore((s) => s.user?.schoolId)

  return useMutation({
    mutationFn: (data: SubjectFormData) => 
      subjectClient.create({ ...data, schoolId: schoolId || '' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
    },
  })
}
