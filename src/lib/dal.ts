import 'server-only'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/profile'
import type { Campaign } from '@/types/campaign'
import type { Discipline } from '@/types/discipline'

export type ActiveCampaign = {
  id: string
  brand_id: string
  brand_name: string | null
  title: string
  description: string
  disciplines: Discipline[] | null
  created_at: string
}

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
    .select('id, account_type, onboarding_completed, created_at, updated_at, first_name, last_name, brand_name, disciplines')
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
    .select('id, brand_id, title, description, status, disciplines, created_at, updated_at')
    .eq('brand_id', user.id)
    .order('created_at', { ascending: false })

  return (data ?? []) as Campaign[]
})

export const getActiveCampaigns = cache(async () => {
  const supabase = await getSupabaseClient()
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('id, brand_id, title, description, disciplines, created_at')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (!campaigns?.length) return [] as ActiveCampaign[]

  const brandIds = [...new Set(campaigns.map((c) => c.brand_id))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, brand_name')
    .in('id', brandIds)

  const brandMap = new Map((profiles ?? []).map((p) => [p.id, p.brand_name as string | null]))

  return campaigns.map((c) => ({
    ...c,
    disciplines: c.disciplines as Discipline[] | null,
    brand_name: brandMap.get(c.brand_id) ?? null,
  })) as ActiveCampaign[]
})

export const getActiveCampaign = cache(async (id: string) => {
  const supabase = await getSupabaseClient()
  const { data: campaign, error } = await supabase
    .from('campaigns')
    .select('id, brand_id, title, description, disciplines, created_at')
    .eq('id', id)
    .eq('status', 'active')
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('[getActiveCampaign]', error.message)
  }

  if (!campaign) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('brand_name')
    .eq('id', campaign.brand_id)
    .single()

  return {
    ...campaign,
    disciplines: campaign.disciplines as Discipline[] | null,
    brand_name: (profile?.brand_name as string | null) ?? null,
  } as ActiveCampaign
})

export const getCampaign = cache(async (id: string) => {
  const user = await getUser()
  if (!user) return null

  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('campaigns')
    .select('id, brand_id, title, description, status, disciplines, created_at, updated_at')
    .eq('id', id)
    .eq('brand_id', user.id)
    .single<Campaign>()

  if (error && error.code !== 'PGRST116') {
    console.error('[getCampaign]', error.message)
  }

  return data ?? null
})
