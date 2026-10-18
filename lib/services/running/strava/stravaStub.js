let warned = false

/**
 * When STRAVA_API_STUB=true (never in production), the Strava routes skip their own outbound
 * calls to strava.com so tests do not reach the real API. Inngest jobs are NOT stubbed: they can
 * still call Strava if an event is sent, which is why the stubbed routes also skip inngest.send.
 */
export function isStravaStubbed() {
  const active = process.env.NODE_ENV !== 'production' && process.env.STRAVA_API_STUB === 'true'
  if (active && !warned) {
    warned = true
    console.warn('[strava] STRAVA_API_STUB is active: Strava calls are skipped')
  }
  return active
}
