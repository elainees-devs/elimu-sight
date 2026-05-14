import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Alert } from './alert'

describe('Alert', () => {
  it('renders children', () => {
    render(<Alert>Something happened</Alert>)
    expect(screen.getByText('Something happened')).toBeInTheDocument()
  })

  it('renders title', () => {
    render(<Alert title="Warning">Details here</Alert>)
    expect(screen.getByText('Warning')).toBeInTheDocument()
  })

  it('applies variant styles', () => {
    const { container } = render(<Alert variant="error">Error</Alert>)
    expect(container.firstChild).toHaveClass('bg-red-50')
  })

  it('defaults to info variant', () => {
    const { container } = render(<Alert>Info</Alert>)
    expect(container.firstChild).toHaveClass('bg-blue-50')
  })
})
