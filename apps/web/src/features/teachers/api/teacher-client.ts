import { apiClient } from '@shared/lib/axios'
import type { ApiResponse } from '@shared/types/api'
import type { User } from '@shared/types/common'

export const teacherClient = {
  list: () => apiClient.get<ApiResponse<User[]>>('/teachers'),

  create: (data: { fullName: string; email: string; password: string; schoolId: string }) =>
    apiClient.post<ApiResponse<User>>('/auth/register', { ...data, role: 'TEACHER' }),
}
