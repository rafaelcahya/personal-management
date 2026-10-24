import { GARMIN_MATCH_DISTANCE_TOLERANCE, GARMIN_MATCH_WINDOW_SEC } from '@/lib/constants/garmin'

/** Garmin writes UTC times without a zone: "2026-10-23 10:49:38" (list) or "2026-10-17T22:27:43.0" (detail). */
export function parseGarminTime(value) {
  if (!value) return NaN
  const iso = String(value).trim().replace(' ', 'T')
  return new Date(/[zZ]|[+-]\d{2}:?\d{2}$/.test(iso) ? iso : `${iso}Z`).getTime()
}

export function isWithinMatchWindow(a, b) {
  if (!Number.isFinite(a.startMs) || !Number.isFinite(b.startMs)) return false
  if (Math.abs(a.startMs - b.startMs) > GARMIN_MATCH_WINDOW_SEC * 1000) return false
  const larger = Math.max(a.distanceM, b.distanceM)
  if (larger === 0) return true
  return Math.abs(a.distanceM - b.distanceM) <= larger * GARMIN_MATCH_DISTANCE_TOLERANCE
}

/**
 * target and candidates are { startMs, distanceM }. The closest start time wins when
 * more than one candidate is inside the window. Returns null when nothing matches.
 */
export function pickBestMatch(target, candidates) {
  let best = null
  let bestGap = Infinity
  for (const candidate of candidates) {
    if (!isWithinMatchWindow(target, candidate)) continue
    const gap = Math.abs(target.startMs - candidate.startMs)
    if (gap < bestGap) {
      best = candidate
      bestGap = gap
    }
  }
  return best
}

export function garminListItemToCandidate(item) {
  return {
    activityId: item.activityId,
    startMs: parseGarminTime(item.startTimeGMT),
    distanceM: Number(item.distance) || 0,
    typeKey: item.activityType?.typeKey ?? null,
  }
}
