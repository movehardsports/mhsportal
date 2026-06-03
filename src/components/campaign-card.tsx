import { Tags } from '@/components/tags'
import { sportLabel, campaignTypeLabel } from '@/lib/labels'
import type { Campaign } from '@/types/campaign'

export function CampaignCard({ campaign, brandName }: { campaign: Campaign; brandName?: string }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700 hover:bg-zinc-800/60 cursor-pointer">
      <div>
        <p className="text-xs text-zinc-500">{brandName}</p>
        <h2 className="mt-0.5 text-sm font-semibold leading-snug text-zinc-100">{campaign.title}</h2>
      </div>
      <p className="line-clamp-3 text-xs leading-relaxed text-zinc-400">{campaign.description}</p>
      <Tags items={campaign.sports.map(sportLabel)} />
      <Tags items={campaign.campaign_types.map(campaignTypeLabel)} color="blue" />
      <div className="mt-auto flex items-center justify-between border-t border-zinc-800 pt-4 text-xs text-zinc-400">
        <span>{campaign.location}</span>
        <span>{campaign.budget === 'negotiable' ? 'Negotiable' : `${String(campaign.budget).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} PLN`}</span>
      </div>
    </article>
  )
}
