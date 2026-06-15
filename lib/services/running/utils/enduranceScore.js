export const ENDURANCE_TIER_BANDS = [
  { y1: 0, y2: 20, label: 'Beginner', fill: '#fca5a5', opacity: 0.12 },
  { y1: 20, y2: 40, label: 'Building', fill: '#fdba74', opacity: 0.1 },
  { y1: 40, y2: 60, label: 'Developing', fill: '#fde047', opacity: 0.1 },
  { y1: 60, y2: 80, label: 'Solid', fill: '#93c5fd', opacity: 0.12 },
  { y1: 80, y2: 100, label: 'Advanced', fill: '#6ee7b7', opacity: 0.15 },
]

export function getEnduranceTier(score) {
  if (score == null) return null
  if (score <= 20) return 'Beginner'
  if (score <= 40) return 'Building'
  if (score <= 60) return 'Developing'
  if (score <= 80) return 'Solid'
  return 'Advanced'
}

export function computeEnduranceScore({ vo2max, chronicLoad, bestLongRunKm }) {
  const vo2max_score = Math.min(100, Math.max(0, ((vo2max - 25) / (60 - 25)) * 100))
  const load_score = Math.min(100, Math.max(0, (chronicLoad / 80) * 100))
  const long_run_score = Math.min(100, Math.max(0, (bestLongRunKm / 42.2) * 100))
  return Math.round(vo2max_score * 0.4 + load_score * 0.3 + long_run_score * 0.3)
}
