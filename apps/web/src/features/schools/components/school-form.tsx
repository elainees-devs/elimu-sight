import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { schoolSchema, type SchoolFormData } from '../schemas/school-schema'
import { Input, Button } from "@elimu-sight/ui"

interface SchoolFormProps {
  onSubmit: (data: SchoolFormData) => void
  defaultValues?: Partial<SchoolFormData>
  isLoading?: boolean
}

export function SchoolForm({ onSubmit, defaultValues, isLoading }: SchoolFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="School Name" error={errors.name?.message} {...register('name')} />
      <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
      <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
      <Input label="Address" error={errors.address?.message} {...register('address')} />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save'}
      </Button>
    </form>
  )
}
