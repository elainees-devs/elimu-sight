import { useMutation, useQueryClient } from '@tanstack/react-query'
import { studentClient } from '../api/student-client'

export function useUpdateStudent(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof studentClient.update>[1]) =>
      studentClient.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}
