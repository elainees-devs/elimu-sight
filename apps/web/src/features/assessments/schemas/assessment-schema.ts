import { z } from 'zod'

export const assessmentSchema = z.object({
  studentId: z.string().uuid('Select a student'),
  subjectId: z.string().uuid('Select a subject'),
  term: z.string().min(1, 'Term is required'),
  examType: z.string().min(1, 'Exam type is required'),
  score: z.coerce.number().min(0, 'Score must be 0 or more'),
  totalMarks: z.coerce.number().min(1, 'Total marks must be at least 1'),
  grade: z.string().min(1, 'Grade is required'),
  remarks: z.string().optional(),
})

export type AssessmentFormData = z.infer<typeof assessmentSchema>
