import { z } from 'zod'

export const teacherSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type TeacherFormData = z.infer<typeof teacherSchema>
