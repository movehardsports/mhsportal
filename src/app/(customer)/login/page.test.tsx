import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Login from './page'

const mockUseActionState = vi.fn()

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>()
  return { ...actual, useActionState: (...args: unknown[]) => mockUseActionState(...args) }
})

vi.mock('@/app/actions/auth', () => ({ signIn: vi.fn() }))

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

beforeEach(() => {
  mockUseActionState.mockReturnValue([undefined, vi.fn(), false])
})

describe('Login', () => {
  describe('rendering', () => {
    it('renders the page heading', () => {
      render(<Login />)
      expect(screen.getByRole('heading', { name: 'Sign in to your account' })).toBeInTheDocument()
    })

    it('renders email and password fields', () => {
      render(<Login />)
      expect(screen.getByLabelText('Email address')).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
    })

    it('renders the Sign In button', () => {
      render(<Login />)
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
    })

    it('renders sign up link pointing to /register', () => {
      render(<Login />)
      expect(screen.getByRole('link', { name: 'Sign up' })).toHaveAttribute('href', '/register')
    })
  })

  describe('error states', () => {
    it('displays email error from server', () => {
      mockUseActionState.mockReturnValue([{ errors: { email: 'Email is required.' } }, vi.fn(), false])
      render(<Login />)
      expect(screen.getByText('Email is required.')).toBeInTheDocument()
    })

    it('displays password error from server', () => {
      mockUseActionState.mockReturnValue([{ errors: { password: 'Password is required.' } }, vi.fn(), false])
      render(<Login />)
      expect(screen.getByText('Password is required.')).toBeInTheDocument()
    })

    it('displays general error from server', () => {
      mockUseActionState.mockReturnValue([{ errors: { general: 'Invalid login credentials.' } }, vi.fn(), false])
      render(<Login />)
      expect(screen.getByText('Invalid login credentials.')).toBeInTheDocument()
    })
  })

  describe('pending state', () => {
    it('shows Signing in... and disables button while submitting', () => {
      mockUseActionState.mockReturnValue([undefined, vi.fn(), true])
      render(<Login />)
      expect(screen.getByRole('button', { name: 'Signing in...' })).toBeDisabled()
    })
  })
})
