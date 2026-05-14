import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from './pagination'

describe('Pagination', () => {
  it('renders nothing for single page', () => {
    const { container } = render(<Pagination page={1} totalPages={1} onPageChange={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders page buttons', () => {
    render(<Pagination page={1} totalPages={3} onPageChange={vi.fn()} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('highlights current page', () => {
    render(<Pagination page={2} totalPages={3} onPageChange={vi.fn()} />)
    expect(screen.getByText('2').className).toContain('bg-blue-600')
  })

  it('calls onPageChange with correct page', () => {
    const onPageChange = vi.fn()
    render(<Pagination page={1} totalPages={3} onPageChange={onPageChange} />)
    fireEvent.click(screen.getByText('3'))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('disables prev on first page', () => {
    render(<Pagination page={1} totalPages={3} onPageChange={vi.fn()} />)
    expect(screen.getByText('Prev')).toBeDisabled()
  })

  it('disables next on last page', () => {
    render(<Pagination page={3} totalPages={3} onPageChange={vi.fn()} />)
    expect(screen.getByText('Next')).toBeDisabled()
  })
})
