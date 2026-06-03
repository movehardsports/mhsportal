import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MOCK_CAMPAIGNS } from '@/mocks/campaigns'
import { MOCK_BRANDS } from '@/mocks/brands'
import { Tags } from '@/components/tags'
import { sportLabel, campaignTypeLabel, budgetLabel } from '@/lib/labels'

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const campaign = MOCK_CAMPAIGNS.find((c) => c.id === id)
  if (!campaign) notFound()

  const brand = MOCK_BRANDS.find((b) => b.id === campaign.brand_id)

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">

        <div className="space-y-10 lg:col-span-2">
          <div>
            <Link href="/campaigns" className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300 mb-6">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Campaigns
            </Link>
            <p className="text-sm font-medium text-zinc-500">{brand?.brand_name}</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-100">{campaign.title}</h1>
          </div>

          <Tags groups={[
            { items: campaign.sports.map(sportLabel) },
            { items: campaign.campaign_types.map(campaignTypeLabel), color: 'blue' },
          ]} />

          <p className="text-base leading-8 text-zinc-400">{campaign.description}</p>
        </div>

        <div className="sticky top-8 h-fit space-y-6">
          <div className="rounded-md border border-zinc-800/60 bg-zinc-900/50 p-8 space-y-8 backdrop-blur">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">Budget</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-100">{budgetLabel(campaign.budget)}</p>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Location', value: campaign.location },
                { label: 'Start date', value: campaign.start_date },
                ...(campaign.end_date ? [{ label: 'End date', value: campaign.end_date }] : []),
                ...(campaign.athlete_gender ? [{ label: 'Gender', value: campaign.athlete_gender }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between border-b border-zinc-800/60 pb-4 last:border-0 last:pb-0">
                  <span className="text-xs text-zinc-600">{label}</span>
                  <span className="text-sm font-medium capitalize text-zinc-300">{value}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="w-full rounded-md bg-zinc-100 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white"
            >
              Apply now
            </button>
          </div>
        </div>

      </div>
    </main>
  )
}
