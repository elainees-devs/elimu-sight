import { DataTable, type Column } from '@shared/components/data-display/data-table'
import { Badge } from '@shared/components/ui/badge'
import type { Student } from '@shared/types/common'

const columns: Column<Student>[] = [
  { key: 'fullName', header: 'Name', sortable: true },
  { key: 'admissionNumber', header: 'Admission No.' },
  { key: 'gender', header: 'Gender' },
  { key: 'guardianName', header: 'Guardian' },
  { key: 'guardianPhone', header: 'Guardian Phone' },
  {
    key: 'isActive',
    header: 'Status',
    render: (student) => (
      <Badge variant={student.isActive ? 'success' : 'danger'}>
        {student.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
]

interface StudentTableProps {
  data: Student[]
  isLoading?: boolean
  onRowClick?: (student: Student) => void
}

export function StudentTable({ data, isLoading, onRowClick }: StudentTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      onRowClick={onRowClick}
    />
  )
}
