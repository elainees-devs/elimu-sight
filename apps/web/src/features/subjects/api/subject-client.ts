import { apiClient } from '@shared/lib/axios'
import type { ApiResponse } from '@shared/types/api'
import type { Subject } from '@shared/types/common'

export const subjectClient = {
  list: () => apiClient.get<ApiResponse<Subject[]>>('/subjects'),

  create: (data: { name: string; code?: string; description?: string }) =>
    apiClient.post<ApiResponse<Subject>>('/subjects', data),
}
