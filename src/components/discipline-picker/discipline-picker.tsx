'use client'

import { useState } from 'react'
import { DISCIPLINES } from '@/types/discipline'
import type { Discipline } from '@/types/discipline'

type Props = {
  name?: string
  defaultValue?: Discipline[]
  error?: string
}

export function DisciplinePicker({ name = 'disciplines', defaultValue = [], error }: Props) {
  const [selected, setSelected] = useState<Set<Discipline>>(new Set(defaultValue))

  function toggle(id: Discipline) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div>
      <fieldset>
        <legend className="block text-sm/6 font-medium text-gray-100">Disciplines</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {DISCIPLINES.map(({ id, label }) => {
            const isSelected = selected.has(id)
            return (
              <button
                key={id}
                type="button"
                role="checkbox"
                aria-checked={isSelected}
                onClick={() => toggle(id)}
                className={[
                  'rounded-full px-4 py-1.5 text-sm font-medium uppercase tracking-wide transition-colors cursor-pointer select-none',
                  isSelected
                    ? 'border border-indigo-500 bg-indigo-500/20 text-indigo-300'
                    : 'border border-white/20 bg-white/5 text-gray-400 hover:border-white/40 hover:text-white',
                ].join(' ')}
              >
                {label}
              </button>
            )
          })}
        </div>
      </fieldset>

      {selected.size > 0 &&
        [...selected].map((id) => (
          <input key={id} type="hidden" name={name} value={id} />
        ))}

      {error && (
        <p aria-live="polite" className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
