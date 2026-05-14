import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatCard } from './stat-card'

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard label="Students" value={150} />)
    expect(screen.getByText('Students')).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument()
  })

  it('renders positive trend', () => {
    render(<StatCard label="Score" value={85} trend={{ value: 5, isPositive: true }} />)
    expect(screen.getByText('+5%')).toBeInTheDocument()
  })

  it('renders negative trend', () => {
    render(<StatCard label="Score" value={85} trend={{ value: 3, isPositive: false }} />)
    expect(screen.getByText('3%')).toBeInTheDocument()
  })
})
