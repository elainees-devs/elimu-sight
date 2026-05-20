import { useMutation, useQueryClient } from '@tanstack/react-query'
import { teacherClient } from '../api/teacher-client'

export function useAssignClass(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (classId: string) =>
      teacherClient.assignClass(id, classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
  })
}
