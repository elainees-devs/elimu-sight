import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Select } from './select'

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
]

describe('Select', () => {
  it('renders options', () => {
    render(<Select options={options} />)
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('renders label', () => {
    render(<Select label="Choose" options={options} />)
    expect(screen.getByLabelText('Choose')).toBeInTheDocument()
  })

  it('renders placeholder', () => {
    render(<Select placeholder="Pick one" options={options} />)
    expect(screen.getByText('Pick one')).toBeInTheDocument()
  })

  it('displays error', () => {
    render(<Select error="Required" options={options} />)
    expect(screen.getByText('Required')).toBeInTheDocument()
  })
})
