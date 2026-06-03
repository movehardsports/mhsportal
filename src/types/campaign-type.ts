export const CAMPAIGN_TYPE_IDS = [
  'social_media',
  'ambassador',
  'event',
  'product_review',
  'sponsorship',
  'advertising',
  'workshop',
] as const

export type CampaignType = (typeof CAMPAIGN_TYPE_IDS)[number]

export const CAMPAIGN_TYPES: { id: CampaignType; label: string }[] = [
  { id: 'social_media', label: 'Social Media Content' },
  { id: 'ambassador', label: 'Ambassador' },
  { id: 'event', label: 'Event' },
  { id: 'product_review', label: 'Product Review' },
  { id: 'sponsorship', label: 'Sponsorship' },
  { id: 'advertising', label: 'Advertising / Film' },
  { id: 'workshop', label: 'Workshop' },
]
