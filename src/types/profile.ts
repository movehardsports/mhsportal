type BaseProfile = {
  id: string
  account_type: 'athlete' | 'brand'
  onboarding_completed: boolean
  created_at: string
  updated_at: string
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
}

export type Profile = AthleteProfile | BrandProfile
