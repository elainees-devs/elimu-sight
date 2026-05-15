import { useMutation, useQueryClient } from '@tanstack/react-query'
import { schoolClient } from '../api/school-client'

export function useDeleteSchool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => schoolClient.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] })
    },
  })
}
