import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CampaignForm } from './campaign-form'
import type { Campaign } from '@/types/campaign'

const mockUseActionState = vi.fn()

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>()
  return { ...actual, useActionState: (...args: unknown[]) => mockUseActionState(...args) }
})

vi.mock('@/app/actions/campaigns', () => ({
  createCampaign: vi.fn(),
  updateCampaign: vi.fn(),
}))

const mockCampaign: Campaign = {
  id: 'abc-123',
  brand_id: 'brand-1',
  title: 'Summer Sprint',
  description: 'A campaign for summer athletes.',
  status: 'preview',
  disciplines: ['crossfit', 'triathlon'],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

beforeEach(() => {
  mockUseActionState.mockReturnValue([undefined, vi.fn(), false])
})

describe('CampaignForm', () => {
  describe('create mode (no campaign prop)', () => {
    it('renders title and description fields', () => {
      render(<CampaignForm />)
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
      expect(screen.getByLabelText('Description')).toBeInTheDocument()
    })

    it('renders discipline picker with all options', () => {
      render(<CampaignForm />)
      expect(screen.getByRole('checkbox', { name: 'Crossfit' })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: 'Triathlon' })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: 'Motorsports' })).toBeInTheDocument()
    })

    it('renders Create Campaign button', () => {
      render(<CampaignForm />)
      expect(screen.getByRole('button', { name: 'Create Campaign' })).toBeInTheDocument()
    })

    it('title and description inputs start empty', () => {
      render(<CampaignForm />)
      expect(screen.getByLabelText('Title')).toHaveValue('')
      expect(screen.getByLabelText('Description')).toHaveValue('')
    })

    it('all disciplines start unchecked', () => {
      render(<CampaignForm />)
      expect(screen.getByRole('checkbox', { name: 'Crossfit' })).toHaveAttribute('aria-checked', 'false')
      expect(screen.getByRole('checkbox', { name: 'Triathlon' })).toHaveAttribute('aria-checked', 'false')
      expect(screen.getByRole('checkbox', { name: 'Motorsports' })).toHaveAttribute('aria-checked', 'false')
    })
  })

  describe('edit mode (with campaign prop)', () => {
    it('pre-fills title and description from campaign', () => {
      render(<CampaignForm campaign={mockCampaign} />)
      expect(screen.getByLabelText('Title')).toHaveValue('Summer Sprint')
      expect(screen.getByLabelText('Description')).toHaveValue('A campaign for summer athletes.')
    })

    it('pre-selects disciplines from campaign', () => {
      render(<CampaignForm campaign={mockCampaign} />)
      expect(screen.getByRole('checkbox', { name: 'Crossfit' })).toHaveAttribute('aria-checked', 'true')
      expect(screen.getByRole('checkbox', { name: 'Triathlon' })).toHaveAttribute('aria-checked', 'true')
      expect(screen.getByRole('checkbox', { name: 'Motorsports' })).toHaveAttribute('aria-checked', 'false')
    })

    it('renders Save Changes button', () => {
      render(<CampaignForm campaign={mockCampaign} />)
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument()
    })

    it('handles campaign with null disciplines', () => {
      render(<CampaignForm campaign={{ ...mockCampaign, disciplines: null }} />)
      expect(screen.getByRole('checkbox', { name: 'Crossfit' })).toHaveAttribute('aria-checked', 'false')
    })
  })

  describe('error states', () => {
    it('displays title error', () => {
      mockUseActionState.mockReturnValue([
        { errors: { title: ['Title must be at least 3 characters.'] } },
        vi.fn(),
        false,
      ])
      render(<CampaignForm />)
      expect(screen.getByText('Title must be at least 3 characters.')).toBeInTheDocument()
    })

    it('title input has aria-invalid when there is an error', () => {
      mockUseActionState.mockReturnValue([
        { errors: { title: ['Title must be at least 3 characters.'] } },
        vi.fn(),
        false,
      ])
      render(<CampaignForm />)
      expect(screen.getByLabelText('Title')).toHaveAttribute('aria-invalid', 'true')
    })

    it('displays description error', () => {
      mockUseActionState.mockReturnValue([
        { errors: { description: ['Description must be at least 10 characters.'] } },
        vi.fn(),
        false,
      ])
      render(<CampaignForm />)
      expect(screen.getByText('Description must be at least 10 characters.')).toBeInTheDocument()
    })

    it('displays disciplines error via DisciplinePicker', () => {
      mockUseActionState.mockReturnValue([
        { errors: { disciplines: ['Select at least one discipline.'] } },
        vi.fn(),
        false,
      ])
      render(<CampaignForm />)
      expect(screen.getByText('Select at least one discipline.')).toBeInTheDocument()
    })

    it('displays general error', () => {
      mockUseActionState.mockReturnValue([
        { errors: { general: 'Unauthorized.' } },
        vi.fn(),
        false,
      ])
      render(<CampaignForm />)
      expect(screen.getByText('Unauthorized.')).toBeInTheDocument()
    })
  })

  describe('pending state', () => {
    it('shows Creating... and disables button in create mode', () => {
      mockUseActionState.mockReturnValue([undefined, vi.fn(), true])
      render(<CampaignForm />)
      expect(screen.getByRole('button', { name: 'Creating...' })).toBeDisabled()
    })

    it('shows Saving... and disables button in edit mode', () => {
      mockUseActionState.mockReturnValue([undefined, vi.fn(), true])
      render(<CampaignForm campaign={mockCampaign} />)
      expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled()
    })
  })
})
