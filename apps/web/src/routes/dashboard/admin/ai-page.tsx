import { useAIUsage, useAIUsageTrends, useInsightStats } from '@features/admin'
import { MetricCard } from '@features/admin/components/metric-card'

export function AIAnalyticsPage() {
  const { data: aiUsage, isLoading: aiLoading } = useAIUsage()
  const { data: trends, isLoading: trendsLoading } = useAIUsageTrends(30)
  const { data: insightStats, isLoading: insightLoading } = useInsightStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Analytics</h1>
        <p className="mt-1 text-gray-600">AI usage trends and per-school breakdown</p>
      </div>

      {aiLoading ? (
        <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
      ) : aiUsage ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard label="Total AI Requests" value={aiUsage.totalRequests} />
          <MetricCard label="Model Variants" value={aiUsage.modelDistribution.length} />
          <MetricCard label="Active Schools (AI)" value={aiUsage.topSchools.length} />
        </div>
      ) : null}

      {aiUsage && aiUsage.modelDistribution.length > 0 && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Model Distribution</h2>
          <div className="space-y-3">
            {aiUsage.modelDistribution.map((m) => (
              <div key={m.model} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{m.model}</span>
                <span className="text-sm font-medium text-gray-900">{m.count} requests</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {aiUsage && aiUsage.topSchools.length > 0 && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Top Schools by AI Usage</h2>
          <div className="space-y-3">
            {aiUsage.topSchools.map((s) => (
              <div key={s.schoolId} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{s.schoolName}</span>
                <span className="text-sm font-medium text-gray-900">{s.count} requests</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {insightLoading ? (
        <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
      ) : insightStats ? (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Insight Generation by School</h2>
          <p className="mb-3 text-sm text-gray-500">Total: {insightStats.totalInsights} insights</p>
          <div className="space-y-3">
            {insightStats.perSchool.map((s) => (
              <div key={s.schoolId} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{s.schoolName}</span>
                <span className="text-sm font-medium text-gray-900">{s.count} insights</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {trendsLoading ? (
        <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
      ) : trends && trends.length > 0 ? (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Daily AI Requests (30 days)</h2>
          <div className="space-y-1">
            {trends.slice(-14).map((t) => (
              <div key={t.date} className="flex items-center gap-3">
                <span className="w-24 text-xs text-gray-500">{t.date}</span>
                <div className="h-4 flex-1 rounded bg-gray-100">
                  <div
                    className="h-4 rounded bg-blue-500"
                    style={{ width: `${Math.min(100, (t.requests / Math.max(...trends.map((x) => x.requests))) * 100)}%` }}
                  />
                </div>
                <span className="w-12 text-right text-xs text-gray-600">{t.requests}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
