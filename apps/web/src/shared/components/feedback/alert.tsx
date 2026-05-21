import { type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@elimu-sight/ui'

const alertVariants = cva(
  'rounded-lg border px-4 py-3 text-sm',
  {
    variants: {
      variant: {
        info: 'border-blue-200 bg-blue-50 text-blue-800',
        success: 'border-green-200 bg-green-50 text-green-800',
        warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
        error: 'border-red-200 bg-red-50 text-red-800',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
)

interface AlertProps extends VariantProps<typeof alertVariants> {
  title?: string
  children: ReactNode
  className?: string
}

export function Alert({ title, children, variant, className }: AlertProps) {
  return (
    <div className={cn(alertVariants({ variant }), className)}>
      {title && <p className="mb-1 font-medium">{title}</p>}
      <div>{children}</div>
    </div>
  )
}
