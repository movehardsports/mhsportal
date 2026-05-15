import 'server-only'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/profile'

const getSupabaseClient = cache(createClient)

export const getUser = cache(async () => {
  const supabase = await getSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user ?? null
})

export const getProfile = cache(async () => {
  const user = await getUser()
  if (!user) return null

  const supabase = await getSupabaseClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, account_type, onboarding_completed, created_at, updated_at, first_name, last_name, brand_name')
    .eq('id', user.id)
    .single<Profile>()

  return profile
})
