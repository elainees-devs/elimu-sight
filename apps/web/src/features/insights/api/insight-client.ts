import { apiClient } from '@shared/lib/axios'
import type { ApiResponse, Insight } from "@elimu-sight/types"

export const insightClient = {
  get: (id: string) => apiClient.get<ApiResponse<Insight>>(`/insights/crud/${id}`),

  listBySchool: (schoolId: string, page?: number, limit?: number) =>
    apiClient.get<ApiResponse<{
      schoolId: string
      total: number
      page: number
      limit: number
      totalPages: number
      insights: Insight[]
    }>>(`/insights/query/school/${schoolId}`, { params: { page, limit } }),

  create: (data: { schoolId: string; classId: string; studentId: string; subjectId: string; title?: string; summary?: string; type?: string }) =>
    apiClient.post<ApiResponse<Insight>>('/insights/crud', data),

  generateBulk: (data: { schoolId: string; classId?: string; subjectId?: string; period?: string }) =>
    apiClient.post<ApiResponse<Insight[]>>('/insights/query/bulk-generate', data),
}
