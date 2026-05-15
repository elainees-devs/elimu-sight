export const ROLES = ['SUPER_ADMIN', 'ADMIN', 'HEADTEACHER', 'TEACHER', 'ACCOUNTANT'] as const

export const ROLE_LABELS: Record<(typeof ROLES)[number], string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  HEADTEACHER: 'Head Teacher',
  TEACHER: 'Teacher',
  ACCOUNTANT: 'Accountant',
}

export const SUBSCRIPTION_PLANS = ['FREE', 'BASIC', 'PREMIUM'] as const

export const EXAM_TYPES = ['QUIZ', 'CAT', 'EXAM', 'ASSIGNMENT'] as const

export const EXAM_TYPE_LABELS: Record<(typeof EXAM_TYPES)[number], string> = {
  QUIZ: 'Quiz',
  CAT: 'CAT',
  EXAM: 'Exam',
  ASSIGNMENT: 'Assignment',
}

export const GENDERS = ['Male', 'Female'] as const

export const INSIGHT_TYPES = [
  'STUDENT_PERFORMANCE',
  'CLASS_PERFORMANCE',
  'SUBJECT_TREND',
  'TERM_ANALYSIS',
  'PREDICTION',
  'RECOMMENDATION',
] as const

export const APP_NAME = 'ElimuSight'
