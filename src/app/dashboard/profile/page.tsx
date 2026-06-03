import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getProfile } from '@/lib/dal'
import { DISCIPLINES } from '@/types/discipline'

export default async function ProfilePage() {
  const profile = await getProfile()

  if (!profile) redirect('/login')

  const displayName =
    profile.account_type === 'athlete'
      ? `${profile.first_name} ${profile.last_name}`
      : profile.brand_name

  return (
    <main className="mx-auto max-w-5xl px-2 sm:px-6 lg:px-8 py-10">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">{displayName}</h1>

        {profile.disciplines && profile.disciplines.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {profile.disciplines.map((id) => {
              const label = DISCIPLINES.find((d) => d.id === id)?.label ?? id
              return (
                <span
                  key={id}
                  className="rounded-full border border-indigo-500 bg-indigo-500/20 px-4 py-1.5 text-sm font-medium uppercase tracking-wide text-indigo-300"
                >
                  {label}
                </span>
              )
            })}
          </div>
        )}

        {profile.bio && (
          <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{profile.bio}</p>
        )}

        <dl className="text-sm space-y-3">
          {profile.location && (
            <div>
              <dt className="text-gray-500">Location</dt>
              <dd className="mt-0.5 text-gray-300">{profile.location}</dd>
            </div>
          )}
          {profile.account_type === 'brand' && profile.website && (
            <div>
              <dt className="text-gray-500">Website</dt>
              <dd className="mt-0.5">
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                  {profile.website}
                </a>
              </dd>
            </div>
          )}
          {profile.account_type === 'brand' && profile.contact_email && (
            <div>
              <dt className="text-gray-500">Contact</dt>
              <dd className="mt-0.5 text-gray-300">{profile.contact_email}</dd>
            </div>
          )}
        </dl>

        <div className="pt-4 border-t border-white/10">
          <Link
            href="/dashboard/profile/edit"
            className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 transition-colors"
          >
            Edit
          </Link>
        </div>
      </div>
    </main>
  )
}
