import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import OnboardingForm from './onboarding-form'

const mockUseActionState = vi.fn()

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>()
  return { ...actual, useActionState: (...args: unknown[]) => mockUseActionState(...args) }
})

vi.mock('@/app/actions/auth', () => ({ completeOnboarding: vi.fn() }))

beforeEach(() => {
  mockUseActionState.mockReturnValue([undefined, vi.fn(), false])
})

describe('OnboardingForm', () => {
  describe('athlete', () => {
    it('renders first name and last name fields', () => {
      render(<OnboardingForm accountType="athlete" />)
      expect(screen.getByLabelText('First name')).toBeInTheDocument()
      expect(screen.getByLabelText('Last name')).toBeInTheDocument()
    })

    it('does not render brand name field', () => {
      render(<OnboardingForm accountType="athlete" />)
      expect(screen.queryByLabelText('Brand name')).not.toBeInTheDocument()
    })
  })

  describe('brand', () => {
    it('renders brand name field', () => {
      render(<OnboardingForm accountType="brand" />)
      expect(screen.getByLabelText('Brand name')).toBeInTheDocument()
    })

    it('does not render first name and last name fields', () => {
      render(<OnboardingForm accountType="brand" />)
      expect(screen.queryByLabelText('First name')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Last name')).not.toBeInTheDocument()
    })
  })

  describe('discipline picker', () => {
    it('renders discipline picker for athlete', () => {
      render(<OnboardingForm accountType="athlete" />)
      expect(screen.getByRole('checkbox', { name: 'Crossfit' })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: 'Triathlon' })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: 'Motorsports' })).toBeInTheDocument()
    })

    it('renders discipline picker for brand', () => {
      render(<OnboardingForm accountType="brand" />)
      expect(screen.getByRole('checkbox', { name: 'Crossfit' })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: 'Triathlon' })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: 'Motorsports' })).toBeInTheDocument()
    })
  })

  describe('error states', () => {
    it('displays first name error from server', () => {
      mockUseActionState.mockReturnValue([
        { errors: { first_name: ['First name is required.'] } },
        vi.fn(),
        false,
      ])
      render(<OnboardingForm accountType="athlete" />)
      expect(screen.getByText('First name is required.')).toBeInTheDocument()
    })

    it('displays last name error from server', () => {
      mockUseActionState.mockReturnValue([
        { errors: { last_name: ['Last name is required.'] } },
        vi.fn(),
        false,
      ])
      render(<OnboardingForm accountType="athlete" />)
      expect(screen.getByText('Last name is required.')).toBeInTheDocument()
    })

    it('displays brand name error from server', () => {
      mockUseActionState.mockReturnValue([
        { errors: { brand_name: ['Brand name is required.'] } },
        vi.fn(),
        false,
      ])
      render(<OnboardingForm accountType="brand" />)
      expect(screen.getByText('Brand name is required.')).toBeInTheDocument()
    })

    it('displays disciplines error from server', () => {
      mockUseActionState.mockReturnValue([
        { errors: { disciplines: ['Select at least one discipline.'] } },
        vi.fn(),
        false,
      ])
      render(<OnboardingForm accountType="athlete" />)
      expect(screen.getByText('Select at least one discipline.')).toBeInTheDocument()
    })

    it('displays general error from server', () => {
      mockUseActionState.mockReturnValue([
        { errors: { general: 'Not authenticated.' } },
        vi.fn(),
        false,
      ])
      render(<OnboardingForm accountType="athlete" />)
      expect(screen.getByText('Not authenticated.')).toBeInTheDocument()
    })
  })

  describe('pending state', () => {
    it('shows Saving... and disables button while submitting', () => {
      mockUseActionState.mockReturnValue([undefined, vi.fn(), true])
      render(<OnboardingForm accountType="athlete" />)
      expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled()
    })
  })
})
