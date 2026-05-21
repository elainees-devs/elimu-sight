import { Card, CardBody, Badge } from "@elimu-sight/ui"
import type { User } from "@elimu-sight/types"

interface TeacherCardProps {
  teacher: User
}

export function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{teacher.fullName}</h3>
            <p className="text-sm text-gray-600">{teacher.email}</p>
          </div>
          <Badge variant={teacher.isActive ? 'success' : 'danger'}>
            {teacher.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardBody>
    </Card>
  )
}
