import { apiClient } from '@shared/lib/axios'
import type { ApiResponse, Subject } from "@elimu-sight/types"

export const subjectClient = {
  list: () => apiClient.get<ApiResponse<Subject[]>>('/subjects'),

  create: (data: { name: string; code?: string; description?: string }) =>
    apiClient.post<ApiResponse<Subject>>('/subjects', data),
}
