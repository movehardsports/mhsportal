'use client'

import { useActionState } from 'react'
import { createCampaign, updateCampaign } from '@/app/actions/campaigns'
import { DisciplinePicker } from '@/components/discipline-picker/discipline-picker'
import { CAMPAIGN_TYPES } from '@/types/campaign-type'
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

      <div>
        <label htmlFor="campaign_type" className="block text-sm/6 font-medium text-gray-100">
          Campaign type <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <div className="mt-2">
          <select
            id="campaign_type"
            name="campaign_type"
            defaultValue={campaign?.campaign_type ?? ''}
            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          >
            <option value="">— Select type —</option>
            {CAMPAIGN_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
        {state?.errors?.campaign_type && (
          <p aria-live="polite" className="mt-2 text-sm text-red-400">
            {state.errors.campaign_type[0]}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="budget" className="block text-sm/6 font-medium text-gray-100">
            Budget <span className="text-gray-500 font-normal">(optional)</span>
          </label>
          <div className="mt-2">
            <input
              id="budget"
              name="budget"
              type="text"
              maxLength={100}
              placeholder="e.g. 1000 PLN, negotiable"
              defaultValue={campaign?.budget ?? ''}
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>
          {state?.errors?.budget && (
            <p aria-live="polite" className="mt-2 text-sm text-red-400">
              {state.errors.budget[0]}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm/6 font-medium text-gray-100">
            Application deadline <span className="text-gray-500 font-normal">(optional)</span>
          </label>
          <div className="mt-2">
            <input
              id="deadline"
              name="deadline"
              type="date"
              defaultValue={campaign?.deadline ?? ''}
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>
          {state?.errors?.deadline && (
            <p aria-live="polite" className="mt-2 text-sm text-red-400">
              {state.errors.deadline[0]}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm/6 font-medium text-gray-100">
          Location <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <div className="mt-2">
          <input
            id="location"
            name="location"
            type="text"
            maxLength={100}
            placeholder="e.g. Warsaw, Remote"
            defaultValue={campaign?.location ?? ''}
            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          />
        </div>
        {state?.errors?.location && (
          <p aria-live="polite" className="mt-2 text-sm text-red-400">
            {state.errors.location[0]}
          </p>
        )}
      </div>

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
