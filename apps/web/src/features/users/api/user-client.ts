import { apiClient } from '@shared/lib/axios'
import type { ApiPaginatedResponse, User } from "@elimu-sight/types"

export const userClient = {
  list: () => apiClient.get<ApiPaginatedResponse<User>>('/users'),

  update: (id: string, data: { fullName?: string; email?: string; isActive?: boolean }) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<User>>(`/users/${id}`),
}
