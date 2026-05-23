import Link from 'next/link'
import { getActiveCampaigns } from '@/lib/dal'
import { DISCIPLINES } from '@/types/discipline'

export default async function CampaignsPage() {
  const campaigns = await getActiveCampaigns()

  return (
    <main className="mx-auto max-w-5xl px-2 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-white mb-8">Campaigns</h1>

      {campaigns.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">No active campaigns at the moment.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {campaigns.map((campaign) => (
            <li
              key={campaign.id}
              className="rounded-lg border border-white/10 bg-white/5 px-6 py-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-2 flex-1">
                  <div>
                    <h2 className="text-base font-semibold text-white">{campaign.title}</h2>
                    {campaign.brand_name && (
                      <p className="text-sm text-indigo-400 mt-0.5 font-medium">{campaign.brand_name}</p>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">{campaign.description}</p>
                  {campaign.disciplines && campaign.disciplines.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {campaign.disciplines.map((id) => {
                        const label = DISCIPLINES.find((d) => d.id === id)?.label ?? id
                        return (
                          <span
                            key={id}
                            className="rounded-full border border-indigo-500/50 bg-indigo-500/10 px-3 py-0.5 text-xs font-medium uppercase tracking-wide text-indigo-300"
                          >
                            {label}
                          </span>
                        )
                      })}
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <Link
                      href={`/campaigns/${campaign.id}`}
                      className="inline-block rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 transition-colors"
                    >
                      See details
                    </Link>
                    {campaign.application_count > 0 && (
                      <span className="text-xs text-gray-500">
                        {campaign.application_count === 1
                          ? '1 application'
                          : `${campaign.application_count} applications`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
