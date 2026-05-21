import { useState } from 'react'
import { useAuditLogs, useAuditLogStats, useSecurityOverview } from '@features/admin'
import { MetricCard } from '@features/admin/components/metric-card'
import { AuditLogTable } from '@features/admin/components/audit-log-table'

export function SecurityAuditPage() {
  const [page, setPage] = useState(1)
  const [actionFilter, setActionFilter] = useState('')
  const { data: logs, isLoading: logsLoading } = useAuditLogs({
    page: String(page), limit: '20',
    ...(actionFilter ? { action: actionFilter } : {}),
  })
  const { data: stats, isLoading: statsLoading } = useAuditLogStats()
  const { data: security, isLoading: securityLoading } = useSecurityOverview()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security & Audit</h1>
        <p className="mt-1 text-gray-600">Audit log table with filters and security stats</p>
      </div>

      {securityLoading ? (
        <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
      ) : security ? (
        <div className="grid gap-6 sm:grid-cols-3">
          <MetricCard label="Failed Logins (30d)" value={security.failedLogins} />
          <MetricCard label="Role Changes (30d)" value={security.roleChanges} />
          <MetricCard label="Security Alerts (30d)" value={security.recentAlerts} />
        </div>
      ) : null}

      {statsLoading ? (
        <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
      ) : stats ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">By Action</h2>
            <div className="space-y-2">
              {stats.byAction.map((a) => (
                <div key={a.action} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{a.action}</span>
                  <span className="text-sm font-medium text-gray-900">{a.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">By Resource</h2>
            <div className="space-y-2">
              {stats.byResource.map((r) => (
                <div key={r.resource} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{r.resource}</span>
                  <span className="text-sm font-medium text-gray-900">{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <select
          className="rounded-lg border px-3 py-2 text-sm"
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(1) }}
        >
          <option value="">All actions</option>
          <option value="USER_CREATED">User Created</option>
          <option value="USER_UPDATED">User Updated</option>
          <option value="USER_DEACTIVATED">User Deactivated</option>
          <option value="SCHOOL_CREATED">School Created</option>
          <option value="SCHOOL_UPDATED">School Updated</option>
          <option value="LOGIN_FAILED">Login Failed</option>
          <option value="USER_ROLE_CHANGED">Role Changed</option>
        </select>
        <span className="text-sm text-gray-500">
          {stats ? `Total: ${stats.totalLogs} logs` : ''}
        </span>
      </div>

      <AuditLogTable logs={logs?.data || []} isLoading={logsLoading} />

      {logs?.meta && logs.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50">Previous</button>
          <span className="text-sm text-gray-600">Page {page} of {logs.meta.totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(logs.meta.totalPages, p + 1))} disabled={page >= logs.meta.totalPages} className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  )
}
