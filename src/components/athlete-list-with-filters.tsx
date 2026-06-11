'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { Athlete } from '@/types/athlete'
import { CAMPAIGN_TYPES, type CampaignType } from '@/types/campaign-type'
import { Tags } from '@/components/tags'
import { sportLabel, campaignTypeLabel } from '@/lib/labels'

function AthleteRow({ athlete }: { athlete: Athlete }) {
  const socials = [
    athlete.ig_account && `IG: @${athlete.ig_account}`,
    athlete.yt_account && `YT: ${athlete.yt_account}`,
    athlete.tt_account && `TT: @${athlete.tt_account}`,
  ].filter(Boolean)

  return (
    <Link
      href={`/explore/athletes/${athlete.id}`}
      className="group flex items-start gap-6 rounded-md border border-zinc-800/60 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900"
    >
      <div className="min-w-0 flex-1 space-y-4">
        <p className="text-base font-semibold text-zinc-100">
          {athlete.first_name} {athlete.last_name}
        </p>

        {athlete.bio && (
          <p className="line-clamp-2 text-sm leading-relaxed text-zinc-500">{athlete.bio}</p>
        )}

        <div className="space-y-2">
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-widest text-zinc-600">Sports</p>
            <Tags groups={[{ items: athlete.sports.map(sportLabel) }]} />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-widest text-zinc-600">Campaign type</p>
            <Tags groups={[{ items: athlete.campaign_types.map(campaignTypeLabel), color: 'blue' }]} />
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-zinc-500">
          {socials.map((s) => (
            <span key={s}>{s}</span>
          ))}
          <span>Location: {athlete.location}</span>
        </div>
      </div>

      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-1 ring-zinc-700 group-hover:ring-zinc-600">
        {athlete.avatar_url ? (
          <Image
            src={athlete.avatar_url}
            alt={`${athlete.first_name} ${athlete.last_name}`}
            width={64}
            height={64}
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-zinc-800" />
        )}
      </div>
    </Link>
  )
}

type Props = {
  athletes: Athlete[]
}

export function AthleteListWithFilters({ athletes }: Props) {
  const [selectedTypes, setSelectedTypes] = useState<CampaignType[]>([])
  const [locationInput, setLocationInput] = useState('')
  const [appliedTypes, setAppliedTypes] = useState<CampaignType[]>([])
  const [appliedLocation, setAppliedLocation] = useState('')

  const toggleType = (type: CampaignType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const applyFilters = () => {
    setAppliedTypes(selectedTypes)
    setAppliedLocation(locationInput)
  }

  const filtered = athletes.filter((a) => {
    const typeMatch =
      appliedTypes.length === 0 || appliedTypes.some((t) => a.campaign_types.includes(t))
    const locationMatch =
      appliedLocation.trim() === '' ||
      a.location.toLowerCase().includes(appliedLocation.trim().toLowerCase())
    return typeMatch && locationMatch
  })

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">

      {/* Sidebar */}
      <aside className="space-y-8">
        <div className="rounded-md border border-zinc-800/60 bg-zinc-900/50 p-6 space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Campaign type</p>
            <div className="space-y-2">
              {CAMPAIGN_TYPES.map(({ id, label }) => (
                <label key={id} className="flex cursor-pointer items-center gap-3 group">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(id)}
                    onChange={() => toggleType(id)}
                    className="h-3.5 w-3.5 rounded-sm border border-zinc-600 bg-zinc-800 accent-zinc-100 cursor-pointer"
                  />
                  <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={applyFilters}
            className="w-full cursor-pointer rounded-md border border-zinc-700 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100"
          >
            Apply
          </button>
        </div>

        <div className="rounded-md border border-zinc-800/60 bg-zinc-900/50 p-6 space-y-4">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Location</p>
          <input
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="e.g. Warsaw"
            className="w-full rounded-md border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors focus:border-zinc-600"
          />
          <button
            type="button"
            onClick={applyFilters}
            className="w-full cursor-pointer rounded-md border border-zinc-700 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100"
          >
            Apply
          </button>
        </div>
      </aside>

      {/* Athlete list */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-zinc-500">No athletes match the selected filters.</p>
        ) : (
          filtered.map((athlete) => (
            <AthleteRow key={athlete.id} athlete={athlete} />
          ))
        )}
      </div>

    </div>
  )
}
