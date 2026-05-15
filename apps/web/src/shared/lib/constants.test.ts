import { describe, it, expect } from 'vitest'
import { ROLES, ROLE_LABELS, EXAM_TYPES, EXAM_TYPE_LABELS, GENDERS, SUBSCRIPTION_PLANS } from './constants'

describe('constants', () => {
  it('ROLES contains correct roles', () => {
    expect(ROLES).toEqual(['SUPER_ADMIN', 'ADMIN', 'HEADTEACHER', 'TEACHER', 'ACCOUNTANT'])
  })

  it('ROLE_LABELS has entry for every role', () => {
    for (const role of ROLES) {
      expect(ROLE_LABELS[role]).toBeDefined()
    }
  })

  it('EXAM_TYPES contains correct types', () => {
    expect(EXAM_TYPES).toEqual(['QUIZ', 'CAT', 'EXAM', 'ASSIGNMENT'])
  })

  it('EXAM_TYPE_LABELS has entry for every exam type', () => {
    for (const t of EXAM_TYPES) {
      expect(EXAM_TYPE_LABELS[t]).toBeDefined()
    }
  })

  it('GENDERS contains correct values', () => {
    expect(GENDERS).toEqual(['Male', 'Female'])
  })

  it('SUBSCRIPTION_PLANS contains correct plans', () => {
    expect(SUBSCRIPTION_PLANS).toEqual(['FREE', 'BASIC', 'PREMIUM'])
  })
})
