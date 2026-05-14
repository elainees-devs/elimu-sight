import { type LabelHTMLAttributes, forwardRef } from 'react'
import { cn } from '@shared/lib/cn'

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('block text-sm font-medium text-gray-700', className)}
        {...props}
      />
    )
  },
)
Label.displayName = 'Label'
