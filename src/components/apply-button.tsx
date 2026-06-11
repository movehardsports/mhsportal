'use client'

import { useState } from 'react'
import { ApplyModal } from '@/components/apply-modal'

type Props = {
  campaignId: string
  campaignTitle: string
  brandName: string
}

export function ApplyButton({ campaignId: _campaignId, campaignTitle, brandName }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleOpen = () => {
    setSubmitted(false)
    setMessage('')
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="w-full cursor-pointer rounded-md bg-zinc-100 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white"
      >
        Apply now
      </button>

      {isOpen && (
        <ApplyModal
          campaignTitle={campaignTitle}
          brandName={brandName}
          message={message}
          onMessageChange={setMessage}
          onSubmit={handleSubmit}
          onClose={handleClose}
          submitted={submitted}
        />
      )}
    </>
  )
}
