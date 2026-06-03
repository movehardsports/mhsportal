import { SPORTS } from '@/types/sport'
import { CAMPAIGN_TYPES } from '@/types/campaign-type'
import type { Sport } from '@/types/sport'
import type { CampaignType } from '@/types/campaign-type'

export const sportLabel = (id: Sport) => SPORTS.find((s) => s.id === id)?.label ?? id
export const campaignTypeLabel = (id: CampaignType) => CAMPAIGN_TYPES.find((c) => c.id === id)?.label ?? id
export const budgetLabel = (budget: number | 'negotiable') =>
  budget === 'negotiable' ? 'Negotiable' : `${String(budget).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} PLN`
