'use client'

import { useActionState } from 'react'
import { completeOnboarding } from '@/app/actions/auth'
import { DisciplinePicker } from '@/components/discipline-picker/discipline-picker'

type Props = {
  accountType: 'athlete' | 'brand'
}

export default function OnboardingForm({ accountType }: Props) {
  const [state, action, pending] = useActionState(completeOnboarding, undefined)

  return (
    <form action={action} className="space-y-6">
      {accountType === 'athlete' ? (
        <>
          <div>
            <label htmlFor="first_name" className="block text-sm/6 font-medium text-gray-100">
              First name
            </label>
            <div className="mt-2">
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                autoComplete="given-name"
                aria-invalid={!!state?.errors?.first_name}
                aria-describedby={state?.errors?.first_name ? 'first-name-error' : undefined}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
            {state?.errors?.first_name && (
              <p id="first-name-error" aria-live="polite" className="mt-2 text-sm text-red-400">
                {state.errors.first_name[0]}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm/6 font-medium text-gray-100">
              Last name
            </label>
            <div className="mt-2">
              <input
                id="last_name"
                name="last_name"
                type="text"
                required
                autoComplete="family-name"
                aria-invalid={!!state?.errors?.last_name}
                aria-describedby={state?.errors?.last_name ? 'last-name-error' : undefined}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
            {state?.errors?.last_name && (
              <p id="last-name-error" aria-live="polite" className="mt-2 text-sm text-red-400">
                {state.errors.last_name[0]}
              </p>
            )}
          </div>
        </>
      ) : (
        <div>
          <label htmlFor="brand_name" className="block text-sm/6 font-medium text-gray-100">
            Brand name
          </label>
          <div className="mt-2">
            <input
              id="brand_name"
              name="brand_name"
              type="text"
              required
              autoComplete="organization"
              aria-invalid={!!state?.errors?.brand_name}
              aria-describedby={state?.errors?.brand_name ? 'brand-name-error' : undefined}
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>
          {state?.errors?.brand_name && (
            <p id="brand-name-error" aria-live="polite" className="mt-2 text-sm text-red-400">
              {state.errors.brand_name[0]}
            </p>
          )}
        </div>
      )}

      <DisciplinePicker error={state?.errors?.disciplines?.[0]} />

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
        {pending ? 'Saving...' : 'Continue'}
      </button>
    </form>
  )
}
