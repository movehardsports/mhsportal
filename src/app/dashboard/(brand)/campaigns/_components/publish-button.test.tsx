import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PublishButton } from './publish-button'

const mockUseActionState = vi.fn()

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>()
  return { ...actual, useActionState: (...args: unknown[]) => mockUseActionState(...args) }
})

vi.mock('@/app/actions/campaigns', () => ({ publishCampaign: vi.fn() }))

beforeEach(() => {
  mockUseActionState.mockReturnValue([undefined, vi.fn(), false])
})

describe('PublishButton', () => {
  describe('rendering', () => {
    it('renders Publish button', () => {
      render(<PublishButton id="123" />)
      expect(screen.getByRole('button', { name: 'Publish' })).toBeInTheDocument()
    })

    it('renders hidden input with the campaign id', () => {
      const { container } = render(<PublishButton id="abc-123" />)
      expect(container.querySelector('input[name="id"]')).toHaveAttribute('value', 'abc-123')
    })

    it('button is enabled by default', () => {
      render(<PublishButton id="123" />)
      expect(screen.getByRole('button', { name: 'Publish' })).not.toBeDisabled()
    })
  })

  describe('pending state', () => {
    it('shows Publishing... while pending', () => {
      mockUseActionState.mockReturnValue([undefined, vi.fn(), true])
      render(<PublishButton id="123" />)
      expect(screen.getByRole('button', { name: 'Publishing...' })).toBeInTheDocument()
    })

    it('disables button while pending', () => {
      mockUseActionState.mockReturnValue([undefined, vi.fn(), true])
      render(<PublishButton id="123" />)
      expect(screen.getByRole('button', { name: 'Publishing...' })).toBeDisabled()
    })
  })

  describe('error state', () => {
    it('displays error message when publishing fails', () => {
      mockUseActionState.mockReturnValue([
        { error: 'Could not publish campaign. Please try again.' },
        vi.fn(),
        false,
      ])
      render(<PublishButton id="123" />)
      expect(screen.getByText('Could not publish campaign. Please try again.')).toBeInTheDocument()
    })
  })
})
