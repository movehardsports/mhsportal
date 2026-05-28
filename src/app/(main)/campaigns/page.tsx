import { getActiveCampaigns } from '@/lib/dal'
import { DISCIPLINE_IDS } from '@/types/discipline'
import type { Discipline } from '@/types/discipline'
import { DisciplineFilter } from '@/components/discipline-filter'
import { CampaignList } from './_components/campaign-list'

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ disciplines?: string | string[] }>
}) {
  const { disciplines: raw } = await searchParams

  const selected = (Array.isArray(raw) ? raw : raw ? [raw] : []).filter((d): d is Discipline =>
    (DISCIPLINE_IDS as readonly string[]).includes(d)
  )

  const { data, hasMore } = await getActiveCampaigns(selected.length > 0 ? selected : undefined)

  return (
    <main className="mx-auto max-w-5xl px-2 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-white mb-8">Campaigns</h1>

      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <DisciplineFilter selected={selected} />

        <div className="flex-1 min-w-0">
          <CampaignList
            key={selected.join(',')}
            initialItems={data}
            initialHasMore={hasMore}
            disciplines={selected}
          />
        </div>
      </div>
    </main>
  )
}
