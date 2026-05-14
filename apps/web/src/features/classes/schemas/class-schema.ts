import { z } from 'zod'

export const classSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  level: z.string().min(1, 'Level is required'),
  stream: z.string().min(1, 'Stream is required'),
  academicYear: z.string().min(1, 'Academic year is required'),
})

export type ClassFormData = z.infer<typeof classSchema>
