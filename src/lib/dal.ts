import 'server-only'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/profile'
import type { Campaign } from '@/types/campaign'
import type { Discipline } from '@/types/discipline'
import type { CampaignType } from '@/types/campaign-type'
import type { ApplicationWithAthlete } from '@/types/application'

export type ActiveCampaign = {
  id: string
  brand_id: string
  brand_name: string | null
  title: string
  description: string
  disciplines: Discipline[] | null
  campaign_type: CampaignType | null
  budget: string | null
  deadline: string | null
  location: string | null
  created_at: string
  application_count: number
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
    .select('id, account_type, onboarding_completed, created_at, updated_at, first_name, last_name, brand_name, disciplines, bio, location, website, contact_email')
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
    .select('id, brand_id, title, description, status, disciplines, campaign_type, budget, deadline, location, created_at, updated_at')
    .eq('brand_id', user.id)
    .order('created_at', { ascending: false })

  return (data ?? []) as Campaign[]
})

const LOAD_LIMIT = 10

export const getActiveCampaigns = cache(async (filterDisciplines?: Discipline[], offset = 0) => {
  const supabase = await getSupabaseClient()

  let query = supabase
    .from('campaigns')
    .select('id, brand_id, title, description, disciplines, campaign_type, budget, deadline, location, created_at')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (filterDisciplines && filterDisciplines.length > 0) {
    query = query.overlaps('disciplines', filterDisciplines)
  }

  const { data: raw } = await query.range(offset, offset + LOAD_LIMIT)

  const hasMore = (raw?.length ?? 0) > LOAD_LIMIT
  const campaigns = (raw ?? []).slice(0, LOAD_LIMIT)

  if (!campaigns.length) return { data: [] as ActiveCampaign[], hasMore: false }

  const campaignIds = campaigns.map((c) => c.id)
  const brandIds = [...new Set(campaigns.map((c) => c.brand_id))]

  const [{ data: profiles }, { data: counts }] = await Promise.all([
    supabase.from('profiles').select('id, brand_name').in('id', brandIds),
    supabase.from('campaign_application_counts').select('campaign_id, count').in('campaign_id', campaignIds),
  ])

  const brandMap = new Map((profiles ?? []).map((p) => [p.id, p.brand_name as string | null]))
  const countMap = new Map((counts ?? []).map((c) => [c.campaign_id as string, Number(c.count)]))

  return {
    data: campaigns.map((c) => ({
      ...c,
      disciplines: c.disciplines as Discipline[] | null,
      campaign_type: (c.campaign_type as CampaignType | null) ?? null,
      brand_name: brandMap.get(c.brand_id) ?? null,
      application_count: countMap.get(c.id) ?? 0,
    })) as ActiveCampaign[],
    hasMore,
  }
})

export const getActiveCampaign = cache(async (id: string) => {
  const supabase = await getSupabaseClient()
  const { data: campaign, error } = await supabase
    .from('campaigns')
    .select('id, brand_id, title, description, disciplines, campaign_type, budget, deadline, location, created_at')
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
    campaign_type: (campaign.campaign_type as CampaignType | null) ?? null,
    brand_name: (profile?.brand_name as string | null) ?? null,
  } as ActiveCampaign
})

export type AthleteApplication = {
  id: string
  status: string
  message: string | null
  created_at: string
  campaign_id: string
  campaign_title: string
  brand_name: string | null
}

