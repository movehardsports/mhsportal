import Link from 'next/link'
import { SPORTS } from '@/types/sport'
import { MOCK_BRANDS } from '@/mocks/brands'
import { BrandCard } from '@/components/brand-card'

export default function ExploreBrandsPage() {
  const sections = SPORTS
    .map((sport) => ({
      sport,
      brands: MOCK_BRANDS.filter((b) => b.sports.includes(sport.id)).slice(0, 4),
    }))
    .filter((s) => s.brands.length > 0)

  return (
    <main className="w-full mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">Explore Brands</h1>
        <p className="mt-1 text-sm text-zinc-400">Discover brands looking for athletes across every sport.</p>
      </div>

      <div className="space-y-14">
        {sections.map(({ sport, brands }) => (
          <section key={sport.id}>
            <Link
              href={`/explore/brands/${sport.id}`}
              className="mb-5 inline-block text-xs font-medium uppercase tracking-widest text-zinc-500 transition-colors hover:text-zinc-300"
            >
              {sport.label}
            </Link>

            <div className="flex items-center gap-4">
              <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
                {brands.map((brand) => (
                  <BrandCard key={brand.id} brand={brand} />
                ))}
              </div>

              <Link
                href={`/explore/brands/${sport.id}`}
                className="shrink-0 rounded-full border border-zinc-800 p-2 text-zinc-600 transition-colors hover:border-zinc-600 hover:text-zinc-300"
                aria-label={`See all ${sport.label} brands`}
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
