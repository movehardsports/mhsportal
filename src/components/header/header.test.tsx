import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from './header'

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('Header', () => {
  it('renders navigation links', () => {
    render(<Header />)
    expect(screen.getAllByText('For Athletes')[0]).toBeInTheDocument()
    expect(screen.getAllByText('For Brands')[0]).toBeInTheDocument()
  })

  it('renders sign in link pointing to /login', () => {
    render(<Header />)
    const signInLinks = screen.getAllByRole('link', { name: /sign in/i })
    expect(signInLinks[0]).toBeInTheDocument()
    expect(signInLinks[0]).toHaveAttribute('href', '/login')
  })

  it('renders join link pointing to /register', () => {
    render(<Header />)
    const joinLinks = screen.getAllByRole('link', { name: /join/i })
    expect(joinLinks[0]).toBeInTheDocument()
    expect(joinLinks[0]).toHaveAttribute('href', '/register')
  })

  it('renders logo image', () => {
    render(<Header />)
    expect(screen.getByAltText('Your Company')).toBeInTheDocument()
  })

  it('renders mobile menu button with screen reader label', () => {
    render(<Header />)
    expect(screen.getByText('Open main menu')).toBeInTheDocument()
  })
})
