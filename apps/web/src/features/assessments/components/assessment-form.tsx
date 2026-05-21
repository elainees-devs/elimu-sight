import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { assessmentSchema, type AssessmentFormData } from '../schemas/assessment-schema'
import { Input, Select, Textarea, Button } from "@elimu-sight/ui"
import { EXAM_TYPE_LABELS, EXAM_TYPES } from '@elimu-sight/types'

interface AssessmentFormProps {
  onSubmit: (data: AssessmentFormData) => void
  defaultValues?: Partial<AssessmentFormData>
  isLoading?: boolean
  students?: { value: string; label: string }[]
  subjects?: { value: string; label: string }[]
}

export function AssessmentForm({ onSubmit, defaultValues, isLoading, students = [], subjects = [] }: AssessmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Student"
        options={students}
        placeholder="Select student"
        error={errors.studentId?.message}
        {...register('studentId')}
      />
      <Select
        label="Subject"
        options={subjects}
        placeholder="Select subject"
        error={errors.subjectId?.message}
        {...register('subjectId')}
      />
      <Input label="Term" error={errors.term?.message} {...register('term')} />
      <Select
        label="Exam Type"
        options={EXAM_TYPES.map((t) => ({ value: t, label: EXAM_TYPE_LABELS[t] }))}
        placeholder="Select exam type"
        error={errors.examType?.message}
        {...register('examType')}
      />
      <Input label="Score" type="number" error={errors.score?.message} {...register('score')} />
      <Input label="Total Marks" type="number" error={errors.totalMarks?.message} {...register('totalMarks')} />
      <Input label="Grade" error={errors.grade?.message} {...register('grade')} />
      <Textarea label="Remarks" {...register('remarks')} />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save'}
      </Button>
    </form>
  )
}
