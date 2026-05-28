'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { DISCIPLINES } from '@/types/discipline'
import type { Discipline } from '@/types/discipline'

export function DisciplineFilter({ selected }: { selected: Discipline[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function toggle(id: Discipline) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('disciplines')

    const next = selected.includes(id)
      ? selected.filter((d) => d !== id)
      : [...selected, id]

    next.forEach((d) => params.append('disciplines', d))
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  function clear() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('disciplines')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <aside className="w-full sm:w-48 shrink-0">
      <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Disciplines</h2>
          {selected.length > 0 && (
            <button
              onClick={clear}
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <ul className="space-y-2">
          {DISCIPLINES.map(({ id, label }) => (
            <li key={id}>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selected.includes(id)}
                  onChange={() => toggle(id)}
                  className="rounded border-white/20 bg-white/10 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  {label}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
