import { apiClient } from '@shared/lib/axios'
import type { ApiPaginatedResponse, ApiResponse } from '@shared/types/api'
import type { School } from '@shared/types/common'
import type { PaginationMeta } from '@shared/types/pagination'

export const schoolClient = {
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<ApiPaginatedResponse<School>>('/schools', { params }),

  get: (id: string) => apiClient.get<ApiResponse<School>>(`/schools/${id}`),

  create: (data: { name: string; email: string; phone: string; address?: string }) =>
    apiClient.post<ApiResponse<School>>('/schools', data),

  update: (id: string, data: Partial<{ name: string; email: string; phone: string; address: string }>) =>
    apiClient.patch<ApiResponse<School>>(`/schools/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<void>>(`/schools/${id}`),
}
