import type { User } from '@shared/types/common'

export interface LoginResponse {
  token: string
  refreshToken: string
  user: User
}

export interface RegisterInput {
  fullName: string
  email: string
  password: string
  schoolId: string
  role: User['role']
}

export type AuthUser = User
