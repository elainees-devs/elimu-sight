import { type ReactNode } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  SortableHeader,
  Spinner,
} from '@elimu-sight/ui'

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  render?: (item: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  emptyState?: ReactNode
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (key: string) => void
  onRowClick?: (item: T) => void
}

export function DataTable<T extends object>({
  columns,
  data,
  isLoading,
  emptyState,
  sortBy,
  sortOrder,
  onSort,
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="py-12">
        {emptyState || (
          <p className="text-center text-sm text-gray-500">No data available.</p>
        )}
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) =>
            col.sortable ? (
              <SortableHeader
                key={col.key}
                active={sortBy === col.key}
                sortDirection={sortBy === col.key ? sortOrder : null}
                onClick={() => onSort?.(col.key)}
                className={col.className}
              >
                {col.header}
              </SortableHeader>
            ) : (
              <TableHead key={col.key} className={col.className}>
                {col.header}
              </TableHead>
            ),
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
          {data.map((item, i) => (
          <TableRow
            key={(item as Record<string, unknown>).id as string || i}
            onClick={() => onRowClick?.(item)}
            className={onRowClick ? 'cursor-pointer' : ''}
          >
            {columns.map((col) => (
              <TableCell key={col.key} className={col.className}>
                {col.render ? col.render(item) : ((item as Record<string, unknown>)[col.key] as ReactNode)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
