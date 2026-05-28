'use server'

import { getActiveCampaigns, getPublicAthletes, getPublicBrands } from '@/lib/dal'
import type { Discipline } from '@/types/discipline'

export async function fetchMoreCampaigns(disciplines: Discipline[], offset: number) {
  return getActiveCampaigns(disciplines.length > 0 ? disciplines : undefined, offset)
}

export async function fetchMoreAthletes(disciplines: Discipline[], offset: number) {
  return getPublicAthletes(disciplines.length > 0 ? disciplines : undefined, offset)
}

export async function fetchMoreBrands(disciplines: Discipline[], offset: number) {
  return getPublicBrands(disciplines.length > 0 ? disciplines : undefined, offset)
}
