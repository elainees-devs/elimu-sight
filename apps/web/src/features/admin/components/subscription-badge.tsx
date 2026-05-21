import { cn } from '@elimu-sight/ui'

interface SubscriptionBadgeProps {
  plan: string
  className?: string
}

const planColors: Record<string, string> = {
  free: 'bg-gray-100 text-gray-700',
  basic: 'bg-blue-100 text-blue-700',
  premium: 'bg-purple-100 text-purple-700',
}

export function SubscriptionBadge({ plan, className }: SubscriptionBadgeProps) {
  const key = plan.toLowerCase()
  const color = planColors[key] || 'bg-gray-100 text-gray-700'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        color,
        className,
      )}
    >
      {plan}
    </span>
  )
}
