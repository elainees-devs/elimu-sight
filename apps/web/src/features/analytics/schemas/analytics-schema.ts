import { z } from 'zod'

export const analyticsFilterSchema = z.object({
  schoolId: z.string().uuid().optional(),
  classId: z.string().uuid().optional(),
  subjectId: z.string().uuid().optional(),
  period: z.string().optional(),
})

export type AnalyticsFilter = z.infer<typeof analyticsFilterSchema>
