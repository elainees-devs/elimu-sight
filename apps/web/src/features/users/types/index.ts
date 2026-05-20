import type { User } from '@shared/types/common'

export type UserFormData = {
  fullName: string
  email: string
  password: string
  role: 'TEACHER' | 'ACCOUNTANT'
}

export interface UsersResponse {
  data: User[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
