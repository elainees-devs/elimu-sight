import { z } from 'zod'

export const createUserSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['TEACHER', 'ACCOUNTANT']),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
