import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SPORTS } from '@/types/sport'
import { MOCK_BRANDS } from '@/mocks/brands'
import { BrandListWithFilters } from '@/components/brand-list-with-filters'

export default async function BrandSportPage({ params }: { params: Promise<{ sport: string }> }) {
  const { sport: sportId } = await params
  const sport = SPORTS.find((s) => s.id === sportId)
  if (!sport) notFound()

  const brands = MOCK_BRANDS.filter((b) => b.sports.includes(sport.id))

  return (
    <main className="w-full mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <Link
          href="/explore/brands"
          className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300 mb-4"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Brands
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">{sport.label}</h1>
        <p className="mt-1 text-sm text-zinc-400">{brands.length} brand{brands.length !== 1 ? 's' : ''}</p>
      </div>

      <BrandListWithFilters brands={brands} />
    </main>
  )
}
