import { useMutation, useQueryClient } from '@tanstack/react-query'
import { classClient } from '../api/class-client'
import type { ClassFormData } from '../schemas/class-schema'

export function useCreateClass(schoolId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ClassFormData) =>
      classClient.create({ ...data, schoolId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes', schoolId] })
    },
  })
}
