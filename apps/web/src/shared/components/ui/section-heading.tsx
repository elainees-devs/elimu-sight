import { type ReactNode } from 'react'
import { cn } from '@shared/lib/cn'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  alignment?: 'center' | 'left'
  gradient?: boolean
  className?: string
  children?: ReactNode
}

export function SectionHeading({
  title,
  subtitle,
  alignment = 'center',
  gradient = false,
  className,
  children,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        alignment === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      <h2
        className={cn(
          'text-3xl font-bold tracking-tight sm:text-4xl',
          gradient ? 'text-gradient' : 'text-gray-900',
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-gray-600">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  )
}
