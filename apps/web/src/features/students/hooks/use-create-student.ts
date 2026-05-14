import { useMutation, useQueryClient } from '@tanstack/react-query'
import { studentClient } from '../api/student-client'
import type { StudentFormData } from '../schemas/student-schema'

export function useCreateStudent(schoolId: string, classId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: StudentFormData) =>
      studentClient.create({ ...data, schoolId, classId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}
