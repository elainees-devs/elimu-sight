import { describe, it, expect } from 'vitest'
import { formatPercentage, formatScore, timeAgo } from './formatters'

describe('formatPercentage', () => {
  it('formats with default 1 decimal', () => {
    expect(formatPercentage(85.5)).toBe('85.5%')
  })

  it('formats with custom decimals', () => {
    expect(formatPercentage(85.555, 2)).toBe('85.56%')
  })

  it('handles zero', () => {
    expect(formatPercentage(0)).toBe('0.0%')
  })
})

describe('formatScore', () => {
  it('formats score/total', () => {
    expect(formatScore(42, 50)).toBe('42/50')
  })
})

describe('timeAgo', () => {
  it('returns relative time', () => {
    const result = timeAgo(new Date())
    expect(result).toContain('less than a minute')
  })
})
