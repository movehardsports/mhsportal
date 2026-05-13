import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from './header'

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock('@/app/actions/auth', () => ({ signOut: vi.fn() }))

describe('Header', () => {
  describe('when user is not logged in', () => {
    it('renders navigation links', () => {
      render(<Header user={null} />)
      expect(screen.getAllByText('For Athletes')[0]).toBeInTheDocument()
      expect(screen.getAllByText('For Brands')[0]).toBeInTheDocument()
    })

    it('renders sign in link pointing to /login', () => {
      render(<Header user={null} />)
      const signInLinks = screen.getAllByRole('link', { name: /sign in/i })
      expect(signInLinks[0]).toBeInTheDocument()
      expect(signInLinks[0]).toHaveAttribute('href', '/login')
    })

    it('renders join link pointing to /register', () => {
      render(<Header user={null} />)
      const joinLinks = screen.getAllByRole('link', { name: /join/i })
      expect(joinLinks[0]).toBeInTheDocument()
      expect(joinLinks[0]).toHaveAttribute('href', '/register')
    })

    it('renders logo image', () => {
      render(<Header user={null} />)
      expect(screen.getByAltText('Your Company')).toBeInTheDocument()
    })

    it('renders mobile menu button with screen reader label', () => {
      render(<Header user={null} />)
      expect(screen.getByText('Open main menu')).toBeInTheDocument()
    })
  })

  describe('when user is logged in', () => {
    const mockUser = { email: 'test@example.com' } as never

    it('renders dashboard link', () => {
      render(<Header user={mockUser} />)
      const dashboardLinks = screen.getAllByRole('link', { name: /dashboard/i })
      expect(dashboardLinks[0]).toHaveAttribute('href', '/dashboard')
    })

    it('does not render sign in link', () => {
      render(<Header user={mockUser} />)
      expect(screen.queryByRole('link', { name: /sign in/i })).not.toBeInTheDocument()
    })
  })
})
