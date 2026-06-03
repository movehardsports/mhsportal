import Link from 'next/link'
import { Tags } from '@/components/tags'
import { sportLabel, campaignTypeLabel, budgetLabel } from '@/lib/labels'
import type { Campaign } from '@/types/campaign'

export function CampaignCard({ campaign, brandName }: { campaign: Campaign; brandName?: string }) {
  return (
    <Link
      href={`/campaigns/${campaign.id}`}
      className="group flex flex-col gap-5 rounded-md border border-zinc-800/60 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900"
    >
      <div>
        <p className="text-xs font-medium text-zinc-600">{brandName}</p>
        <h2 className="mt-1.5 text-base font-semibold leading-snug tracking-tight text-zinc-100">{campaign.title}</h2>
      </div>

      <p className="line-clamp-2 text-sm leading-relaxed text-zinc-500">{campaign.description}</p>

      <Tags groups={[
        { items: campaign.sports.map(sportLabel) },
        { items: campaign.campaign_types.map(campaignTypeLabel), color: 'blue' },
      ]} />

      <div className="mt-auto flex items-center justify-between border-t border-zinc-800/60 pt-4 text-xs">
        <span className="text-zinc-600">{campaign.location}</span>
        <span className="font-medium text-zinc-400">{budgetLabel(campaign.budget)}</span>
      </div>
    </Link>
  )
}
