import { StatusBadge } from './status-badge'

interface AuditLogEntry {
  id: string
  action: string
  resource: string
  userName: string | null
  schoolName: string | null
  ipAddress: string | null
  createdAt: string
}

interface AuditLogTableProps {
  logs: AuditLogEntry[]
  isLoading?: boolean
}

export function AuditLogTable({ logs, isLoading }: AuditLogTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">Action</th>
              <th className="px-4 py-3 font-medium text-gray-600">Resource</th>
              <th className="px-4 py-3 font-medium text-gray-600">User</th>
              <th className="px-4 py-3 font-medium text-gray-600">School</th>
              <th className="px-4 py-3 font-medium text-gray-600">Date</th>
              <th className="px-4 py-3 font-medium text-gray-600">IP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                Loading...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">Action</th>
              <th className="px-4 py-3 font-medium text-gray-600">Resource</th>
              <th className="px-4 py-3 font-medium text-gray-600">User</th>
              <th className="px-4 py-3 font-medium text-gray-600">School</th>
              <th className="px-4 py-3 font-medium text-gray-600">Date</th>
              <th className="px-4 py-3 font-medium text-gray-600">IP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                No audit logs found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-medium text-gray-600">Action</th>
            <th className="px-4 py-3 font-medium text-gray-600">Resource</th>
            <th className="px-4 py-3 font-medium text-gray-600">User</th>
            <th className="px-4 py-3 font-medium text-gray-600">School</th>
            <th className="px-4 py-3 font-medium text-gray-600">Date</th>
            <th className="px-4 py-3 font-medium text-gray-600">IP</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <StatusBadge status={log.action} />
              </td>
              <td className="px-4 py-3 text-gray-700">{log.resource}</td>
              <td className="px-4 py-3 text-gray-600">{log.userName || '-'}</td>
              <td className="px-4 py-3 text-gray-600">{log.schoolName || '-'}</td>
              <td className="px-4 py-3 text-xs text-gray-500">
                {new Date(log.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-xs text-gray-500">{log.ipAddress || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
