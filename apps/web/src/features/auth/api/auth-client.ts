import { apiClient } from '@shared/lib/axios'
import type { ApiResponse } from '@shared/types/api'
import type { User } from '@shared/types/common'
import type { LoginResponse } from '../types'

export const authClient = {
  login: (email: string, password: string) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/login', { email, password }),

  register: (data: { fullName: string; email: string; password: string; schoolId: string; role: string }) =>
    apiClient.post<ApiResponse<User>>('/auth/register', data),

  refresh: (refreshToken: string) =>
    apiClient.post<ApiResponse<{ token: string; refreshToken: string }>>('/auth/refresh', { refreshToken }),

  logout: () =>
    apiClient.post<ApiResponse<null>>('/auth/logout'),

  getMe: () =>
    apiClient.get<ApiResponse<User>>('/auth/me'),
}
