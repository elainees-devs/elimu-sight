import { cn } from '@shared/lib/cn'
import { generateInitials } from '@shared/lib/utils'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-blue-100 font-medium text-blue-700',
        sizeClasses[size],
        className,
      )}
      title={name}
    >
      {generateInitials(name)}
    </div>
  )
}
