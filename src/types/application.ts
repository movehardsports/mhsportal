import type { Discipline } from './discipline'

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected'

export type CampaignApplication = {
  id: string
  campaign_id: string
  athlete_id: string
  status: ApplicationStatus
  message: string | null
  created_at: string
}

export type ApplicationWithAthlete = CampaignApplication & {
  first_name: string
  last_name: string
  disciplines: Discipline[] | null
  message: string | null
}
