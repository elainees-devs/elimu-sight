import type { ROLES, GENDERS, SUBSCRIPTION_PLANS } from '@shared/lib/constants'

export type Role = (typeof ROLES)[number]

export type Gender = (typeof GENDERS)[number]

export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number]

export interface User {
  id: string
  schoolId?: string
  fullName: string
  email: string
  role: Role
  assignedClassId?: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export interface School {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  subscriptionPlan: SubscriptionPlan
  isActive: boolean
  createdAt: string
  updatedAt?: string
  deletedAt?: string
}

export interface Class {
  id: string
  name: string
  level: string
  stream: string
  academicYear: string
  schoolId: string
  classTeacherId?: string
  createdAt: string
  updatedAt?: string
}

export interface Student {
  id: string
  schoolId: string
  classId: string
  admissionNumber?: string
  fullName: string
  gender?: string
  dateOfBirth?: string
  guardianName?: string
  guardianPhone?: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export interface Subject {
  id: string
  schoolId: string
  name: string
  code?: string
  description?: string
  createdAt: string
  updatedAt?: string
}

export interface Assessment {
  id: string
  schoolId: string
  classId: string
  studentId: string
  subjectId: string
  createdBy: string
  term: string
  examType: string
  score: number
  totalMarks: number
  grade: string
  remarks: string
  createdAt: string
}

export interface Insight {
  id: string
  schoolId: string
  classId: string
  studentId: string
  subjectId: string
  type?: string
  title?: string
  summary?: string
  data?: unknown
  confidenceScore?: number
  generatedBy?: string
  period?: string
  createdAt: string
  updatedAt?: string
}

export interface ClassSubject {
  id: string
  classId: string
  subjectId: string
  teacherId: string
  createdAt: string
}
