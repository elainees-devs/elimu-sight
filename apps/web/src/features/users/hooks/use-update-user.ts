import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userClient } from '../api/user-client'

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof userClient.update>[1] }) =>
      userClient.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
