import { z } from 'zod'
import { ROLES } from '@elimu-sight/types'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  schoolId: z.string().uuid('Invalid school').optional().or(z.literal('')),
  role: z.enum(ROLES),
}).refine(
  (data) => data.role === 'SUPER_ADMIN' || (!!data.schoolId && data.schoolId.length > 0),
  { message: 'School is required for this role', path: ['schoolId'] },
)

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
