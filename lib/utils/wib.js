// The app's day, week, and month follow Western Indonesia Time (UTC+7, no daylight saving).
// Scheduled jobs use the cron prefix `TZ=Asia/Jakarta`; these helpers do the same for dates.
export const WIB_TIMEZONE = 'Asia/Jakarta'
export const WIB_OFFSET_MS = 7 * 60 * 60 * 1000

const DAY_MS = 24 * 60 * 60 * 1000

/** Today's date in WIB as YYYY-MM-DD. */
export function wibDate(now = new Date()) {
  return new Date(now.getTime() + WIB_OFFSET_MS).toISOString().slice(0, 10)
}

/** ISO instant `days` before now (rolling window). */
export function daysAgoIso(days, now = new Date()) {
  return new Date(now.getTime() - days * DAY_MS).toISOString()
}

/** Whole days from today (WIB) to a YYYY-MM-DD date; 0 for today, never negative. */
export function wibDaysUntil(dateStr, now = new Date()) {
  const target = Date.parse(`${dateStr.slice(0, 10)}T00:00:00Z`)
  const today = Date.parse(`${wibDate(now)}T00:00:00Z`)
  return Math.max(0, Math.round((target - today) / DAY_MS))
}

/** Monday (WIB) of the week containing `now`, as YYYY-MM-DD. Weeks run Monday to Sunday. */
export function wibWeekStart(now = new Date()) {
  const shifted = new Date(now.getTime() + WIB_OFFSET_MS)
  const daysSinceMonday = (shifted.getUTCDay() + 6) % 7
  return new Date(shifted.getTime() - daysSinceMonday * DAY_MS).toISOString().slice(0, 10)
}

/** ISO instant of 00:00 WIB today. */
export function wibStartOfDayIso(now = new Date()) {
  return new Date(Date.parse(`${wibDate(now)}T00:00:00Z`) - WIB_OFFSET_MS).toISOString()
}
