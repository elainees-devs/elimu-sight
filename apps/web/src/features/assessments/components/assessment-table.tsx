import { DataTable, type Column } from '@shared/components/data-display/data-table'
import { Badge } from '@shared/components/ui/badge'
import type { Assessment } from '@shared/types/common'
import { formatDate } from '@shared/lib/formatters'

const columns: Column<Assessment>[] = [
  { key: 'examType', header: 'Type', sortable: true },
  { key: 'term', header: 'Term' },
  { key: 'subjectId', header: 'Subject' },
  { key: 'score', header: 'Score' },
  { key: 'totalMarks', header: 'Total' },
  {
    key: 'grade',
    header: 'Grade',
    render: (assessment) => <Badge>{assessment.grade}</Badge>,
  },
  {
    key: 'createdAt',
    header: 'Date',
    render: (assessment) => formatDate(assessment.createdAt),
  },
]

interface AssessmentTableProps {
  data: Assessment[]
  isLoading?: boolean
  onRowClick?: (assessment: Assessment) => void
}

export function AssessmentTable({ data, isLoading, onRowClick }: AssessmentTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      onRowClick={onRowClick}
    />
  )
}
