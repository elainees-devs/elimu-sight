import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Textarea } from './textarea'

describe('Textarea', () => {
  it('renders textarea element', () => {
    render(<Textarea />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders label', () => {
    render(<Textarea label="Description" />)
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
  })

  it('displays error message', () => {
    render(<Textarea error="Required" />)
    expect(screen.getByText('Required')).toBeInTheDocument()
  })
})
