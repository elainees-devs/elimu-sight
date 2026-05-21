import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { registerSchema, type RegisterFormData } from '../schemas/auth-schema'
import { useRegister } from '../hooks/use-register'
import { ROLES, ROLE_LABELS } from '@elimu-sight/types'
import { apiClient } from '@shared/lib/axios'
import type { ApiResponse, School } from "@elimu-sight/types"

export function RegisterForm() {
  const navigate = useNavigate()
  const registerMutation = useRegister()

  useEffect(() => {
    if (registerMutation.isSuccess) {
      const timer = setTimeout(() => navigate({ to: '/auth/login' }), 1500)
      return () => clearTimeout(timer)
    }
  }, [registerMutation.isSuccess, navigate])

  const { data: schoolsData } = useQuery({
    queryKey: ['schools'],
    queryFn: () =>
      apiClient.get<ApiResponse<School[]>>('/schools').then((r) => r.data.data),
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const selectedRole = useWatch<RegisterFormData>({ control, name: 'role' })

  const showSchoolField = !selectedRole || selectedRole !== 'SUPER_ADMIN'

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {registerMutation.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {(registerMutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed'}
        </div>
      )}

      {registerMutation.isSuccess && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
          Registration successful! Redirecting to sign in...
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          {...register('fullName')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {showSchoolField && (
        <div>
          <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700">
            School
          </label>
          <select
            id="schoolId"
            {...register('schoolId')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select a school</option>
            {schoolsData?.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
          {errors.schoolId && (
            <p className="mt-1 text-sm text-red-600">{errors.schoolId.message}</p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          id="role"
          {...register('role')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select a role</option>
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {registerMutation.isPending ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  )
}
