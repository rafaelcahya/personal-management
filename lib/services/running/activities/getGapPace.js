export function computeGapSecPerKm(paceSecPerKm, elevationGainM, distanceM) {
  if (!paceSecPerKm || !distanceM) return null
  const gradePct = elevationGainM ? (elevationGainM / distanceM) * 100 : 0
  const clampedGradePct = Math.min(20, Math.max(-20, gradePct))
  const gapFactor = 1 + clampedGradePct * 0.033
  return Math.round(paceSecPerKm / gapFactor)
}
