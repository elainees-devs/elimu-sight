import { useParams } from '@tanstack/react-router'

export function SchoolDetailPage() {
  const { schoolId } = useParams({ from: '/dashboard/schools/$schoolId' })
  return <h1 className="text-2xl font-bold text-gray-900">School: {schoolId}</h1>
}
