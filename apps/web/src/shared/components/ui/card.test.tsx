import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardBody, CardFooter } from './card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Content</Card>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('applies base classes', () => {
    const { container } = render(<Card>Card</Card>)
    expect(container.firstChild).toHaveClass('rounded-xl')
    expect(container.firstChild).toHaveClass('bg-white')
  })
})

describe('CardHeader', () => {
  it('renders with border', () => {
    const { container } = render(<CardHeader>Header</CardHeader>)
    expect(container.firstChild).toHaveClass('border-b')
  })
})

describe('CardBody', () => {
  it('renders with padding', () => {
    const { container } = render(<CardBody>Body</CardBody>)
    expect(container.firstChild).toHaveClass('px-6')
    expect(container.firstChild).toHaveClass('py-4')
  })
})

describe('CardFooter', () => {
  it('renders with top border', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>)
    expect(container.firstChild).toHaveClass('border-t')
  })
})
