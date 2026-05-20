import { apiClient } from '@shared/lib/axios'
import type { ApiResponse } from '@shared/types/api'
import type { User } from '@shared/types/common'

export const userClient = {
  list: () => apiClient.get<{ success: boolean; message: string; data: User[]; meta: { page: number; limit: number; total: number; totalPages: number } }>('/users'),

  update: (id: string, data: { fullName?: string; email?: string; isActive?: boolean }) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<User>>(`/users/${id}`),
}
