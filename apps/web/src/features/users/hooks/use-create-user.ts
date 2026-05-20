import { useMutation, useQueryClient } from '@tanstack/react-query'
import { teacherClient } from '@features/teachers'
import type { CreateUserInput } from '../schemas/user-schema'

export function useCreateUser(schoolId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserInput) =>
      teacherClient.create({ ...data, schoolId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
  })
}
