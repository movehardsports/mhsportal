import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Login from './page'

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('Login', () => {
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
