import { CampaignCard } from '@/components/campaign-card'
import type { Campaign } from '@/types/campaign'
import type { Brand } from '@/types/brand'

type Props = {
  campaigns: Campaign[]
  brands: Brand[]
}

export function CampaignsGrid({ campaigns, brands }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => {
        const brand = brands.find((b) => b.id === campaign.brand_id)
        return <CampaignCard key={campaign.id} campaign={campaign} brandName={brand?.brand_name} />
      })}
    </div>
  )
}
