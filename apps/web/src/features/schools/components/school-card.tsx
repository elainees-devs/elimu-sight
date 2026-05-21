import { Card, CardBody, Badge } from "@elimu-sight/ui"
import type { School } from "@elimu-sight/types"

interface SchoolCardProps {
  school: School
  onClick?: () => void
}

export function SchoolCard({ school, onClick }: SchoolCardProps) {
  return (
    <Card className={onClick ? 'cursor-pointer hover:shadow-md' : ''} onClick={onClick}>
      <CardBody>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{school.name}</h3>
            <p className="text-sm text-gray-600">{school.email}</p>
            <p className="text-sm text-gray-600">{school.phone}</p>
          </div>
          <Badge variant={school.isActive ? 'success' : 'danger'}>
            {school.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardBody>
    </Card>
  )
}
