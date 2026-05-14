import { useMutation, useQueryClient } from '@tanstack/react-query'
import { subjectClient } from '../api/subject-client'
import type { SubjectFormData } from '../schemas/subject-schema'

export function useCreateSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SubjectFormData) => subjectClient.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
    },
  })
}
