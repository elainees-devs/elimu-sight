import { useParams } from '@tanstack/react-router'

export function StudentDetailPage() {
  const { studentId } = useParams({ from: '/dashboard/students/$studentId' })
  return <h1 className="text-2xl font-bold text-gray-900">Student: {studentId}</h1>
}
