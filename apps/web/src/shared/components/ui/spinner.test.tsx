import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Spinner } from './spinner'

describe('Spinner', () => {
  it('renders with default size', () => {
    const { container } = render(<Spinner />)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('h-8')
    expect(el.className).toContain('w-8')
  })

  it('renders with small size', () => {
    const { container } = render(<Spinner size="sm" />)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('h-4')
  })

  it('renders with large size', () => {
    const { container } = render(<Spinner size="lg" />)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('h-12')
  })

  it('applies custom className', () => {
    const { container } = render(<Spinner className="custom-class" />)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('custom-class')
  })
})
