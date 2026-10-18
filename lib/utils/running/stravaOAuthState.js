import { randomBytes, timingSafeEqual } from 'crypto'

export const STRAVA_STATE_COOKIE = 'strava_oauth_state'
export const STRAVA_STATE_MAX_AGE_SEC = 10 * 60
const STATE_BYTES = 32
// Scoped to the Strava auth routes so the cookie is not sent with every request.
const COOKIE_PATH = '/api/running/v1/auth/strava'

export function generateOAuthState() {
  return randomBytes(STATE_BYTES).toString('hex')
}

export function stateCookieOptions(maxAge = STRAVA_STATE_MAX_AGE_SEC) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: COOKIE_PATH,
    maxAge,
  }
}

export function isValidOAuthState(expected, received) {
  if (!expected || !received) return false
  const a = Buffer.from(expected)
  const b = Buffer.from(received)
  return a.length === b.length && timingSafeEqual(a, b)
}
