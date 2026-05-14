import { type HTMLAttributes, forwardRef, type ThHTMLAttributes } from 'react'
import { cn } from '@shared/lib/cn'

export const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div className="w-full overflow-auto">
        <table
          ref={ref}
          className={cn('w-full caption-bottom text-sm', className)}
          {...props}
        />
      </div>
    )
  },
)
Table.displayName = 'Table'

export const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => {
    return <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
  },
)
TableHeader.displayName = 'TableHeader'

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => {
    return (
      <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
    )
  },
)
TableBody.displayName = 'TableBody'

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn('border-b transition-colors hover:bg-gray-50', className)}
        {...props}
      />
    )
  },
)
TableRow.displayName = 'TableRow'

export const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={cn('h-12 px-4 text-left align-middle font-medium text-gray-500', className)}
        {...props}
      />
    )
  },
)
TableHead.displayName = 'TableHead'

export const TableCell = forwardRef<HTMLTableCellElement, HTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={cn('p-4 align-middle', className)}
        {...props}
      />
    )
  },
)
TableCell.displayName = 'TableCell'

interface SortableHeaderProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sortDirection?: 'asc' | 'desc' | null
  active?: boolean
}

export const SortableHeader = forwardRef<HTMLTableCellElement, SortableHeaderProps>(
  ({ className, sortDirection, active, children, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={cn(
          'h-12 cursor-pointer px-4 text-left align-middle text-sm font-medium transition-colors hover:text-gray-900',
          active ? 'text-gray-900' : 'text-gray-500',
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-1">
          {children}
          {sortDirection && (
            <span className="text-xs">{sortDirection === 'asc' ? '\u2191' : '\u2193'}</span>
          )}
        </div>
      </th>
    )
  },
)
SortableHeader.displayName = 'SortableHeader'
