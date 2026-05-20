import { Card, CardBody, CardHeader } from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import type { Class } from '@shared/types/common'

interface TeacherAssignClassProps {
  currentClassId?: string
  classes: Class[]
  isLoading?: boolean
  onAssign: (classId: string) => void
}

export function TeacherAssignClass({ currentClassId, classes, isLoading, onAssign }: TeacherAssignClassProps) {
  const currentClass = classes.find((c) => c.id === currentClassId)

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-gray-900">Class Assignment</h3>
      </CardHeader>
      <CardBody>
        {currentClass ? (
          <div className="mb-4">
            <p className="text-sm text-gray-500">Currently assigned to</p>
            <p className="text-base font-medium text-gray-900">{currentClass.name}</p>
          </div>
        ) : (
          <p className="mb-4 text-sm text-gray-500">Not assigned to any class</p>
        )}

        <div className="space-y-2">
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => onAssign(cls.id)}
              disabled={isLoading || cls.id === currentClassId}
              className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${
                cls.id === currentClassId
                  ? 'border-blue-300 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              } disabled:opacity-50`}
            >
              {cls.name}
            </button>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
