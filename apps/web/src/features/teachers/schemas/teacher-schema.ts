import { z } from 'zod'

export const teacherSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const updateTeacherSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').optional(),
  email: z.string().email('Invalid email').optional(),
})

export const assignClassSchema = z.object({
  classId: z.string().min(1, 'Class is required'),
})

export type TeacherFormData = z.infer<typeof teacherSchema>
export type UpdateTeacherInput = z.infer<typeof updateTeacherSchema>
export type AssignClassInput = z.infer<typeof assignClassSchema>
