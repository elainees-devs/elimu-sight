import { useAuthStore } from '@stores/auth-store'
import { usePerformanceAnalytics, useRiskAnalysis, useTrends, PerformanceChart, TrendChart, RiskMatrix } from '@features/analytics'
import { PageHeader } from '@shared/components/data-display/page-header'
import { Spinner } from "@elimu-sight/ui"

export function AnalyticsPage() {
  const schoolId = useAuthStore((s) => s.user?.schoolId) ?? ''
  const { data: performanceData, isLoading: perfLoading } = usePerformanceAnalytics(schoolId)
  const { data: riskData, isLoading: riskLoading } = useRiskAnalysis(schoolId)
  const { data: trendData, isLoading: trendLoading } = useTrends(schoolId)

  const isLoading = perfLoading || riskLoading || trendLoading

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analytics" subtitle="View performance analytics and trends" />
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="View performance analytics and trends" />

      {performanceData && performanceData.length > 0 && (
        <PerformanceChart data={performanceData} />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {trendData && trendData.length > 0 && (
          <TrendChart data={trendData} />
        )}
        {riskData && riskData.length > 0 && (
          <RiskMatrix data={riskData} />
        )}
      </div>

      {(!performanceData || performanceData.length === 0) &&
        (!trendData || trendData.length === 0) &&
        (!riskData || riskData.length === 0) && (
        <div className="rounded-lg border bg-white p-12 text-center">
          <p className="text-gray-500">No analytics data available yet. Start by adding assessments.</p>
        </div>
      )}
    </div>
  )
}
