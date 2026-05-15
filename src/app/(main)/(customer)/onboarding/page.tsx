import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/dal'
import OnboardingForm from './onboarding-form'

export default async function OnboardingPage() {
  const profile = await getProfile()

  if (!profile) redirect('/login')
  if (profile.onboarding_completed) redirect('/dashboard')

  const { account_type } = profile
  if (account_type !== 'athlete' && account_type !== 'brand') redirect('/login')

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Complete your profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          {account_type === 'athlete' ? 'Tell us your name' : 'Tell us about your brand'}
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <OnboardingForm accountType={account_type} />
      </div>
    </div>
  )
}
