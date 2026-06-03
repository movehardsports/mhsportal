import type { Discipline } from './discipline'

type BaseProfile = {
  id: string
  account_type: 'athlete' | 'brand'
  onboarding_completed: boolean
  created_at: string
  updated_at: string
  disciplines: Discipline[] | null
  bio: string | null
  location: string | null
}

export type AthleteProfile = BaseProfile & {
  account_type: 'athlete'
  first_name: string
  last_name: string
  brand_name: null
}

export type BrandProfile = BaseProfile & {
  account_type: 'brand'
  brand_name: string
  first_name: null
  last_name: null
  website: string | null
  contact_email: string | null
}

export type Profile = AthleteProfile | BrandProfile
