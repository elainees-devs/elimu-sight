import { useMutation, useQueryClient } from '@tanstack/react-query'
import { assessmentClient } from '../api/assessment-client'

export function useUpdateAssessment(schoolId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof assessmentClient.update>[2] }) =>
      assessmentClient.update(schoolId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments', schoolId] })
    },
  })
}
