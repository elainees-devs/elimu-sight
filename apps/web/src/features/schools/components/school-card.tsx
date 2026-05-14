import { Card, CardBody } from '@shared/components/ui/card'
import { Badge } from '@shared/components/ui/badge'
import type { School } from '@shared/types/common'

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
