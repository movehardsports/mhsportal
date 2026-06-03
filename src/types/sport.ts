
export const SPORT_IDS = [
  'triathlon',
  'crossfit',
  'calisthenics',
  'climbing_bouldering',
  'parkour_stunt',
  'ocr',
  'martial_arts',
  'mtb_downhill_bmx',
  'skateboard',
  'motorsports',
  'snowboard_ski',
  'water_sports',
] as const

export type Sport = (typeof SPORT_IDS)[number]

export const SPORTS: { id: Sport; label: string }[] = [
  { id: 'triathlon', label: 'Triathlon' },
  { id: 'crossfit', label: 'Crossfit' },
  { id: 'calisthenics', label: 'Calisthenics' },
  { id: 'climbing_bouldering', label: 'Climbing / Bouldering' },
  { id: 'parkour_stunt', label: 'Parkour / Stunt' },
  { id: 'ocr', label: 'OCR' },
  { id: 'martial_arts', label: 'Martial Arts' },
  { id: 'mtb_downhill_bmx', label: 'MTB / Downhill / BMX' },
  { id: 'skateboard', label: 'Skateboard' },
  { id: 'motorsports', label: 'Motorsports' },
  { id: 'snowboard_ski', label: 'Snowboard / Ski' },
  { id: 'water_sports', label: 'Water Sports' },
]
