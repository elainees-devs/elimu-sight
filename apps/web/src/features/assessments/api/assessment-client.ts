import { apiClient } from '@shared/lib/axios'
import type { ApiResponse } from '@shared/types/api'
import type { Assessment } from '@shared/types/common'

export const assessmentClient = {
  listBySchool: (schoolId: string, params?: { classId?: string; page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<Assessment[]>>(`/assessments/school/${schoolId}`, { params }),

  create: (data: { schoolId: string; classId: string; studentId: string; subjectId: string; term: string; examType: string; score: number; totalMarks: number; grade: string; remarks?: string }) =>
    apiClient.post<ApiResponse<Assessment>>('/assessments', data),

  update: (schoolId: string, id: string, data: Partial<{ score: number; totalMarks: number; grade: string; remarks: string }>) =>
    apiClient.patch<ApiResponse<Assessment>>(`/assessments/school/${schoolId}/${id}`, data),

  delete: (schoolId: string, id: string) =>
    apiClient.delete<ApiResponse<void>>(`/assessments/school/${schoolId}/${id}`),
}
