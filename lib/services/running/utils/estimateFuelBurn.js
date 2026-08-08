const FUEL_ZONES = [
  { maxPct: 0.6, carbRatio: 0.4 },
  { maxPct: 0.7, carbRatio: 0.55 },
  { maxPct: 0.8, carbRatio: 0.7 },
  { maxPct: 0.9, carbRatio: 0.85 },
  { maxPct: Infinity, carbRatio: 0.95 },
]

function getCarbRatio(avgHr, maxHr) {
  const pct = Math.min(avgHr / maxHr, 1.0)

  for (const zone of FUEL_ZONES) {
    if (pct <= zone.maxPct) return zone.carbRatio
  }
  return 0.95
}

/**
 * Estimates glucose and fat burned based on HR intensity.
 * Returns null if required inputs are missing or invalid.
 *
 * @param {{ calories: number, avgHr: number, maxHr: number }} params
 * @returns {{ glucose_burned_g: number, fat_burned_g: number, fuel_mode: string } | null}
 */
export function estimateFuelBurn({ calories, avgHr, maxHr }) {
  if (!calories || !avgHr || !maxHr || maxHr <= 0 || avgHr <= 0 || avgHr > maxHr) {
    return null
  }

  const carbRatio = getCarbRatio(avgHr, maxHr)
  const carbKcal = calories * carbRatio
  const fatKcal = calories * (1 - carbRatio)

  return {
    glucose_burned_g: Math.round(carbKcal / 4),
    fat_burned_g: Math.round(fatKcal / 9),
    fuel_mode: 'avg_hr',
  }
}
