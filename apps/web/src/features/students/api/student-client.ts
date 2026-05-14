import { apiClient } from '@shared/lib/axios'
import type { ApiResponse } from '@shared/types/api'
import type { Student } from '@shared/types/common'

export const studentClient = {
  list: (params?: { schoolId?: string; classId?: string; page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<Student[]>>('/students', { params }),

  get: (id: string) => apiClient.get<ApiResponse<Student>>(`/students/${id}`),

  create: (data: { fullName: string; schoolId: string; classId: string; gender?: string; dateOfBirth?: string; guardianName?: string; guardianPhone?: string }) =>
    apiClient.post<ApiResponse<Student>>('/students', data),

  update: (id: string, data: Partial<{ fullName: string; gender: string; dateOfBirth: string; guardianName: string; guardianPhone: string; classId: string }>) =>
    apiClient.patch<ApiResponse<Student>>(`/students/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<void>>(`/students/${id}`),

  transfer: (id: string, classId: string) =>
    apiClient.patch<ApiResponse<Student>>(`/students/${id}/transfer`, { classId }),
}
