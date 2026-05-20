import { apiClient } from '@shared/lib/axios'
import type { ApiResponse } from '@shared/types/api'
import type { User } from '@shared/types/common'

export const teacherClient = {
  list: () => apiClient.get<ApiResponse<User[]>>('/teachers'),

  detail: (id: string) => apiClient.get<ApiResponse<User>>(`/teachers/${id}`),

  update: (id: string, data: { fullName?: string; email?: string }) =>
    apiClient.patch<ApiResponse<User>>(`/teachers/${id}`, data),

  assignClass: (id: string, classId: string) =>
    apiClient.post<ApiResponse<User>>(`/teachers/${id}/assign-class`, { classId }),

  create: (data: { fullName: string; email: string; password: string; schoolId: string }) =>
    apiClient.post<ApiResponse<User>>('/auth/register', { ...data, role: 'TEACHER' }),
}
