import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/dal'

export default async function BrandLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile()
  if (!profile || profile.account_type !== 'brand') redirect('/dashboard')
  return <>{children}</>
}
