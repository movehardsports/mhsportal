'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { DISCIPLINE_IDS } from '@/types/discipline'

const SignUpSchema = z.object({
  accountType: z.enum(['athlete', 'brand'], { error: 'Select account type.' }),
  email: z.email({ error: 'Enter a valid email address.' }),
  password: z
    .string()
    .min(8, { error: 'Password must be at least 8 characters.' })
    .regex(/[a-zA-Z]/, { error: 'Password must contain at least one letter.' })
    .regex(/[0-9]/, { error: 'Password must contain at least one number.' }),
})

const SignInSchema = z.object({
  email: z.string()
    .min(1, { error: 'Email is required.' })
    .email({ error: 'Enter a valid email address.' }),
  password: z.string().min(1, { error: 'Password is required.' }),
})

const DisciplinesSchema = z
  .array(z.enum(DISCIPLINE_IDS))
  .min(1, { error: 'Select at least one discipline.' })

const OnboardingAthleteSchema = z.object({
  first_name: z.string().min(1, { error: 'First name is required.' }).max(100).trim(),
  last_name: z.string().min(1, { error: 'Last name is required.' }).max(100).trim(),
  disciplines: DisciplinesSchema,
})

const OnboardingBrandSchema = z.object({
  brand_name: z.string().min(1, { error: 'Brand name is required.' }).max(100).trim(),
  disciplines: DisciplinesSchema,
})

type SignUpFormState = {
  errors?: {
    accountType?: string[]
    email?: string[]
    password?: string[]
    general?: string
  }
} | undefined

type SignInFormState = {
  errors?: {
    email?: string[]
    password?: string[]
    general?: string
  }
} | undefined

type OnboardingFormState = {
  errors?: {
    first_name?: string[]
    last_name?: string[]
    brand_name?: string[]
    disciplines?: string[]
    general?: string
  }
} | undefined

export async function signUp(state: SignUpFormState, formData: FormData): Promise<SignUpFormState> {
  const parsed = SignUpSchema.safeParse({
    accountType: formData.get('account-type'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors }
  }

  const { accountType, email, password } = parsed.data

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { account_type: accountType } },
  })

  if (error) {
    console.error('[signUp]', error.code, error.message)
    return { errors: { general: 'Could not create account. Please try again.' } }
  }

  redirect('/onboarding')
}

export async function signIn(state: SignInFormState, formData: FormData): Promise<SignInFormState> {
  const parsed = SignInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors }
  }

  const { email, password } = parsed.data

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    console.error('[signIn]', error.code, error.message)
    return { errors: { general: 'Invalid login credentials.' } }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', data.user.id)
    .single()

  redirect(profile?.onboarding_completed ? '/dashboard' : '/onboarding')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
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

  const disciplines = formData.getAll('disciplines').filter((v): v is string => typeof v === 'string')

  if (accountType === 'athlete') {
    const parsed = OnboardingAthleteSchema.safeParse({
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      disciplines,
    })

    if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors }

    const { error } = await supabase
      .from('profiles')
      .update({ ...parsed.data, onboarding_completed: true })
      .eq('id', user.id)

    if (error) {
      console.error('[completeOnboarding]', error.message)
      return { errors: { general: 'Could not save profile. Please try again.' } }
    }
  } else {
    const parsed = OnboardingBrandSchema.safeParse({
      brand_name: formData.get('brand_name'),
      disciplines,
    })

    if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors }

    const { error } = await supabase
      .from('profiles')
      .update({ ...parsed.data, onboarding_completed: true })
      .eq('id', user.id)

    if (error) {
      console.error('[completeOnboarding]', error.message)
      return { errors: { general: 'Could not save profile. Please try again.' } }
    }
  }

  redirect('/dashboard')
}
