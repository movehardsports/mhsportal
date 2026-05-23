import Link from 'next/link'
import { getAthleteApplications } from '@/lib/dal'
import { ApplicationActions } from './_components/application-actions'

const statusStyles: Record<string, string> = {
  pending: 'bg-white/10 text-gray-300',
  accepted: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
}

export default async function ApplicationsPage() {
  const applications = await getAthleteApplications()

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <main className="mx-auto max-w-5xl px-2 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-white mb-8">My Applications</h1>

      {applications.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">You haven&apos;t applied to any campaigns yet.</p>
          <Link
            href="/campaigns"
            className="mt-4 inline-block text-indigo-400 hover:text-indigo-300 text-sm font-medium"
          >
            Browse campaigns →
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {applications.map((app) => (
            <li
              key={app.id}
              className="rounded-lg border border-white/10 bg-white/5 px-6 py-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <Link
                    href={`/campaigns/${app.campaign_id}`}
                    className="text-base font-semibold text-white hover:text-indigo-300 transition-colors"
                  >
                    {app.campaign_title}
                  </Link>
                  {app.brand_name && (
                    <p className="text-sm text-indigo-400">{app.brand_name}</p>
                  )}
                  {app.message && (
                    <p className="mt-2 text-sm text-gray-400 line-clamp-2">{app.message}</p>
                  )}
                  <p className="text-xs text-gray-500 pt-1">{formatDate(app.created_at)}</p>
                  {app.status === 'pending' && (
                    <ApplicationActions id={app.id} message={app.message} />
                  )}
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${statusStyles[app.status] ?? statusStyles.pending}`}>
                  {app.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
