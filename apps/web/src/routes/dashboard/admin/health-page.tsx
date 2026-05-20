import { useSystemHealth } from '@features/admin'
import { HealthIndicator } from '@features/admin/components/health-indicator'
import { StatusBadge } from '@features/admin/components/status-badge'

export function SystemHealthPage() {
  const { data: health, isLoading } = useSystemHealth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
        <p className="mt-1 text-gray-600">Service status, uptime, and response times</p>
      </div>

      {isLoading ? (
        <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
      ) : health ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Database</p>
            <div className="mt-2 flex items-center gap-2">
              <HealthIndicator status={health.database.status} />
              <StatusBadge status={health.database.status} />
            </div>
            {health.database.latency !== null && (
              <p className="mt-1 text-xs text-gray-400">{health.database.latency}ms latency</p>
            )}
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">API Server</p>
            <div className="mt-2 flex items-center gap-2">
              <HealthIndicator status={health.api.status} />
              <StatusBadge status={health.api.status} />
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Uptime: {Math.floor(health.api.uptime / 60)}m
            </p>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Response Time</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{health.responseTime}ms</p>
          </div>
        </div>
      ) : null}

      {health && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Memory Usage</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-gray-500">RSS</p>
              <p className="text-lg font-semibold text-gray-900">
                {Math.round(health.api.memory.rss / 1024 / 1024)} MB
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Heap Total</p>
              <p className="text-lg font-semibold text-gray-900">
                {Math.round(health.api.memory.heapTotal / 1024 / 1024)} MB
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Heap Used</p>
              <p className="text-lg font-semibold text-gray-900">
                {Math.round(health.api.memory.heapUsed / 1024 / 1024)} MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
