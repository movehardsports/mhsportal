import Link from 'next/link'
import { getPublicBrands } from '@/lib/dal'
import { DISCIPLINES } from '@/types/discipline'

export default async function ExploreBrandsPage() {
  const brands = await getPublicBrands()

  return (
    <main className="mx-auto max-w-5xl px-2 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-white mb-8">Brands</h1>

      {brands.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">No brands registered yet.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {brands.map((brand) => (
            <li
              key={brand.id}
              className="rounded-lg border border-white/10 bg-white/5 px-6 py-5"
            >
              <div className="min-w-0 space-y-2">
                <h2 className="text-base font-semibold text-white">{brand.brand_name}</h2>
                {brand.disciplines && brand.disciplines.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {brand.disciplines.map((id) => {
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
                    href={`/explore/brands/${brand.id}`}
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
