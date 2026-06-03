import type { Sport } from './sport'
import type { CampaignType } from './campaign-type'
import type { Gender } from './gender'

export type CampaignStatus = 'draft' | 'active' | 'completed' | 'cancelled'

export type Campaign = {
  id: string
  brand_id: string
  title: string
  description: string
  campaign_types: CampaignType[]
  sports: Sport[]
  location: string
  start_date: string
  end_date: string | null
  budget: number
  athlete_gender: Gender | null
  status: CampaignStatus
  created_at: string
  updated_at: string
}
