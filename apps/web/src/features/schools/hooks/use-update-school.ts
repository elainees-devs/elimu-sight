import { useMutation, useQueryClient } from '@tanstack/react-query'
import { schoolClient } from '../api/school-client'

export function useUpdateSchool(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof schoolClient.update>[1]) =>
      schoolClient.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] })
    },
  })
}
