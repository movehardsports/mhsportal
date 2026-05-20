import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Registration from './page'

const mockUseActionState = vi.fn()

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>()
  return { ...actual, useActionState: (...args: unknown[]) => mockUseActionState(...args) }
})

vi.mock('@/app/actions/auth', () => ({ signUp: vi.fn() }))

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

beforeEach(() => {
  mockUseActionState.mockReturnValue([undefined, vi.fn(), false])
})

describe('Registration', () => {
  describe('rendering', () => {
    it('renders account type selection buttons', () => {
      render(<Registration />)
      expect(screen.getByRole('button', { name: 'Athlete' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Brand' })).toBeInTheDocument()
    })

    it('renders email and password fields', () => {
      render(<Registration />)
      expect(screen.getByLabelText('Email address')).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
    })

    it('renders the Join button', () => {
      render(<Registration />)
      expect(screen.getByRole('button', { name: 'Join' })).toBeInTheDocument()
    })

    it('renders sign in link pointing to /login', () => {
      render(<Registration />)
      expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login')
    })
  })

  describe('account type selection', () => {
    it('Athlete button is not pressed by default', () => {
      render(<Registration />)
      expect(screen.getByRole('button', { name: 'Athlete' })).toHaveAttribute('aria-pressed', 'false')
    })

    it('clicking Athlete marks it as pressed', async () => {
      const user = userEvent.setup()
      render(<Registration />)

      await user.click(screen.getByRole('button', { name: 'Athlete' }))

      expect(screen.getByRole('button', { name: 'Athlete' })).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByRole('button', { name: 'Brand' })).toHaveAttribute('aria-pressed', 'false')
    })

    it('clicking Brand marks it as pressed and deselects Athlete', async () => {
      const user = userEvent.setup()
      render(<Registration />)

      await user.click(screen.getByRole('button', { name: 'Athlete' }))
      await user.click(screen.getByRole('button', { name: 'Brand' }))

      expect(screen.getByRole('button', { name: 'Brand' })).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByRole('button', { name: 'Athlete' })).toHaveAttribute('aria-pressed', 'false')
    })
  })

  describe('error states', () => {
    it('displays account type error from server', () => {
      mockUseActionState.mockReturnValue([{ errors: { accountType: ['Select account type.'] } }, vi.fn(), false])
      render(<Registration />)
      expect(screen.getByText('Select account type.')).toBeInTheDocument()
    })

    it('displays email error from server', () => {
      mockUseActionState.mockReturnValue([{ errors: { email: ['Email is required.'] } }, vi.fn(), false])
      render(<Registration />)
      expect(screen.getByText('Email is required.')).toBeInTheDocument()
    })

    it('displays password error from server', () => {
      mockUseActionState.mockReturnValue([{ errors: { password: ['Password must be at least 8 characters.'] } }, vi.fn(), false])
      render(<Registration />)
      expect(screen.getByText('Password must be at least 8 characters.')).toBeInTheDocument()
    })

    it('displays general error from server', () => {
      mockUseActionState.mockReturnValue([{ errors: { general: 'User already registered.' } }, vi.fn(), false])
      render(<Registration />)
      expect(screen.getByText('User already registered.')).toBeInTheDocument()
    })
  })

  describe('pending state', () => {
    it('shows Joining... and disables button while submitting', () => {
      mockUseActionState.mockReturnValue([undefined, vi.fn(), true])
      render(<Registration />)
      expect(screen.getByRole('button', { name: 'Joining...' })).toBeDisabled()
    })
  })
})