export const getAthleteApplications = cache(async () => {
  const user = await getUser()
  if (!user) return []

  const supabase = await getSupabaseClient()
  const { data: applications } = await supabase
    .from('campaign_applications')
    .select('id, campaign_id, status, message, created_at')
    .eq('athlete_id', user.id)
    .order('created_at', { ascending: false })

  if (!applications?.length) return [] as AthleteApplication[]

  const campaignIds = applications.map((a) => a.campaign_id)
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('id, brand_id, title')
    .in('id', campaignIds)

  if (!campaigns?.length) return [] as AthleteApplication[]

  const brandIds = [...new Set(campaigns.map((c) => c.brand_id))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, brand_name')
    .in('id', brandIds)

  const campaignMap = new Map(campaigns.map((c) => [c.id, c]))
  const brandMap = new Map((profiles ?? []).map((p) => [p.id, p.brand_name as string | null]))

  return applications.map((app) => {
    const campaign = campaignMap.get(app.campaign_id)
    return {
      id: app.id,
      status: app.status,
      message: app.message as string | null,
      created_at: app.created_at,
      campaign_id: app.campaign_id,
      campaign_title: campaign?.title ?? '',
      brand_name: campaign ? (brandMap.get(campaign.brand_id) ?? null) : null,
    }
  }) as AthleteApplication[]
})

export const getApplicationStatus = cache(async (campaignId: string) => {
  const user = await getUser()
  if (!user) return null

  const supabase = await getSupabaseClient()
  const { data } = await supabase
    .from('campaign_applications')
    .select('id, status')
    .eq('campaign_id', campaignId)
    .eq('athlete_id', user.id)
    .single()

  return data ?? null
})

export const getCampaignApplications = cache(async (campaignId: string) => {
  const user = await getUser()
  if (!user) return []

  const supabase = await getSupabaseClient()
  const { data: applications } = await supabase
    .from('campaign_applications')
    .select('id, campaign_id, athlete_id, status, message, created_at')
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: false })

  if (!applications?.length) return [] as ApplicationWithAthlete[]

  const athleteIds = applications.map((a) => a.athlete_id)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, disciplines')
    .in('id', athleteIds)

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]))

  return applications.map((app) => {
    const profile = profileMap.get(app.athlete_id)
    return {
      ...app,
      first_name: profile?.first_name ?? '',
      last_name: profile?.last_name ?? '',
      disciplines: (profile?.disciplines as Discipline[] | null) ?? null,
      message: app.message as string | null,
    }
  }) as ApplicationWithAthlete[]
})

export const getCampaign = cache(async (id: string) => {
  const user = await getUser()
  if (!user) return null

  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('campaigns')
    .select('id, brand_id, title, description, status, disciplines, campaign_type, budget, deadline, location, created_at, updated_at')
    .eq('id', id)
    .eq('brand_id', user.id)
    .single<Campaign>()

  if (error && error.code !== 'PGRST116') {
    console.error('[getCampaign]', error.message)
  }

  return data ?? null
})

export type PublicAthlete = {
  id: string
  first_name: string
  last_name: string
  disciplines: Discipline[] | null
  bio: string | null
  location: string | null
  created_at: string
}

export const getPublicAthletes = cache(async (filterDisciplines?: Discipline[], offset = 0) => {
  const supabase = await getSupabaseClient()

  let query = supabase
    .from('profiles')
    .select('id, first_name, last_name, disciplines, bio, location, created_at')
    .eq('account_type', 'athlete')
    .eq('onboarding_completed', true)
    .order('created_at', { ascending: false })

  if (filterDisciplines && filterDisciplines.length > 0) {
    query = query.overlaps('disciplines', filterDisciplines)
  }

  const { data: raw } = await query.range(offset, offset + LOAD_LIMIT)
  const hasMore = (raw?.length ?? 0) > LOAD_LIMIT
  return { data: ((raw ?? []).slice(0, LOAD_LIMIT)) as PublicAthlete[], hasMore }
})

export type PublicBrand = {
  id: string
  brand_name: string
  disciplines: Discipline[] | null
  bio: string | null
  location: string | null
  website: string | null
  contact_email: string | null
  created_at: string
}

export const getPublicBrands = cache(async (filterDisciplines?: Discipline[], offset = 0) => {
  const supabase = await getSupabaseClient()

  let query = supabase
    .from('profiles')
    .select('id, brand_name, disciplines, bio, location, website, contact_email, created_at')
    .eq('account_type', 'brand')
    .eq('onboarding_completed', true)
    .order('created_at', { ascending: false })

  if (filterDisciplines && filterDisciplines.length > 0) {
    query = query.overlaps('disciplines', filterDisciplines)
  }

  const { data: raw } = await query.range(offset, offset + LOAD_LIMIT)
  const hasMore = (raw?.length ?? 0) > LOAD_LIMIT
  return { data: ((raw ?? []).slice(0, LOAD_LIMIT)) as PublicBrand[], hasMore }
})

export const getPublicAthlete = cache(async (id: string) => {
  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, disciplines, bio, location, created_at')
    .eq('id', id)
    .eq('account_type', 'athlete')
    .eq('onboarding_completed', true)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('[getPublicAthlete]', error.message)
  }

  return data ? (data as PublicAthlete) : null
})

export const getPublicBrand = cache(async (id: string) => {
  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, brand_name, disciplines, bio, location, website, contact_email, created_at')
    .eq('id', id)
    .eq('account_type', 'brand')
    .eq('onboarding_completed', true)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('[getPublicBrand]', error.message)
  }

  return data ? (data as PublicBrand) : null
})
