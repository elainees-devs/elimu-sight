import { DataTable, type Column } from '@shared/components/data-display/data-table'
import { Badge } from "@elimu-sight/ui"
import type { User } from "@elimu-sight/types"
import { ROLE_LABELS } from '@shared/lib/constants'

const columns: Column<User>[] = [
  { key: 'fullName', header: 'Name', sortable: true },
  { key: 'email', header: 'Email' },
  {
    key: 'role',
    header: 'Role',
    render: (user) => (
      <Badge variant="default">{ROLE_LABELS[user.role] || user.role}</Badge>
    ),
  },
  {
    key: 'isActive',
    header: 'Status',
    render: (user) => (
      <Badge variant={user.isActive ? 'success' : 'danger'}>
        {user.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
]

interface UserTableProps {
  data: User[]
  isLoading?: boolean
  onDeactivate?: (user: User) => void
}

export function UserTable({ data, isLoading, onDeactivate }: UserTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
    />
  )
}
