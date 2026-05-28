import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPublicBrand } from '@/lib/dal'
import { DISCIPLINES } from '@/types/discipline'

export default async function BrandProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const brand = await getPublicBrand(id)

  if (!brand) notFound()

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <main className="mx-auto max-w-5xl px-2 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link
          href="/explore/brands"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Brands
        </Link>
      </div>

      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">{brand.brand_name}</h1>

        {brand.disciplines && brand.disciplines.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {brand.disciplines.map((disciplineId) => {
              const label = DISCIPLINES.find((d) => d.id === disciplineId)?.label ?? disciplineId
              return (
                <span
                  key={disciplineId}
                  className="rounded-full border border-indigo-500 bg-indigo-500/20 px-4 py-1.5 text-sm font-medium uppercase tracking-wide text-indigo-300"
                >
                  {label}
                </span>
              )
            })}
          </div>
        )}

        <dl className="text-sm">
          <dt className="text-gray-500">Member since</dt>
          <dd className="mt-1 text-gray-300">{formatDate(brand.created_at)}</dd>
        </dl>
      </div>
    </main>
  )
}
