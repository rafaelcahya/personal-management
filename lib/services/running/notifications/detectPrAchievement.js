// Strava marks a best effort with pr_rank = 1 when the activity sets a new all-time
// personal record for that distance. One activity can PR several distances at once
// (e.g. a fast 10K also produces 5K/1K PRs) — those aggregate into one notification.

function formatDuration(totalSec) {
  const sec = Math.round(totalSec ?? 0)
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const pad = (n) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

/**
 * Extracts the PR'd efforts (pr_rank === 1) from a Strava DetailedActivity's
 * best_efforts array, ordered by distance ascending.
 * @param {Array<{name?: string, distance?: number, elapsed_time?: number, pr_rank?: number}>} bestEfforts
 * @returns {Array<{ name: string, distance_m: number, elapsed_time_sec: number }>}
 */
export function getPrEfforts(bestEfforts) {
  if (!Array.isArray(bestEfforts)) return []
  return bestEfforts
    .filter((e) => e?.pr_rank === 1 && e?.name)
    .map((e) => ({
      name: e.name,
      distance_m: e.distance ?? 0,
      elapsed_time_sec: e.elapsed_time ?? 0,
    }))
    .sort((a, b) => a.distance_m - b.distance_m)
}

/**
 * Builds a single aggregated `pr_achieved` notification payload for an activity,
 * or null when the activity set no new PR.
 * @param {Array} bestEfforts - Strava DetailedActivity.best_efforts
 * @param {string} activityId
 * @returns {{ title: string, message: string, data: object } | null}
 */
export function buildPrAchievement(bestEfforts, activityId) {
  const prs = getPrEfforts(bestEfforts)
  if (prs.length === 0) return null

  const url = `/main/running/activities/${activityId}`
  const distances = prs.map((p) => ({ name: p.name, elapsed_time_sec: p.elapsed_time_sec }))

  if (prs.length === 1) {
    const [pr] = prs
    return {
      title: `New ${pr.name} PR!`,
      message: `You set a new personal best for ${pr.name}: ${formatDuration(pr.elapsed_time_sec)}. Tap to view.`,
      data: { activity_id: activityId, url, distances },
    }
  }

  const list = prs.map((p) => `${p.name} (${formatDuration(p.elapsed_time_sec)})`).join(', ')
  return {
    title: `${prs.length} new personal records!`,
    message: `You just PR'd ${list}. Tap to view.`,
    data: { activity_id: activityId, url, distances },
  }
}
