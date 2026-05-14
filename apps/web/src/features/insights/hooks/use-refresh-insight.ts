import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@shared/lib/axios'
import type { ApiResponse } from '@shared/types/api'
import type { Insight } from '@shared/types/common'

export function useRefreshInsight() {
  return useMutation({
    mutationFn: async (insightId: string) => {
      const res = await apiClient.post<ApiResponse<Insight>>('/ai/refresh', { insightId })
      return res.data.data
    },
  })
}
