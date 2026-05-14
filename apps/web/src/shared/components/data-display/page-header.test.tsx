import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageHeader } from './page-header'

describe('PageHeader', () => {
  it('renders title', () => {
    render(<PageHeader title="Dashboard" />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders subtitle', () => {
    render(<PageHeader title="Dashboard" subtitle="Welcome back" />)
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
  })

  it('renders actions', () => {
    render(<PageHeader title="Dashboard" actions={<button>Action</button>} />)
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('renders breadcrumbs', () => {
    render(
      <PageHeader
        title="Page Detail"
        breadcrumbs={[{ label: 'Home' }, { label: 'Section' }, { label: 'Current' }]}
      />,
    )
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Section')).toBeInTheDocument()
    expect(screen.getByText('Current')).toBeInTheDocument()
  })
})
