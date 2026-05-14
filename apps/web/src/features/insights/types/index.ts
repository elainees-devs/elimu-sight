export type InsightData = {
  id: string
  schoolId: string
  classId: string
  studentId: string
  subjectId: string
  type?: string
  title?: string
  summary?: string
  data?: unknown
  confidenceScore?: number
  generatedBy?: string
  period?: string
  createdAt: string
  updatedAt?: string
}

export type GenerateInsightInput = {
  type: string
  classId?: string
  studentId?: string
  subjectId?: string
  period?: string
}
