import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RegisterForm } from './register-form'

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('RegisterForm', () => {
  it('renders all form fields', () => {
    renderWithProviders(<RegisterForm />)
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('School')).toBeInTheDocument()
    expect(screen.getByLabelText('Role')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    renderWithProviders(<RegisterForm />)
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('shows validation errors on empty submit', async () => {
    renderWithProviders(<RegisterForm />)
    screen.getByRole('button', { name: /create account/i }).click()
    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument()
    })
  })
})
