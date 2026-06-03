export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'withdrawn'

export type CampaignApplication = {
  id: string
  campaign_id: string
  brand_id: string
  athlete_id: string
  status: ApplicationStatus
  message: string | null
  created_at: string
  updated_at: string
}
