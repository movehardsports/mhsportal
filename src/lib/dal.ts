import 'server-only'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/profile'
import type { Campaign } from '@/types/campaign'

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

export const getCampaigns = cache(async () => {
  const user = await getUser()
  if (!user) return []

  const supabase = await getSupabaseClient()
  const { data } = await supabase
    .from('campaigns')
    .select('id, brand_id, title, description, status, created_at, updated_at')
    .eq('brand_id', user.id)
    .order('created_at', { ascending: false })

  return (data ?? []) as Campaign[]
})

export const getCampaign = cache(async (id: string) => {
  const user = await getUser()
  if (!user) return null

  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('campaigns')
    .select('id, brand_id, title, description, status, created_at, updated_at')
    .eq('id', id)
    .eq('brand_id', user.id)
    .single<Campaign>()

  if (error && error.code !== 'PGRST116') {
    console.error('[getCampaign]', error.message)
  }

  return data ?? null
})
