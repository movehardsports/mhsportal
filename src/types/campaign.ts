import type { Discipline } from './discipline'

export type CampaignStatus = 'draft' | 'active' | 'closed' | 'archived'

export type Campaign = {
  id: string
  brand_id: string
  title: string
  description: string
  status: CampaignStatus
  disciplines: Discipline[] | null
  created_at: string
  updated_at: string
}
