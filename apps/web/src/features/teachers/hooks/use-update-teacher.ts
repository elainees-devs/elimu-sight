import { useMutation, useQueryClient } from '@tanstack/react-query'
import { teacherClient } from '../api/teacher-client'
import type { TeacherUpdateInput } from '../types'

export function useUpdateTeacher(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TeacherUpdateInput) =>
      teacherClient.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
  })
}
