export const DISCIPLINE_IDS = ['crossfit', 'triathlon', 'motorsports'] as const

export type Discipline = (typeof DISCIPLINE_IDS)[number]

export const DISCIPLINES: { id: Discipline; label: string }[] = [
  { id: 'crossfit', label: 'Crossfit' },
  { id: 'triathlon', label: 'Triathlon' },
  { id: 'motorsports', label: 'Motorsports' },
]
