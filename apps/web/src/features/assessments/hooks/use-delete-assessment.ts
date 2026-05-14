import { useMutation, useQueryClient } from '@tanstack/react-query'
import { assessmentClient } from '../api/assessment-client'

export function useDeleteAssessment(schoolId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => assessmentClient.delete(schoolId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments', schoolId] })
    },
  })
}
