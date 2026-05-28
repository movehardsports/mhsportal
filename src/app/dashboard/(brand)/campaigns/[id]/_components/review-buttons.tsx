'use client'

import { useActionState } from 'react'
import { reviewApplication } from '@/app/actions/applications'

export function ReviewButtons({
  applicationId,
  campaignId,
}: {
  applicationId: string
  campaignId: string
}) {
  const [state, action, pending] = useActionState(reviewApplication, undefined)

  return (
    <form action={action} className="flex items-center gap-2 mt-3">
      <input type="hidden" name="id" value={applicationId} />
      <input type="hidden" name="campaign_id" value={campaignId} />
      {state?.error && (
        <p className="text-xs text-red-400">{state.error}</p>
      )}
      <button
        type="submit"
        name="status"
        value="accepted"
        disabled={pending}
        className="rounded-md bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? '…' : 'Accept'}
      </button>
      <button
        type="submit"
        name="status"
        value="rejected"
        disabled={pending}
        className="rounded-md bg-red-500/20 px-3 py-1 text-xs font-medium text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? '…' : 'Reject'}
      </button>
    </form>
  )
}
