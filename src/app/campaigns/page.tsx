import { MOCK_CAMPAIGNS } from '@/mocks/campaigns'
import { MOCK_BRANDS } from '@/mocks/brands'
import { CampaignCard } from '@/components/campaign-card'

export default function CampaignsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_CAMPAIGNS.map((campaign) => {
          const brand = MOCK_BRANDS.find((b) => b.id === campaign.brand_id)
          return <CampaignCard key={campaign.id} campaign={campaign} brandName={brand?.brand_name} />
        })}
      </div>
    </main>
  )
}
