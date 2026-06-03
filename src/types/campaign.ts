import type { Discipline } from './discipline'
import type { CampaignType } from './campaign-type'

export type CampaignStatus = 'preview' | 'active' | 'closed' | 'archived'

export type Campaign = {
  id: string
  brand_id: string
  title: string
  description: string
  status: CampaignStatus
  disciplines: Discipline[] | null
  campaign_type: CampaignType | null
  budget: string | null
  deadline: string | null
  location: string | null
  created_at: string
  updated_at: string
}
