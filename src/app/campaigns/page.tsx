import { MOCK_CAMPAIGNS } from '@/mocks/campaigns'
import { MOCK_BRANDS } from '@/mocks/brands'
import { CampaignsFilters } from '@/components/campaigns-filters'
import { CampaignsGrid } from '@/components/campaigns-grid'

export default function CampaignsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">Campaigns</h1>
        <p className="mt-1 text-sm text-zinc-400">Find campaigns that match your sport and style.</p>
      </div>
      <CampaignsFilters />
      <CampaignsGrid campaigns={MOCK_CAMPAIGNS} brands={MOCK_BRANDS} />
    </main>
  )
}
