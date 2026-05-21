import { apiClient } from '@shared/lib/axios'
import type { ApiResponse, Subject } from "@elimu-sight/types"

export const subjectClient = {
  list: (schoolId: string) => apiClient.get<ApiResponse<Subject[]>>(`/subjects/school/${schoolId}`),

  create: (data: { name: string; schoolId: string; code?: string; description?: string }) =>
    apiClient.post<ApiResponse<Subject>>('/subjects', data),
}
