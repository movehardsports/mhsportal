import Image from 'next/image'
import Link from 'next/link'
import type { Athlete } from '@/types/athlete'

export function AthleteCard({ athlete }: { athlete: Athlete }) {
  const socials = [
    athlete.ig_account && 'IG',
    athlete.yt_account && 'YT',
    athlete.tt_account && 'TT',
  ].filter(Boolean).join(' · ')

  return (
    <Link
      href={`/explore/athletes/${athlete.id}`}
      className="group flex flex-col items-center gap-4 rounded-md border border-zinc-800/60 bg-zinc-900/50 p-6 text-center transition-all hover:border-zinc-700 hover:bg-zinc-900"
    >
      <div className="relative h-16 w-16 overflow-hidden rounded-full ring-1 ring-zinc-700 group-hover:ring-zinc-600">
        {athlete.avatar_url ? (
          <Image
            src={athlete.avatar_url}
            alt={`${athlete.first_name} ${athlete.last_name}`}
            width={64}
            height={64}
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-zinc-800" />
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold leading-snug text-zinc-100">
          {athlete.first_name} {athlete.last_name}
        </p>
        <p className="text-xs text-zinc-500">{athlete.location}</p>
      </div>

      {socials && (
        <p className="text-xs text-zinc-600">{socials}</p>
      )}
    </Link>
  )
}
