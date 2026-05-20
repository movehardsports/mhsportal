import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DeleteButton } from './delete-button'

const mockUseActionState = vi.fn()

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>()
  return { ...actual, useActionState: (...args: unknown[]) => mockUseActionState(...args) }
})

vi.mock('@/app/actions/campaigns', () => ({ deleteCampaign: vi.fn() }))

beforeEach(() => {
  mockUseActionState.mockReturnValue([undefined, vi.fn(), false])
})

describe('DeleteButton', () => {
  describe('rendering', () => {
    it('renders Delete button', () => {
      render(<DeleteButton id="123" />)
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    })

    it('renders hidden input with the campaign id', () => {
      const { container } = render(<DeleteButton id="abc-123" />)
      expect(container.querySelector('input[name="id"]')).toHaveAttribute('value', 'abc-123')
    })

    it('button is enabled by default', () => {
      render(<DeleteButton id="123" />)
      expect(screen.getByRole('button', { name: 'Delete' })).not.toBeDisabled()
    })
  })

  describe('pending state', () => {
    it('shows Deleting... while pending', () => {
      mockUseActionState.mockReturnValue([undefined, vi.fn(), true])
      render(<DeleteButton id="123" />)
      expect(screen.getByRole('button', { name: 'Deleting...' })).toBeInTheDocument()
    })

    it('disables button while pending', () => {
      mockUseActionState.mockReturnValue([undefined, vi.fn(), true])
      render(<DeleteButton id="123" />)
      expect(screen.getByRole('button', { name: 'Deleting...' })).toBeDisabled()
    })
  })

  describe('error state', () => {
    it('displays error message when deletion fails', () => {
      mockUseActionState.mockReturnValue([
        { error: 'Could not delete campaign. Please try again.' },
        vi.fn(),
        false,
      ])
      render(<DeleteButton id="123" />)
      expect(screen.getByText('Could not delete campaign. Please try again.')).toBeInTheDocument()
    })
  })
})
