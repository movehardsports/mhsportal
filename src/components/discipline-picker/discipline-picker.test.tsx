import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DisciplinePicker } from './discipline-picker'

describe('DisciplinePicker', () => {
  describe('rendering', () => {
    it('renders all three disciplines', () => {
      render(<DisciplinePicker />)
      expect(screen.getByRole('checkbox', { name: 'Crossfit' })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: 'Triathlon' })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: 'Motorsports' })).toBeInTheDocument()
    })

    it('renders Disciplines legend', () => {
      render(<DisciplinePicker />)
      expect(screen.getByText('Disciplines')).toBeInTheDocument()
    })

    it('all disciplines start unchecked', () => {
      render(<DisciplinePicker />)
      expect(screen.getByRole('checkbox', { name: 'Crossfit' })).toHaveAttribute('aria-checked', 'false')
      expect(screen.getByRole('checkbox', { name: 'Triathlon' })).toHaveAttribute('aria-checked', 'false')
      expect(screen.getByRole('checkbox', { name: 'Motorsports' })).toHaveAttribute('aria-checked', 'false')
    })

    it('renders no hidden inputs when nothing is selected', () => {
      const { container } = render(<DisciplinePicker />)
      expect(container.querySelectorAll('input[type="hidden"]')).toHaveLength(0)
    })
  })

  describe('defaultValue', () => {
    it('pre-selects disciplines from defaultValue', () => {
      render(<DisciplinePicker defaultValue={['crossfit', 'triathlon']} />)
      expect(screen.getByRole('checkbox', { name: 'Crossfit' })).toHaveAttribute('aria-checked', 'true')
      expect(screen.getByRole('checkbox', { name: 'Triathlon' })).toHaveAttribute('aria-checked', 'true')
      expect(screen.getByRole('checkbox', { name: 'Motorsports' })).toHaveAttribute('aria-checked', 'false')
    })

    it('renders hidden inputs for pre-selected disciplines', () => {
      const { container } = render(<DisciplinePicker defaultValue={['crossfit', 'triathlon']} />)
      expect(container.querySelectorAll('input[type="hidden"]')).toHaveLength(2)
    })
  })

  describe('toggle behavior', () => {
    it('clicking a discipline selects it', async () => {
      const user = userEvent.setup()
      render(<DisciplinePicker />)

      await user.click(screen.getByRole('checkbox', { name: 'Crossfit' }))

      expect(screen.getByRole('checkbox', { name: 'Crossfit' })).toHaveAttribute('aria-checked', 'true')
    })

    it('clicking a selected discipline deselects it', async () => {
      const user = userEvent.setup()
      render(<DisciplinePicker defaultValue={['crossfit']} />)

      await user.click(screen.getByRole('checkbox', { name: 'Crossfit' }))

      expect(screen.getByRole('checkbox', { name: 'Crossfit' })).toHaveAttribute('aria-checked', 'false')
    })

    it('selecting one discipline does not affect others', async () => {
      const user = userEvent.setup()
      render(<DisciplinePicker />)

      await user.click(screen.getByRole('checkbox', { name: 'Crossfit' }))

      expect(screen.getByRole('checkbox', { name: 'Triathlon' })).toHaveAttribute('aria-checked', 'false')
      expect(screen.getByRole('checkbox', { name: 'Motorsports' })).toHaveAttribute('aria-checked', 'false')
    })

    it('multiple disciplines can be selected simultaneously', async () => {
      const user = userEvent.setup()
      render(<DisciplinePicker />)

      await user.click(screen.getByRole('checkbox', { name: 'Crossfit' }))
      await user.click(screen.getByRole('checkbox', { name: 'Motorsports' }))

      expect(screen.getByRole('checkbox', { name: 'Crossfit' })).toHaveAttribute('aria-checked', 'true')
      expect(screen.getByRole('checkbox', { name: 'Triathlon' })).toHaveAttribute('aria-checked', 'false')
      expect(screen.getByRole('checkbox', { name: 'Motorsports' })).toHaveAttribute('aria-checked', 'true')
    })
  })

  describe('hidden inputs', () => {
    it('adds a hidden input when a discipline is selected', async () => {
      const user = userEvent.setup()
      const { container } = render(<DisciplinePicker />)

      await user.click(screen.getByRole('checkbox', { name: 'Crossfit' }))

      expect(container.querySelector('input[name="disciplines"][value="crossfit"]')).toBeInTheDocument()
    })

    it('renders one hidden input per selected discipline', async () => {
      const user = userEvent.setup()
      const { container } = render(<DisciplinePicker />)

      await user.click(screen.getByRole('checkbox', { name: 'Crossfit' }))
      await user.click(screen.getByRole('checkbox', { name: 'Triathlon' }))

      expect(container.querySelectorAll('input[type="hidden"]')).toHaveLength(2)
    })

    it('removes hidden input when discipline is deselected', async () => {
      const user = userEvent.setup()
      const { container } = render(<DisciplinePicker defaultValue={['crossfit']} />)

      await user.click(screen.getByRole('checkbox', { name: 'Crossfit' }))

      expect(container.querySelector('input[name="disciplines"][value="crossfit"]')).not.toBeInTheDocument()
    })

    it('uses the name prop for hidden inputs', async () => {
      const user = userEvent.setup()
      const { container } = render(<DisciplinePicker name="sports" />)

      await user.click(screen.getByRole('checkbox', { name: 'Crossfit' }))

      expect(container.querySelector('input[name="sports"][value="crossfit"]')).toBeInTheDocument()
    })
  })

  describe('error state', () => {
    it('displays error message when provided', () => {
      render(<DisciplinePicker error="Select at least one discipline." />)
      expect(screen.getByText('Select at least one discipline.')).toBeInTheDocument()
    })

    it('error message has aria-live="polite"', () => {
      render(<DisciplinePicker error="Select at least one discipline." />)
      expect(screen.getByText('Select at least one discipline.')).toHaveAttribute('aria-live', 'polite')
    })

    it('does not display error element when no error is provided', () => {
      render(<DisciplinePicker />)
      expect(screen.queryByText(/select at least/i)).not.toBeInTheDocument()
    })
  })
})
