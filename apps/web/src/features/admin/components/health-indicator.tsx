import { cn } from '@shared/lib/cn'

interface HealthIndicatorProps {
  status: 'healthy' | 'degraded' | 'down' | 'connected' | 'disconnected' | 'running'
  label?: string
  className?: string
}

const dotColors: Record<string, string> = {
  healthy: 'bg-green-500',
  degraded: 'bg-yellow-500',
  down: 'bg-red-500',
  connected: 'bg-green-500',
  disconnected: 'bg-red-500',
  running: 'bg-green-500',
}

export function HealthIndicator({ status, label, className }: HealthIndicatorProps) {
  const dotColor = dotColors[status] || 'bg-gray-400'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('h-2.5 w-2.5 rounded-full', dotColor)} />
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </div>
  )
}
