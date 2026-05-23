import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCampaign, getProfile } from '@/lib/dal'
import { DeleteButton } from '../_components/delete-button'
import { PublishButton } from '../_components/publish-button'
import { DISCIPLINES } from '@/types/discipline'

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [campaign, profile] = await Promise.all([getCampaign(id), getProfile()])

  if (!campaign) notFound()

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <main className="mx-auto max-w-5xl px-2 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link
          href="/dashboard/campaigns"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Campaigns
        </Link>
      </div>

      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{campaign.title}</h1>
            {profile?.brand_name && (
              <p className="text-sm text-indigo-400 font-medium mt-1">{profile.brand_name}</p>
            )}
          </div>
          <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-gray-300">
            {campaign.status}
          </span>
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

        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Created</dt>
            <dd className="mt-1 text-gray-300">{formatDate(campaign.created_at)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Last updated</dt>
            <dd className="mt-1 text-gray-300">{formatDate(campaign.updated_at)}</dd>
          </div>
        </dl>

        <div className="flex items-center gap-4 pt-4 border-t border-white/10">
          <Link
            href={`/dashboard/campaigns/${campaign.id}/edit`}
            className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 transition-colors"
          >
            Edit
          </Link>
          {campaign.status === 'preview' && <PublishButton id={campaign.id} />}
          <DeleteButton id={campaign.id} />
        </div>
      </div>
    </main>
  )
}
