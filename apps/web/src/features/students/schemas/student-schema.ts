import { z } from 'zod'

export const studentSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
})

export type StudentFormData = z.infer<typeof studentSchema>
