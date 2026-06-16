export const HILL_TIERS = [
  { max: 5, label: 'Flat', color: '#94a3b8' },
  { max: 15, label: 'Rolling', color: '#3b82f6' },
  { max: 30, label: 'Hilly', color: '#22c55e' },
  { max: Infinity, label: 'Mountainous', color: '#8b5cf6' },
]

export function computeHillScore(elevationGainM, distanceM) {
  if (!elevationGainM || !distanceM) return null
  return Math.round((elevationGainM / (distanceM / 1000)) * 10) / 10
}

export function getHillTier(hillScore) {
  const score = hillScore ?? 0
  return HILL_TIERS.find((tier) => score < tier.max) ?? HILL_TIERS[HILL_TIERS.length - 1]
}
