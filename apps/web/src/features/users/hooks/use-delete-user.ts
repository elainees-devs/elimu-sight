import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userClient } from '../api/user-client'

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => userClient.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
