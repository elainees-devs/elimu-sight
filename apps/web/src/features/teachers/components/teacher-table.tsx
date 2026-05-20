import { useNavigate } from '@tanstack/react-router'
import { DataTable, type Column } from '@shared/components/data-display/data-table'
import { Badge } from '@shared/components/ui/badge'
import type { User } from '@shared/types/common'
import { ROUTES } from '@shared/config/routes'

const columns: Column<User>[] = [
  { key: 'fullName', header: 'Name', sortable: true },
  { key: 'email', header: 'Email' },
  {
    key: 'isActive',
    header: 'Status',
    render: (teacher) => (
      <Badge variant={teacher.isActive ? 'success' : 'danger'}>
        {teacher.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
]

interface TeacherTableProps {
  data: User[]
  isLoading?: boolean
}

export function TeacherTable({ data, isLoading }: TeacherTableProps) {
  const navigate = useNavigate()

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      onRowClick={(teacher) => navigate({ to: ROUTES.TEACHER_DETAIL(teacher.id) })}
    />
  )
}
