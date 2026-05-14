import { describe, it, expect } from 'vitest'
import { uuidSchema, emailSchema, paginationParamsSchema } from './common-schemas'

describe('uuidSchema', () => {
  it('accepts valid UUID', () => {
    expect(uuidSchema.safeParse('550e8400-e29b-41d4-a716-446655440000').success).toBe(true)
  })

  it('rejects invalid UUID', () => {
    expect(uuidSchema.safeParse('not-a-uuid').success).toBe(false)
  })
})

describe('emailSchema', () => {
  it('accepts valid email', () => {
    expect(emailSchema.safeParse('test@example.com').success).toBe(true)
  })

  it('rejects invalid email', () => {
    expect(emailSchema.safeParse('not-an-email').success).toBe(false)
  })
})

describe('paginationParamsSchema', () => {
  it('applies defaults', () => {
    const result = paginationParamsSchema.parse({})
    expect(result.page).toBe(1)
    expect(result.limit).toBe(20)
    expect(result.sortOrder).toBe('desc')
  })

  it('parses string numbers', () => {
    const result = paginationParamsSchema.parse({ page: '2', limit: '10' })
    expect(result.page).toBe(2)
    expect(result.limit).toBe(10)
  })

  it('rejects page below 1', () => {
    expect(paginationParamsSchema.safeParse({ page: 0 }).success).toBe(false)
  })

  it('rejects limit above 100', () => {
    expect(paginationParamsSchema.safeParse({ limit: 200 }).success).toBe(false)
  })
})
