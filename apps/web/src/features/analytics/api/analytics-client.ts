import { apiClient } from '@shared/lib/axios'
import type { ApiResponse } from '@shared/types/api'
import type { SummaryStats, PerformanceData, RiskData, TrendData } from '../types'

export const analyticsClient = {
  summary: (schoolId: string) =>
    apiClient.get<ApiResponse<SummaryStats>>(`/analytics/summary?schoolId=${schoolId}`),

  performance: (schoolId: string) =>
    apiClient.get<ApiResponse<PerformanceData[]>>(`/analytics/performance?schoolId=${schoolId}`),

  riskMatrix: (schoolId: string) =>
    apiClient.get<ApiResponse<RiskData[]>>(`/analytics/risk-matrix?schoolId=${schoolId}`),

  trends: (schoolId: string) =>
    apiClient.get<ApiResponse<TrendData[]>>(`/analytics/trends?schoolId=${schoolId}`),
}
