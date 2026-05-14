import { describe, it, expect } from 'vitest'
import { generateInitials, capitalize, truncate, pluralize } from './utils'

describe('generateInitials', () => {
  it('returns first two initials', () => {
    expect(generateInitials('John Doe')).toBe('JD')
  })

  it('handles single name', () => {
    expect(generateInitials('John')).toBe('J')
  })

  it('handles three names', () => {
    expect(generateInitials('John Michael Doe')).toBe('JM')
  })

  it('uppercases initials', () => {
    expect(generateInitials('john doe')).toBe('JD')
  })

  it('handles empty string', () => {
    expect(generateInitials('')).toBe('')
  })
})

describe('capitalize', () => {
  it('capitalizes first letter', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('lowercases rest', () => {
    expect(capitalize('HELLO')).toBe('Hello')
  })

  it('handles empty string', () => {
    expect(capitalize('')).toBe('')
  })
})

describe('truncate', () => {
  it('returns string as-is when shorter than length', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })

  it('truncates with ellipsis when longer', () => {
    expect(truncate('hello world', 5)).toBe('hello...')
  })

  it('handles exact length', () => {
    expect(truncate('hello', 5)).toBe('hello')
  })
})

describe('pluralize', () => {
  it('returns singular for count 1', () => {
    expect(pluralize(1, 'student')).toBe('student')
  })

  it('returns default plural', () => {
    expect(pluralize(5, 'student')).toBe('students')
  })

  it('uses custom plural', () => {
    expect(pluralize(5, 'child', 'children')).toBe('children')
  })
})
