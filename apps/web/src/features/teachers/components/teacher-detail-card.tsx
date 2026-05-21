import { Card, CardBody, Badge } from "@elimu-sight/ui"
import { ROLE_LABELS } from '@shared/lib/constants'
import type { User } from "@elimu-sight/types"

interface TeacherDetailCardProps {
  teacher: User
  className?: string
}

export function TeacherDetailCard({ teacher, className }: TeacherDetailCardProps) {
  return (
    <Card className={className}>
      <CardBody>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{teacher.fullName}</h3>
              <p className="text-sm text-gray-600">{teacher.email}</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>Role: {ROLE_LABELS[teacher.role] || teacher.role}</span>
              <span>|</span>
              <Badge variant={teacher.isActive ? 'success' : 'danger'}>
                {teacher.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
