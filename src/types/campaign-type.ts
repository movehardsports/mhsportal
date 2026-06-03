export const CAMPAIGN_TYPE_IDS = [
  'social_media_content',
  'ambassador',
  'events_competition',
  'product_review',
  'sponsorship',
  'advertising_film',
  'workshops',
] as const

export type CampaignType = (typeof CAMPAIGN_TYPE_IDS)[number]

export const CAMPAIGN_TYPES: { id: CampaignType; label: string }[] = [
  { id: 'social_media_content', label: 'Social Media Content' },
  { id: 'ambassador', label: 'Ambassador' },
  { id: 'events_competition', label: 'Events / Competition' },
  { id: 'product_review', label: 'Product Review' },
  { id: 'sponsorship', label: 'Sponsorship' },
  { id: 'advertising_film', label: 'Advertising / Film' },
  { id: 'workshops', label: 'Workshops' },
]
