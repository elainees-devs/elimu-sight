import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { classSchema, type ClassFormData } from '../schemas/class-schema'
import { Input } from '@shared/components/ui/input'
import { Button } from '@shared/components/ui/button'

interface ClassFormProps {
  onSubmit: (data: ClassFormData) => void
  defaultValues?: Partial<ClassFormData>
  isLoading?: boolean
}

export function ClassForm({ onSubmit, defaultValues, isLoading }: ClassFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Class Name" error={errors.name?.message} {...register('name')} />
      <Input label="Level" error={errors.level?.message} {...register('level')} />
      <Input label="Stream" error={errors.stream?.message} {...register('stream')} />
      <Input label="Academic Year" error={errors.academicYear?.message} {...register('academicYear')} />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save'}
      </Button>
    </form>
  )
}
