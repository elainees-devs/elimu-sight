import { apiClient } from '@shared/lib/axios'
import type { ApiResponse } from '@shared/types/api'
import type { Insight } from '@shared/types/common'

export const insightClient = {
  get: (id: string) => apiClient.get<ApiResponse<Insight>>(`/insights/crud/${id}`),

  create: (data: { schoolId: string; classId: string; studentId: string; subjectId: string; title?: string; summary?: string; type?: string }) =>
    apiClient.post<ApiResponse<Insight>>('/insights/crud', data),

  generateBulk: (data: { schoolId: string; classId?: string; subjectId?: string; period?: string }) =>
    apiClient.post<ApiResponse<Insight[]>>('/insights/query/bulk-generate', data),
}
