import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from './modal'

describe('Modal', () => {
  it('does not render when closed', () => {
    render(<Modal open={false} onClose={vi.fn()}>Content</Modal>)
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('renders when open', () => {
    render(<Modal open={true} onClose={vi.fn()}>Content</Modal>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(<Modal open={true} onClose={vi.fn()} title="My Modal">Content</Modal>)
    expect(screen.getByText('My Modal')).toBeInTheDocument()
  })

  it('calls onClose when overlay clicked', () => {
    const onClose = vi.fn()
    const { container } = render(<Modal open={true} onClose={onClose}>Content</Modal>)
    const overlay = container.querySelector('.bg-black\\/50')
    expect(overlay).toBeInTheDocument()
    fireEvent.click(overlay!)
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn()
    render(<Modal open={true} onClose={onClose}>Content</Modal>)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('renders close button when title is provided', () => {
    render(<Modal open={true} onClose={vi.fn()} title="Title">Content</Modal>)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})
