import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getProfile } from '@/lib/dal'
import { ProfileForm } from '../_components/profile-form'
import { DeleteAccountButton } from '../_components/delete-account-button'

export default async function ProfileEditPage() {
  const profile = await getProfile()

  if (!profile) redirect('/login')

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <div className="mb-8">
        <Link
          href="/dashboard/profile"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Profile
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-white mb-8">Edit Profile</h1>
      <ProfileForm profile={profile} />
      <DeleteAccountButton />
    </main>
  )
}
