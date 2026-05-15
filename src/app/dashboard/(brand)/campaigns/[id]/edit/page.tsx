import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCampaign } from '@/lib/dal'
import { CampaignForm } from '../../_components/campaign-form'

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const campaign = await getCampaign(id)

  if (!campaign) notFound()

  return (
    <main className="mx-auto max-w-5xl px-2 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link
          href="/dashboard/campaigns"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Campaigns
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-white">Edit Campaign</h1>
      </div>
      <CampaignForm campaign={campaign} />
    </main>
  )
}
