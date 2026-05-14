import { Card, CardBody } from '@shared/components/ui/card'
import { Badge } from '@shared/components/ui/badge'
import type { Student } from '@shared/types/common'

interface StudentCardProps {
  student: Student
  onClick?: () => void
}

export function StudentCard({ student, onClick }: StudentCardProps) {
  return (
    <Card className={onClick ? 'cursor-pointer hover:shadow-md' : ''} onClick={onClick}>
      <CardBody>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{student.fullName}</h3>
            {student.admissionNumber && (
              <p className="text-sm text-gray-500">Adm: {student.admissionNumber}</p>
            )}
            {student.guardianName && (
              <p className="text-sm text-gray-600">Guardian: {student.guardianName}</p>
            )}
          </div>
          <Badge variant={student.isActive ? 'success' : 'danger'}>
            {student.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardBody>
    </Card>
  )
}
