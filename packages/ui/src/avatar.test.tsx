import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar } from './avatar'

describe('Avatar', () => {
  it('renders initials', () => {
    render(<Avatar name="John Doe" />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('has title attribute', () => {
    render(<Avatar name="Jane Smith" />)
    expect(screen.getByTitle('Jane Smith')).toBeInTheDocument()
  })

  it('applies size classes', () => {
    const { container } = render(<Avatar name="A B" size="lg" />)
    expect(container.firstChild).toHaveClass('h-12')
  })
})
