'use client'

import { useActionState } from 'react'
import { deleteCampaign } from '@/app/actions/campaigns'

export function DeleteButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState(deleteCampaign, undefined)

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      {state?.error && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        onClick={(e) => {
          if (!window.confirm('Are you sure you want to delete this campaign?')) {
            e.preventDefault()
          }
        }}
        className="text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? 'Deleting...' : 'Delete'}
      </button>
    </form>
  )
}
