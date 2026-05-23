import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProfileForm } from './profile-form'
import type { AthleteProfile, BrandProfile } from '@/types/profile'

const mockUseActionState = vi.fn()

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>()
  return { ...actual, useActionState: (...args: unknown[]) => mockUseActionState(...args) }
})

vi.mock('@/app/actions/profile', () => ({ updateProfile: vi.fn() }))

const mockAthlete: AthleteProfile = {
  id: 'user-1',
  account_type: 'athlete',
  first_name: 'John',
  last_name: 'Doe',
  brand_name: null,
  disciplines: ['crossfit', 'triathlon'],
  onboarding_completed: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

const mockBrand: BrandProfile = {
  id: 'user-2',
  account_type: 'brand',
  first_name: null,
  last_name: null,
  brand_name: 'Test Brand',
  disciplines: ['crossfit'],
  onboarding_completed: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

beforeEach(() => {
  mockUseActionState.mockReturnValue([undefined, vi.fn(), false])
})

describe('ProfileForm', () => {
  describe('athlete mode', () => {
    it('renders first name and last name inputs', () => {
      render(<ProfileForm profile={mockAthlete} />)
      expect(screen.getByLabelText('First name')).toBeInTheDocument()
      expect(screen.getByLabelText('Last name')).toBeInTheDocument()
    })

    it('pre-fills name fields from profile', () => {
      render(<ProfileForm profile={mockAthlete} />)
      expect(screen.getByLabelText('First name')).toHaveValue('John')
      expect(screen.getByLabelText('Last name')).toHaveValue('Doe')
    })

    it('pre-selects disciplines from profile', () => {
      render(<ProfileForm profile={mockAthlete} />)
      expect(screen.getByRole('checkbox', { name: 'Crossfit' })).toHaveAttribute('aria-checked', 'true')
      expect(screen.getByRole('checkbox', { name: 'Triathlon' })).toHaveAttribute('aria-checked', 'true')
      expect(screen.getByRole('checkbox', { name: 'Motorsports' })).toHaveAttribute('aria-checked', 'false')
    })

    it('does not render brand name field', () => {
      render(<ProfileForm profile={mockAthlete} />)
      expect(screen.queryByText('Brand name')).not.toBeInTheDocument()
    })

    it('handles null disciplines', () => {
      render(<ProfileForm profile={{ ...mockAthlete, disciplines: null }} />)
      expect(screen.getByRole('checkbox', { name: 'Crossfit' })).toHaveAttribute('aria-checked', 'false')
    })
  })

  describe('brand mode', () => {
    it('displays brand name as read-only text', () => {
      render(<ProfileForm profile={mockBrand} />)
      expect(screen.getByText('Test Brand')).toBeInTheDocument()
      expect(screen.queryByDisplayValue('Test Brand')).not.toBeInTheDocument()
    })

    it('does not render first name or last name inputs', () => {
      render(<ProfileForm profile={mockBrand} />)
      expect(screen.queryByLabelText('First name')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Last name')).not.toBeInTheDocument()
    })

    it('pre-selects disciplines from profile', () => {
      render(<ProfileForm profile={mockBrand} />)
      expect(screen.getByRole('checkbox', { name: 'Crossfit' })).toHaveAttribute('aria-checked', 'true')
      expect(screen.getByRole('checkbox', { name: 'Triathlon' })).toHaveAttribute('aria-checked', 'false')
    })
  })

  describe('error states', () => {
    it('displays first name error', () => {
      mockUseActionState.mockReturnValue([
        { errors: { first_name: ['First name is required.'] } },
        vi.fn(),
        false,
      ])
      render(<ProfileForm profile={mockAthlete} />)
      expect(screen.getByText('First name is required.')).toBeInTheDocument()
    })

    it('first name input has aria-invalid when there is an error', () => {
      mockUseActionState.mockReturnValue([
        { errors: { first_name: ['First name is required.'] } },
        vi.fn(),
        false,
      ])
      render(<ProfileForm profile={mockAthlete} />)
      expect(screen.getByLabelText('First name')).toHaveAttribute('aria-invalid', 'true')
    })

    it('displays last name error', () => {
      mockUseActionState.mockReturnValue([
        { errors: { last_name: ['Last name is required.'] } },
        vi.fn(),
        false,
      ])
      render(<ProfileForm profile={mockAthlete} />)
      expect(screen.getByText('Last name is required.')).toBeInTheDocument()
    })

    it('displays disciplines error', () => {
      mockUseActionState.mockReturnValue([
        { errors: { disciplines: ['Select at least one discipline.'] } },
        vi.fn(),
        false,
      ])
      render(<ProfileForm profile={mockAthlete} />)
      expect(screen.getByText('Select at least one discipline.')).toBeInTheDocument()
    })

    it('displays general error', () => {
      mockUseActionState.mockReturnValue([
        { errors: { general: 'Unauthorized.' } },
        vi.fn(),
        false,
      ])
      render(<ProfileForm profile={mockAthlete} />)
      expect(screen.getByText('Unauthorized.')).toBeInTheDocument()
    })
  })

  describe('pending state', () => {
    it('shows Saving... and disables button when pending', () => {
      mockUseActionState.mockReturnValue([undefined, vi.fn(), true])
      render(<ProfileForm profile={mockAthlete} />)
      expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled()
    })

    it('shows Save Changes when not pending', () => {
      render(<ProfileForm profile={mockAthlete} />)
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument()
    })
  })
})
