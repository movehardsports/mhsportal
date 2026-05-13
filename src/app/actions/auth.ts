'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type FormState = {
  errors?: {
    accountType?: string
    email?: string
    password?: string
    general?: string
  }
} | undefined

type OnboardingFormState = {
  errors?: {
    first_name?: string
    last_name?: string
    brand_name?: string
    general?: string
  }
} | undefined

export async function signUp(state: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const accountType = formData.get('account-type') as string

  const errors: NonNullable<NonNullable<FormState>['errors']> = {}

  if (!accountType) errors.accountType = 'Select account type.'
  if (!email) errors.email = 'Email is required.'
  if (!password || password.length < 8) errors.password = 'Password must be at least 8 characters.'

  if (Object.keys(errors).length > 0) return { errors }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { account_type: accountType },
    },
  })

  if (error) return { errors: { general: error.message } }

  redirect('/onboarding')
}

export async function signIn(state: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const errors: NonNullable<NonNullable<FormState>['errors']> = {}

  if (!email) errors.email = 'Email is required.'
  if (!password) errors.password = 'Password is required.'

  if (Object.keys(errors).length > 0) return { errors }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { errors: { general: error.message } }

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', data.user.id)
    .single()

  redirect(profile?.onboarding_completed ? '/' : '/onboarding')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function completeOnboarding(
  state: OnboardingFormState,
  formData: FormData
): Promise<OnboardingFormState> {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return { errors: { general: 'Not authenticated.' } }

  const accountType = user.user_metadata?.account_type
  if (accountType !== 'athlete' && accountType !== 'brand') {
    return { errors: { general: 'Invalid account type.' } }
  }

  const errors: NonNullable<NonNullable<OnboardingFormState>['errors']> = {}

  if (accountType === 'athlete') {
    const firstName = (formData.get('first_name') as string)?.trim()
    const lastName = (formData.get('last_name') as string)?.trim()

    if (!firstName) errors.first_name = 'First name is required.'
    if (!lastName) errors.last_name = 'Last name is required.'

    if (Object.keys(errors).length > 0) return { errors }

    const { error } = await supabase
      .from('profiles')
      .update({ first_name: firstName, last_name: lastName, onboarding_completed: true })
      .eq('id', user.id)

    if (error) return { errors: { general: error.message } }
  } else {
    const brandName = (formData.get('brand_name') as string)?.trim()

    if (!brandName) errors.brand_name = 'Brand name is required.'

    if (Object.keys(errors).length > 0) return { errors }

    const { error } = await supabase
      .from('profiles')
      .update({ brand_name: brandName, onboarding_completed: true })
      .eq('id', user.id)

    if (error) return { errors: { general: error.message } }
  }

  redirect('/')
}
