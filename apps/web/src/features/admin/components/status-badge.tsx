import { cn } from '@elimu-sight/ui'

interface StatusBadgeProps {
  status: string
  className?: string
}

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
  published: 'bg-green-100 text-green-800',
  draft: 'bg-yellow-100 text-yellow-800',
  archived: 'bg-gray-100 text-gray-800',
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
  healthy: 'bg-green-100 text-green-800',
  degraded: 'bg-red-100 text-red-800',
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
  free: 'bg-gray-100 text-gray-800',
  basic: 'bg-blue-100 text-blue-800',
  premium: 'bg-purple-100 text-purple-800',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status.toLowerCase().replace(/\s+/g, '_')
  const style = statusStyles[key] || 'bg-gray-100 text-gray-800'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        style,
        className,
      )}
    >
      {status.toLowerCase().replace(/_/g, ' ')}
    </span>
  )
}
