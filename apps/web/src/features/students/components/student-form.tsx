import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { studentSchema, type StudentFormData } from '../schemas/student-schema'
import { Input } from '@shared/components/ui/input'
import { Select } from '@shared/components/ui/select'
import { Button } from '@shared/components/ui/button'

interface StudentFormProps {
  onSubmit: (data: StudentFormData) => void
  defaultValues?: Partial<StudentFormData>
  isLoading?: boolean
}

export function StudentForm({ onSubmit, defaultValues, isLoading }: StudentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Full Name" error={errors.fullName?.message} {...register('fullName')} />
      <Select
        label="Gender"
        options={[
          { value: 'Male', label: 'Male' },
          { value: 'Female', label: 'Female' },
        ]}
        placeholder="Select gender"
        {...register('gender')}
      />
      <Input label="Date of Birth" type="date" {...register('dateOfBirth')} />
      <Input label="Guardian Name" {...register('guardianName')} />
      <Input label="Guardian Phone" {...register('guardianPhone')} />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save'}
      </Button>
    </form>
  )
}
