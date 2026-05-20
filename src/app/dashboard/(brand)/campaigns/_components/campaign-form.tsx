'use client'

import { useActionState } from 'react'
import { createCampaign, updateCampaign } from '@/app/actions/campaigns'
import { DisciplinePicker } from '@/components/discipline-picker/discipline-picker'
import type { Campaign } from '@/types/campaign'
import type { CampaignFormState } from '@/app/actions/campaigns'

type Props = { campaign?: Campaign }

export function CampaignForm({ campaign }: Props) {
  const action = campaign
    ? updateCampaign.bind(null, campaign.id)
    : createCampaign
  const [state, formAction, pending] = useActionState<CampaignFormState, FormData>(
    action,
    undefined
  )

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm/6 font-medium text-gray-100">
          Title
        </label>
        <div className="mt-2">
          <input
            id="title"
            name="title"
            type="text"
            required
            maxLength={200}
            defaultValue={campaign?.title}
            aria-invalid={!!state?.errors?.title}
            aria-describedby={state?.errors?.title ? 'title-error' : undefined}
            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          />
        </div>
        {state?.errors?.title && (
          <p id="title-error" aria-live="polite" className="mt-2 text-sm text-red-400">
            {state.errors.title[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm/6 font-medium text-gray-100">
          Description
        </label>
        <div className="mt-2">
          <textarea
            id="description"
            name="description"
            required
            rows={6}
            maxLength={5000}
            defaultValue={campaign?.description}
            aria-invalid={!!state?.errors?.description}
            aria-describedby={state?.errors?.description ? 'description-error' : undefined}
            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 resize-none"
          />
        </div>
        {state?.errors?.description && (
          <p id="description-error" aria-live="polite" className="mt-2 text-sm text-red-400">
            {state.errors.description[0]}
          </p>
        )}
      </div>

      <DisciplinePicker
        defaultValue={campaign?.disciplines ?? []}
        error={state?.errors?.disciplines?.[0]}
      />

      {state?.errors?.general && (
        <p role="alert" className="text-sm text-red-400">
          {state.errors.general}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending
          ? campaign ? 'Saving...' : 'Creating...'
          : campaign ? 'Save Changes' : 'Create Campaign'}
      </button>
    </form>
  )
}
