import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { SPORTS } from '@/types/sport'
import { MOCK_ATHLETES } from '@/mocks/athletes'
import { AthleteListWithFilters } from '@/components/athlete-list-with-filters'
import { Tags } from '@/components/tags'
import { sportLabel, campaignTypeLabel } from '@/lib/labels'

export default async function AthletesSubPage({ params }: { params: Promise<{ sport: string }> }) {
  const { sport: id } = await params

  // Sport filter page
  const sport = SPORTS.find((s) => s.id === id)
  if (sport) {
    const athletes = MOCK_ATHLETES.filter((a) => a.sports.includes(sport.id))
    return (
      <main className="w-full mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-10">
          <Link
            href="/explore/athletes"
            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300 mb-4"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Athletes
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">{sport.label}</h1>
          <p className="mt-1 text-sm text-zinc-400">{athletes.length} athlete{athletes.length !== 1 ? 's' : ''}</p>
        </div>
        <AthleteListWithFilters athletes={athletes} />
      </main>
    )
  }

  // Athlete profile page
  const athlete = MOCK_ATHLETES.find((a) => a.id === id)
  if (!athlete) notFound()

  const socials: { label: string; value: string }[] = [
    athlete.ig_account ? { label: 'Instagram', value: `@${athlete.ig_account}` } : null,
    athlete.yt_account ? { label: 'YouTube', value: athlete.yt_account } : null,
    athlete.tt_account ? { label: 'TikTok', value: `@${athlete.tt_account}` } : null,
  ].filter((s): s is { label: string; value: string } => s !== null)

  return (
    <main className="w-full mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">

        {/* Left column */}
        <div className="space-y-10 lg:col-span-2">
          <div>
            <Link
              href="/explore/athletes"
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300 mb-6"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Athletes
            </Link>

            <div className="flex items-center gap-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-1 ring-zinc-700">
                {athlete.avatar_url ? (
                  <Image
                    src={athlete.avatar_url}
                    alt={`${athlete.first_name} ${athlete.last_name}`}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-zinc-800" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">
                  {athlete.first_name} {athlete.last_name}
                </h1>
                <p className="mt-1 text-sm text-zinc-500">{athlete.location}</p>
              </div>
            </div>
          </div>

          {athlete.bio && (
            <p className="text-base leading-8 text-zinc-400">{athlete.bio}</p>
          )}

          <Tags groups={[
            { items: athlete.sports.map(sportLabel) },
            { items: athlete.campaign_types.map(campaignTypeLabel), color: 'blue' },
          ]} />
        </div>

        {/* Sidebar */}
        <div className="sticky top-8 h-fit space-y-4">
          <div className="rounded-md border border-zinc-800/60 bg-zinc-900/50 p-8 space-y-6">
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">Profile</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                  <span className="text-xs text-zinc-600">Location</span>
                  <span className="text-sm font-medium text-zinc-300">{athlete.location}</span>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                  <span className="text-xs text-zinc-600">Born</span>
                  <span className="text-sm font-medium text-zinc-300">{athlete.birth_year}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">Gender</span>
                  <span className="text-sm font-medium capitalize text-zinc-300">{athlete.gender}</span>
                </div>
              </div>
            </div>

            {socials.length > 0 && (
              <div className="space-y-4">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">Social</p>
                <div className="space-y-3">
                  {socials.map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-zinc-600">{label}</span>
                      <span className="text-sm font-medium text-zinc-300">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  )
}
