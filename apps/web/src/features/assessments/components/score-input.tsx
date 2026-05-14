import { Input } from '@shared/components/ui/input'

interface ScoreInputProps {
  score: number
  totalMarks: number
  onScoreChange: (score: number) => void
  onTotalMarksChange: (totalMarks: number) => void
  grade?: string
}

export function ScoreInput({ score, totalMarks, onScoreChange, onTotalMarksChange, grade }: ScoreInputProps) {
  return (
    <div className="flex items-end gap-4">
      <div className="flex-1">
        <Input
          label="Score"
          type="number"
          value={score}
          onChange={(e) => onScoreChange(Number(e.target.value))}
        />
      </div>
      <div className="flex-1">
        <Input
          label="Total Marks"
          type="number"
          value={totalMarks}
          onChange={(e) => onTotalMarksChange(Number(e.target.value))}
        />
      </div>
      {grade && (
        <div className="pb-2">
          <span className="text-sm font-medium text-gray-500">Grade: </span>
          <span className="text-lg font-bold text-gray-900">{grade}</span>
        </div>
      )}
    </div>
  )
}
