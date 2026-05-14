import { useMutation, useQueryClient } from '@tanstack/react-query'
import { studentClient } from '../api/student-client'

export function useDeleteStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => studentClient.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}
