import { describe, it, expect } from 'vitest'
import { cn } from '@elimu-sight/ui'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('handles conditional classes via clsx', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })

  it('resolves tailwind conflicts', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6')
  })

  it('handles undefined and null', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
  })

  it('accepts arrays', () => {
    expect(cn(['a', 'b'], 'c')).toBe('a b c')
  })
})
