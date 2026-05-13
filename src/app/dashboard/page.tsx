import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/profile'

export default async function Dashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Profile>()

  if (!profile) redirect('/login')

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>

      <dl className="mt-8 divide-y divide-white/10">
        <Row label="Email" value={user.email ?? '—'} />
        <Row label="Account type" value={profile.account_type === 'athlete' ? 'Athlete' : 'Brand'} />
        {profile.account_type === 'athlete' ? (
          <Row label="Name" value={`${profile.first_name} ${profile.last_name}`} />
        ) : (
          <Row label="Brand name" value={profile.brand_name} />
        )}
        <Row label="Member since" value={new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} />
      </dl>
    </main>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-4 flex justify-between gap-4">
      <dt className="text-sm text-gray-400">{label}</dt>
      <dd className="text-sm font-medium text-white text-right">{value}</dd>
    </div>
  )
}
