import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { SPORTS } from '@/types/sport'
import { MOCK_BRANDS } from '@/mocks/brands'
import { MOCK_CAMPAIGNS } from '@/mocks/campaigns'
import { BrandListWithFilters } from '@/components/brand-list-with-filters'
import { CampaignCard } from '@/components/campaign-card'
import { Tags } from '@/components/tags'
import { sportLabel, campaignTypeLabel } from '@/lib/labels'

export default async function BrandsSubPage({ params }: { params: Promise<{ sport: string }> }) {
  const { sport: id } = await params

  // Sport filter page
  const sport = SPORTS.find((s) => s.id === id)
  if (sport) {
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

  // Brand detail page
  const brand = MOCK_BRANDS.find((b) => b.id === id)
  if (!brand) notFound()

  const campaigns = MOCK_CAMPAIGNS.filter((c) => c.brand_id === brand.id)

  const socials: { label: string; value: string }[] = [
    brand.ig_account ? { label: 'Instagram', value: `@${brand.ig_account}` } : null,
    brand.yt_account ? { label: 'YouTube', value: brand.yt_account } : null,
    brand.tt_account ? { label: 'TikTok', value: `@${brand.tt_account}` } : null,
  ].filter((s): s is { label: string; value: string } => s !== null)

  return (
    <main className="w-full mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">

        {/* Left column */}
        <div className="space-y-10 lg:col-span-2">
          <div>
            <Link
              href="/explore/brands"
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300 mb-6"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Brands
            </Link>

            <div className="flex items-center gap-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-1 ring-zinc-700">
                {brand.avatar_url ? (
                  <Image
                    src={brand.avatar_url}
                    alt={brand.brand_name}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-zinc-800" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">{brand.brand_name}</h1>
                <p className="mt-1 text-sm text-zinc-500">
                  {brand.location}
                  {brand.web && (
                    <> · <span className="text-zinc-500">{brand.web}</span></>
                  )}
                </p>
              </div>
            </div>
          </div>

          {brand.bio && (
            <p className="text-base leading-8 text-zinc-400">{brand.bio}</p>
          )}

          <Tags groups={[
            { items: brand.sports.map(sportLabel) },
            { items: brand.campaign_types.map(campaignTypeLabel), color: 'blue' },
          ]} />

          {campaigns.length > 0 && (
            <div className="space-y-5">
              <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                Active campaigns
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {campaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} brandName={brand.brand_name} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="sticky top-8 h-fit space-y-4">
          <div className="rounded-md border border-zinc-800/60 bg-zinc-900/50 p-8 space-y-6">
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">Contact</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                  <span className="text-xs text-zinc-600">Email</span>
                  <span className="text-sm font-medium text-zinc-300">{brand.contact_email}</span>
                </div>
                {brand.web && (
                  <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                    <span className="text-xs text-zinc-600">Website</span>
                    <span className="text-sm font-medium text-zinc-300">{brand.web}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">Location</span>
                  <span className="text-sm font-medium text-zinc-300">{brand.location}</span>
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
