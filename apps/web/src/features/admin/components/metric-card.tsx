import { type ReactNode } from 'react'
import { cn } from '@elimu-sight/ui'

interface MetricCardProps {
  label: string
  value: string | number | ReactNode
  icon?: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  subtitle?: string
  className?: string
}

export function MetricCard({ label, value, icon, trend, subtitle, className }: MetricCardProps) {
  return (
    <div className={cn('rounded-xl border bg-white p-6 shadow-sm', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        {typeof value === 'string' || typeof value === 'number' ? (
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        ) : (
          <div className="flex items-center">{value}</div>
        )}
        {trend && (
          <span
            className={cn(
              'text-sm font-medium',
              trend.isPositive ? 'text-green-600' : 'text-red-600',
            )}
          >
            {trend.isPositive ? '+' : ''}
            {trend.value}%
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
    </div>
  )
}
