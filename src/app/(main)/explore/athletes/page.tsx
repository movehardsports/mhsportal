import Link from 'next/link'
import { getPublicAthletes } from '@/lib/dal'
import { DISCIPLINES } from '@/types/discipline'

export default async function ExploreAthletesPage() {
  const athletes = await getPublicAthletes()

  return (
    <main className="mx-auto max-w-5xl px-2 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-white mb-8">Athletes</h1>

      {athletes.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">No athletes registered yet.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {athletes.map((athlete) => (
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
      )}
    </main>
  )
}
