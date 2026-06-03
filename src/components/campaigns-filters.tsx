'use client'

import { useState } from 'react'
import { SPORTS } from '@/types/sport'
import { CAMPAIGN_TYPES } from '@/types/campaign-type'

const FILTERS = [
  { key: 'sports', label: 'Sports', items: SPORTS, width: 'w-64' },
  { key: 'types', label: 'Campaign type', items: CAMPAIGN_TYPES, width: 'w-56' },
]

type FilterDropdownProps = {
  label: string
  items: { id: string; label: string }[]
  open: boolean
  onToggle: () => void
  width: string
}

function FilterDropdown({ label, items, open, onToggle, width }: FilterDropdownProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
          open
            ? 'border-zinc-100 bg-zinc-100 text-zinc-950'
            : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 cursor-pointer'
        }`}
      >
        {label}
        <svg className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className={`absolute left-0 top-full z-10 mt-2 ${width} rounded-xl border border-zinc-800 bg-zinc-900 p-3 shadow-xl shadow-black/40`}>
          <div className="flex flex-col gap-1">
            {items.map(({ id, label }) => (
              <button key={id} type="button" className="cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100">
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function CampaignsFilters() {
  const [openFilter, setOpenFilter] = useState<string | null>(null)

  const toggle = (key: string) => setOpenFilter((o) => o === key ? null : key)

  return (
    <div>
      {openFilter && <div className="fixed inset-0 z-0" onClick={() => setOpenFilter(null)} />}
      <div className="flex gap-2">
        {FILTERS.map(({ key, label, items, width }) => (
          <FilterDropdown
            key={key}
            label={label}
            items={items}
            open={openFilter === key}
            onToggle={() => toggle(key)}
            width={width}
          />
        ))}
      </div>
    </div>
  )
}
