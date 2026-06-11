import Link from 'next/link'
import { SPORTS } from '@/types/sport'
import { MOCK_ATHLETES } from '@/mocks/athletes'
import { AthleteCard } from '@/components/athlete-card'

export default function ExploreAthletesPage() {
  const sections = SPORTS
    .map((sport) => ({
      sport,
      athletes: MOCK_ATHLETES.filter((a) => a.sports.includes(sport.id)).slice(0, 4),
    }))
    .filter((s) => s.athletes.length > 0)

  return (
    <main className="w-full mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">Explore Athletes</h1>
        <p className="mt-1 text-sm text-zinc-400">Discover athletes across every sport.</p>
      </div>

      <div className="space-y-14">
        {sections.map(({ sport, athletes }) => (
          <section key={sport.id}>
            <Link
              href={`/explore/athletes/${sport.id}`}
              className="mb-5 inline-block text-xs font-medium uppercase tracking-widest text-zinc-500 transition-colors hover:text-zinc-300"
            >
              {sport.label}
            </Link>

            <div className="flex items-center gap-4">
              <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
                {athletes.map((athlete) => (
                  <AthleteCard key={athlete.id} athlete={athlete} />
                ))}
              </div>

              <Link
                href={`/explore/athletes/${sport.id}`}
                className="shrink-0 rounded-full border border-zinc-800 p-2 text-zinc-600 transition-colors hover:border-zinc-600 hover:text-zinc-300"
                aria-label={`See all ${sport.label} athletes`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
