import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@shared/lib/axios'
import type { ApiResponse, Insight } from "@elimu-sight/types"

export function useRefreshInsight() {
  return useMutation({
    mutationFn: async (insightId: string) => {
      const res = await apiClient.post<ApiResponse<Insight>>('/ai/refresh', { insightId })
      return res.data.data
    },
  })
}
