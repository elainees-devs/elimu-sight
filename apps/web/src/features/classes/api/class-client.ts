import { apiClient } from '@shared/lib/axios'
import type { ApiResponse } from '@shared/types/api'
import type { Class } from '@shared/types/common'

export const classClient = {
  listBySchool: (schoolId: string) =>
    apiClient.get<ApiResponse<Class[]>>(`/classes/school/${schoolId}`),

  get: (id: string) => apiClient.get<ApiResponse<Class>>(`/classes/${id}`),

  create: (data: { name: string; level: string; stream: string; academicYear: string; schoolId: string }) =>
    apiClient.post<ApiResponse<Class>>('/classes', data),

  update: (id: string, data: Partial<{ name: string; level: string; stream: string; academicYear: string }>) =>
    apiClient.patch<ApiResponse<Class>>(`/classes/${id}`, data),
}
