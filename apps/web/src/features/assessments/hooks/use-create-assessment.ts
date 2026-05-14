import { useMutation, useQueryClient } from '@tanstack/react-query'
import { assessmentClient } from '../api/assessment-client'

export function useCreateAssessment(schoolId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof assessmentClient.create>[0]) =>
      assessmentClient.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments', schoolId] })
    },
  })
}
