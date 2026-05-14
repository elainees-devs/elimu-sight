import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { subjectSchema, type SubjectFormData } from '../schemas/subject-schema'
import { Input } from '@shared/components/ui/input'
import { Textarea } from '@shared/components/ui/textarea'
import { Button } from '@shared/components/ui/button'

interface SubjectFormProps {
  onSubmit: (data: SubjectFormData) => void
  defaultValues?: Partial<SubjectFormData>
  isLoading?: boolean
}

export function SubjectForm({ onSubmit, defaultValues, isLoading }: SubjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Subject Name" error={errors.name?.message} {...register('name')} />
      <Input label="Code" error={errors.code?.message} {...register('code')} />
      <Textarea label="Description" {...register('description')} />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save'}
      </Button>
    </form>
  )
}
