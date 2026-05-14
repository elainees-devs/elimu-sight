import { z } from 'zod'

export const schoolSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().optional(),
})

export type SchoolFormData = z.infer<typeof schoolSchema>
