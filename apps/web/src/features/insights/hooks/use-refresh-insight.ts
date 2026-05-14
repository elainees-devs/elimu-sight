import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@shared/lib/axios'
import type { ApiResponse } from '@shared/types/api'
import type { Insight } from '@shared/types/common'

export function useRefreshInsight() {
  return useMutation({
    mutationFn: async (params: { type: string; studentId: string; subjectId: string; classId: string }) => {
      const res = await apiClient.post<ApiResponse<Insight>>('/ai/generate/insight', { ...params, refresh: true })
      return res.data.data
    },
  })
}
