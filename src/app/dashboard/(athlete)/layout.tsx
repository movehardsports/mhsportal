import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/dal'

export default async function AthleteLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile()
  if (!profile || profile.account_type !== 'athlete') redirect('/dashboard')
  return <>{children}</>
}
