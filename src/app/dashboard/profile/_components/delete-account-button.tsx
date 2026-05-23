'use client'

import { useActionState } from 'react'
import { deleteAccount } from '@/app/actions/profile'

export function DeleteAccountButton() {
  const [state, action, pending] = useActionState(deleteAccount, undefined)

  return (
    <div className="pt-8 border-t border-white/10">
      {state?.error && (
        <p className="mb-3 text-sm text-red-400">{state.error}</p>
      )}
      <form action={action}>
        <button
          type="submit"
          disabled={pending}
          onClick={(e) => {
            if (!window.confirm('Are you sure you want to permanently delete your account? This cannot be undone.')) {
              e.preventDefault()
            }
          }}
          className="rounded-md border border-red-500/50 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? 'Deleting...' : 'Delete account'}
        </button>
      </form>
    </div>
  )
}
