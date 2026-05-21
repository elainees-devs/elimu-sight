import { z } from 'zod'
import { INSIGHT_TYPES } from '@elimu-sight/types'

export const generateInsightSchema = z.object({
  type: z.enum(INSIGHT_TYPES),
  classId: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
  subjectId: z.string().uuid().optional(),
  period: z.string().optional(),
})

export const insightSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  summary: z.string().optional(),
  type: z.string().optional(),
})

export type GenerateInsightInput = z.infer<typeof generateInsightSchema>
