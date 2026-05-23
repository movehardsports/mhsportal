import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DeleteAccountButton } from './delete-account-button'

const mockUseActionState = vi.fn()

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>()
  return { ...actual, useActionState: (...args: unknown[]) => mockUseActionState(...args) }
})

vi.mock('@/app/actions/profile', () => ({ deleteAccount: vi.fn() }))

beforeEach(() => {
  mockUseActionState.mockReturnValue([undefined, vi.fn(), false])
})

describe('DeleteAccountButton', () => {
  describe('rendering', () => {
    it('renders Delete account button', () => {
      render(<DeleteAccountButton />)
      expect(screen.getByRole('button', { name: 'Delete account' })).toBeInTheDocument()
    })

    it('button is enabled by default', () => {
      render(<DeleteAccountButton />)
      expect(screen.getByRole('button', { name: 'Delete account' })).not.toBeDisabled()
    })
  })

  describe('pending state', () => {
    it('shows Deleting... while pending', () => {
      mockUseActionState.mockReturnValue([undefined, vi.fn(), true])
      render(<DeleteAccountButton />)
      expect(screen.getByRole('button', { name: 'Deleting...' })).toBeInTheDocument()
    })

    it('disables button while pending', () => {
      mockUseActionState.mockReturnValue([undefined, vi.fn(), true])
      render(<DeleteAccountButton />)
      expect(screen.getByRole('button', { name: 'Deleting...' })).toBeDisabled()
    })
  })

  describe('error state', () => {
    it('displays error message when deletion fails', () => {
      mockUseActionState.mockReturnValue([
        { error: 'Could not delete account. Please try again.' },
        vi.fn(),
        false,
      ])
      render(<DeleteAccountButton />)
      expect(screen.getByText('Could not delete account. Please try again.')).toBeInTheDocument()
    })
  })
})
