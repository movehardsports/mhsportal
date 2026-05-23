import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getActiveCampaign } from '@/lib/dal'
import { DISCIPLINES } from '@/types/discipline'

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const campaign = await getActiveCampaign(id)

  if (!campaign) notFound()

  const brandName = campaign.brand_name

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <main className="mx-auto max-w-5xl px-2 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link
          href="/campaigns"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Campaigns
        </Link>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{campaign.title}</h1>
          {brandName && (
            <p className="text-sm text-indigo-400 font-medium mt-1">{brandName}</p>
          )}
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 px-6 py-5">
          <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
            {campaign.description}
          </p>
        </div>

        {campaign.disciplines && campaign.disciplines.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {campaign.disciplines.map((id) => {
              const label = DISCIPLINES.find((d) => d.id === id)?.label ?? id
              return (
                <span
                  key={id}
                  className="rounded-full border border-indigo-500 bg-indigo-500/20 px-4 py-1.5 text-sm font-medium uppercase tracking-wide text-indigo-300"
                >
                  {label}
                </span>
              )
            })}
          </div>
        )}

        <dl className="text-sm">
          <dt className="text-gray-500">Published</dt>
          <dd className="mt-1 text-gray-300">{formatDate(campaign.created_at)}</dd>
        </dl>
      </div>
    </main>
  )
}
