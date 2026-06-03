import type { Sport } from './sport'
import type { CampaignType } from './campaign-type'

export type Brand = {
  id: string
  brand_name: string
  location: string
  sports: Sport[]
  campaign_types: CampaignType[]
  avatar_url: string | null
  bio: string | null
  ig_account: string | null
  yt_account: string | null
  tt_account: string | null
  contact_email: string
  web: string | null
  created_at: string
  updated_at: string
}
