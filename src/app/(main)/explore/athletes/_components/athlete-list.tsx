'use client'

import { useState } from 'react'
import Link from 'next/link'
import { fetchMoreAthletes } from '@/app/actions/explore'
import { DISCIPLINES } from '@/types/discipline'
import type { Discipline } from '@/types/discipline'
import type { PublicAthlete } from '@/lib/dal'

export function AthleteList({
  initialItems,
  initialHasMore,
  disciplines,
}: {
  initialItems: PublicAthlete[]
  initialHasMore: boolean
  disciplines: Discipline[]
}) {
  const [items, setItems] = useState(initialItems)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)

  async function loadMore() {
    setLoading(true)
    const { data, hasMore: nextHasMore } = await fetchMoreAthletes(disciplines, items.length)
    setItems((prev) => [...prev, ...data])
    setHasMore(nextHasMore)
    setLoading(false)
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-sm">No athletes registered yet.</p>
      </div>
    )
  }

  return (
    <>
      <ul className="space-y-4">
        {items.map((athlete) => (
          <li
            key={athlete.id}
            className="rounded-lg border border-white/10 bg-white/5 px-6 py-5"
          >
            <div className="min-w-0 space-y-2">
              <h2 className="text-base font-semibold text-white">
                {athlete.first_name} {athlete.last_name}
              </h2>
              {athlete.disciplines && athlete.disciplines.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {athlete.disciplines.map((id) => {
                    const label = DISCIPLINES.find((d) => d.id === id)?.label ?? id
                    return (
                      <span
                        key={id}
                        className="rounded-full border border-indigo-500/50 bg-indigo-500/10 px-3 py-0.5 text-xs font-medium uppercase tracking-wide text-indigo-300"
                      >
                        {label}
                      </span>
                    )
                  })}
                </div>
              )}
              <div className="pt-2">
                <Link
                  href={`/explore/athletes/${athlete.id}`}
                  className="inline-block rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 transition-colors"
                >
                  See profile
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="pt-6 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="rounded-md border border-white/10 bg-white/5 px-6 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </>
  )
}
