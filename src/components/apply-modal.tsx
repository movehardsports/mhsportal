'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  campaignTitle: string
  brandName: string
  message: string
  onMessageChange: (value: string) => void
  onSubmit: () => void
  onClose: () => void
  submitted: boolean
}

export function ApplyModal({ campaignTitle, brandName, message, onMessageChange, onSubmit, onClose, submitted }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-modal-title"
        className="relative w-full max-w-lg rounded-md border border-zinc-800/60 bg-zinc-900 p-8 shadow-xl"
      >
        {submitted ? (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800">
              <svg className="h-5 w-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-zinc-100">Application sent</p>
              <p className="mt-1 text-sm text-zinc-500">Your application to <span className="text-zinc-300">{campaignTitle}</span> has been submitted.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-md bg-zinc-100 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p id="apply-modal-title" className="text-base font-semibold text-zinc-100">Apply for campaign</p>
              <p className="mt-1 text-sm text-zinc-500">{brandName} · {campaignTitle}</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="apply-message" className="text-xs font-medium uppercase tracking-widest text-zinc-600">
                Message <span className="normal-case tracking-normal text-zinc-700">(optional)</span>
              </label>
              <textarea
                id="apply-message"
                rows={5}
                value={message}
                onChange={(e) => onMessageChange(e.target.value)}
                placeholder="Tell the brand about yourself and why you're a good fit..."
                className="w-full resize-none rounded-md border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors focus:border-zinc-600"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-md border border-zinc-800 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSubmit}
                className="flex-1 rounded-md bg-zinc-100 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white"
              >
                Apply now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
