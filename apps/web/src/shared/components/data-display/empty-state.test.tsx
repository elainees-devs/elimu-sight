import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from './empty-state'

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No data" />)
    expect(screen.getByText('No data')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<EmptyState title="Empty" description="Nothing to show yet" />)
    expect(screen.getByText('Nothing to show yet')).toBeInTheDocument()
  })

  it('renders action slot', () => {
    render(<EmptyState title="Empty" action={<button>Add item</button>} />)
    expect(screen.getByText('Add item')).toBeInTheDocument()
  })
})
