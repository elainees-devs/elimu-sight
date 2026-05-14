import { useMutation, useQueryClient } from '@tanstack/react-query'
import { teacherClient } from '../api/teacher-client'
import type { TeacherFormData } from '../schemas/teacher-schema'

export function useCreateTeacher(schoolId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TeacherFormData) =>
      teacherClient.create({ ...data, schoolId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
  })
}
