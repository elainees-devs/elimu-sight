import { useMutation, useQueryClient } from '@tanstack/react-query'
import { schoolClient } from '../api/school-client'
import type { SchoolFormData } from '../schemas/school-schema'

export function useCreateSchool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SchoolFormData) => schoolClient.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] })
    },
  })
}
