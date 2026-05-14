import { useState } from 'react'
import { Button } from '@shared/components/ui/button'
import { Select } from '@shared/components/ui/select'
import { INSIGHT_TYPES } from '@shared/lib/constants'

interface InsightGeneratorProps {
  onGenerate: (params: { type: string; classId?: string; studentId?: string; subjectId?: string }) => void
  isLoading?: boolean
  classes?: { value: string; label: string }[]
  subjects?: { value: string; label: string }[]
}

export function InsightGenerator({ onGenerate, isLoading, classes = [], subjects = [] }: InsightGeneratorProps) {
  const [type, setType] = useState('')
  const [classId, setClassId] = useState('')
  const [subjectId, setSubjectId] = useState('')

  const handleGenerate = () => {
    if (!type) return
    onGenerate({ type, classId: classId || undefined, subjectId: subjectId || undefined })
  }

  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-900">Generate Insight</h3>
      <div className="mt-4 space-y-4">
        <Select
          label="Insight Type"
          options={INSIGHT_TYPES.map((t) => ({ value: t, label: t.replace(/_/g, ' ') }))}
          placeholder="Select type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <Select
          label="Class (optional)"
          options={classes}
          placeholder="All classes"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
        />
        <Select
          label="Subject (optional)"
          options={subjects}
          placeholder="All subjects"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
        />
        <Button onClick={handleGenerate} disabled={!type || isLoading}>
          {isLoading ? 'Generating...' : 'Generate Insight'}
        </Button>
      </div>
    </div>
  )
}
