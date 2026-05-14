import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from './auth-schema'

describe('loginSchema', () => {
  it('accepts valid login data', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: 'password123' })
    expect(result.success).toBe(true)
  })

  it('rejects missing email', () => {
    const result = loginSchema.safeParse({ password: 'password123' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'bad', password: 'password123' })
    expect(result.success).toBe(false)
  })

  it('rejects short password', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '123' })
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  it('accepts valid register data', () => {
    const result = registerSchema.safeParse({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      schoolId: '550e8400-e29b-41d4-a716-446655440000',
      role: 'TEACHER',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing fullName', () => {
    const result = registerSchema.safeParse({
      email: 'john@example.com',
      password: 'password123',
      schoolId: '550e8400-e29b-41d4-a716-446655440000',
      role: 'TEACHER',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid role', () => {
    const result = registerSchema.safeParse({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      schoolId: '550e8400-e29b-41d4-a716-446655440000',
      role: 'INVALID',
    })
    expect(result.success).toBe(false)
  })

  it('rejects non-UUID schoolId', () => {
    const result = registerSchema.safeParse({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      schoolId: 'not-a-uuid',
      role: 'TEACHER',
    })
    expect(result.success).toBe(false)
  })
})
