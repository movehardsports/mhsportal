import type { Sport } from './sport'
import type { CampaignType } from './campaign-type'
import type { Gender } from './gender'

export type Athlete = {
  id: string
  first_name: string
  last_name: string
  sports: Sport[]
  campaign_types: CampaignType[]
  gender: Gender
  birth_year: number
  location: string
  bio: string | null
  ig_account: string | null
  yt_account: string | null
  tt_account: string | null
  created_at: string
  updated_at: string
}
