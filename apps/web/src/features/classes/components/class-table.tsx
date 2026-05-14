import { DataTable, type Column } from '@shared/components/data-display/data-table'
import type { Class } from '@shared/types/common'

const columns: Column<Class>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'level', header: 'Level' },
  { key: 'stream', header: 'Stream' },
  { key: 'academicYear', header: 'Academic Year' },
]

interface ClassTableProps {
  data: Class[]
  isLoading?: boolean
  onRowClick?: (classItem: Class) => void
}

export function ClassTable({ data, isLoading, onRowClick }: ClassTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      onRowClick={onRowClick}
    />
  )
}
