import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/dal'
import Header from '@/components/header/header'

const navigation = [
  { name: 'My Campaigns', href: '/dashboard/campaigns' },
  { name: 'My Profile', href: '#' },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile()

  if (!profile) redirect('/login')
  if (!profile.onboarding_completed) redirect('/onboarding')

  return (
    <>
      <Header navigation={navigation} showSignOut />
      {children}
    </>
  )
}
