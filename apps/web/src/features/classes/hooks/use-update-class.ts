import { useMutation, useQueryClient } from '@tanstack/react-query'
import { classClient } from '../api/class-client'

export function useUpdateClass(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof classClient.update>[1]) =>
      classClient.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
    },
  })
}
