import { z } from 'zod'

export const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().optional(),
  description: z.string().optional(),
})

export type SubjectFormData = z.infer<typeof subjectSchema>
