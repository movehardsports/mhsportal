import Link from 'next/link'
import { getCampaigns } from '@/lib/dal'

export default async function CampaignsPage() {
  const campaigns = await getCampaigns()

  return (
    <main className="mx-auto max-w-5xl px-2 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/dashboard/campaigns/new"
          className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 transition-colors"
        >
          New Campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">No campaigns yet.</p>
          <Link
            href="/dashboard/campaigns/new"
            className="mt-4 inline-block text-indigo-400 hover:text-indigo-300 text-sm font-medium"
          >
            Create your first campaign →
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {campaigns.map((campaign) => (
            <li
              key={campaign.id}
              className="rounded-lg border border-white/10 bg-white/5 px-6 py-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-white">{campaign.title}</h2>
                  <p className="mt-1 text-sm text-gray-400 line-clamp-2">{campaign.description}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <Link
                      href={`/dashboard/campaigns/${campaign.id}`}
                      className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Preview
                    </Link>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-gray-300">
                  {campaign.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
