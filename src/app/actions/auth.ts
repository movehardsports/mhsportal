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

  redirect('/login')
}
