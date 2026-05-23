'use client'

import { useActionState, useRef } from 'react'
import { applyToCampaign } from '@/app/actions/applications'

type Props = {
  campaignId: string
  alreadyApplied: boolean
}

export function ApplyButton({ campaignId, alreadyApplied }: Props) {
  const [state, action, pending] = useActionState(applyToCampaign, undefined)
  const dialogRef = useRef<HTMLDialogElement>(null)

  if (alreadyApplied || state?.success) {
    return (
      <div className="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400">
        Application submitted
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="rounded-md bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 transition-colors"
      >
        Apply
      </button>

      <dialog
        ref={dialogRef}
        className="m-auto w-full max-w-lg rounded-xl border border-white/10 bg-gray-900 p-0 text-white backdrop:bg-black/60 open:flex open:flex-col"
        onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close() }}
      >
        <div className="px-6 py-5 border-b border-white/10">
          <h2 className="text-base font-semibold">Apply to campaign</h2>
          <p className="mt-1 text-sm text-gray-400">
            Write a message to the brand (optional).
          </p>
        </div>

        <form action={action} className="px-6 py-5 space-y-4">
          <input type="hidden" name="campaign_id" value={campaignId} />

          <div>
            <label htmlFor="apply-message" className="block text-sm font-medium text-gray-300 mb-1.5">
              Message
            </label>
            <textarea
              id="apply-message"
              name="message"
              rows={5}
              maxLength={1000}
              placeholder="Introduce yourself, explain why you're a good fit..."
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-400">{state.error}</p>
          )}

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-indigo-500 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? 'Submitting...' : 'Submit application'}
            </button>
          </div>
        </form>
      </dialog>
    </>
  )
}
