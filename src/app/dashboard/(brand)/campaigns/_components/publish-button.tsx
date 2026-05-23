'use client'

import { useActionState } from 'react'
import { publishCampaign } from '@/app/actions/campaigns'

export function PublishButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState(publishCampaign, undefined)

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      {state?.error && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? 'Publishing...' : 'Publish'}
      </button>
    </form>
  )
}
