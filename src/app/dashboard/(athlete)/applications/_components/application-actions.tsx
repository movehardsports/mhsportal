'use client'

import { useActionState, useRef } from 'react'
import { updateApplication, withdrawApplication } from '@/app/actions/applications'

type Props = {
  id: string
  message: string | null
}

export function ApplicationActions({ id, message }: Props) {
  const [editState, editAction, editPending] = useActionState(updateApplication, undefined)
  const [withdrawState, withdrawAction, withdrawPending] = useActionState(withdrawApplication, undefined)
  const editDialogRef = useRef<HTMLDialogElement>(null)
  const withdrawDialogRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <div className="flex items-center gap-3 mt-3">
        <button
          type="button"
          onClick={() => editDialogRef.current?.showModal()}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
        >
          Edit
        </button>
        <span className="text-white/20">·</span>
        <button
          type="button"
          onClick={() => withdrawDialogRef.current?.showModal()}
          className="text-xs text-red-400 hover:text-red-300 transition-colors font-medium"
        >
          Withdraw
        </button>
      </div>

      {/* Edit dialog */}
      <dialog
        ref={editDialogRef}
        className="m-auto w-full max-w-lg rounded-xl border border-white/10 bg-gray-900 p-0 text-white backdrop:bg-black/60 open:flex open:flex-col"
        onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close() }}
      >
        <div className="px-6 py-5 border-b border-white/10">
          <h2 className="text-base font-semibold">Edit application</h2>
        </div>

        <form action={editAction} className="px-6 py-5 space-y-4">
          <input type="hidden" name="id" value={id} />
          <div>
            <label htmlFor={`edit-message-${id}`} className="block text-sm font-medium text-gray-300 mb-1.5">
              Message
            </label>
            <textarea
              id={`edit-message-${id}`}
              name="message"
              rows={5}
              maxLength={1000}
              defaultValue={message ?? ''}
              placeholder="Introduce yourself, explain why you're a good fit..."
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {editState?.error && (
            <p className="text-sm text-red-400">{editState.error}</p>
          )}

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={() => editDialogRef.current?.close()}
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={editPending}
              onClick={() => { if (!editPending) editDialogRef.current?.close() }}
              className="rounded-md bg-indigo-500 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editPending ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </dialog>

      {/* Withdraw dialog */}
      <dialog
        ref={withdrawDialogRef}
        className="m-auto w-full max-w-sm rounded-xl border border-white/10 bg-gray-900 p-0 text-white backdrop:bg-black/60 open:flex open:flex-col"
        onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close() }}
      >
        <div className="px-6 py-5">
          <h2 className="text-base font-semibold">Withdraw application?</h2>
          <p className="mt-2 text-sm text-gray-400">
            This will permanently remove your application. You can apply again later.
          </p>

          {withdrawState?.error && (
            <p className="mt-3 text-sm text-red-400">{withdrawState.error}</p>
          )}

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => withdrawDialogRef.current?.close()}
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <form action={withdrawAction}>
              <input type="hidden" name="id" value={id} />
              <button
                type="submit"
                disabled={withdrawPending}
                className="rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {withdrawPending ? 'Withdrawing...' : 'Withdraw'}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  )
}
