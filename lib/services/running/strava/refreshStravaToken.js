import { createAdminClient } from '@/lib/supabase/admin'
import { decrypt, encrypt } from '@/lib/utils/running/encrypt'

const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token'
const TOKEN_EXPIRY_BUFFER_SEC = 300

/**
 * Refreshes a Strava access token if expired.
 *
 * Returns one of:
 *   { skipped: true }         — needs_reconnect was already true; caller should exit cleanly
 *   { needsReconnect: true }  — 401 received; flag set in DB; caller should exit cleanly
 *   { accessToken: string }   — valid token ready for API calls
 *
 * Throws on 5xx / network error so Inngest retries normally.
 *
 * @param {string} userId
 * @param {{ access_token: string, refresh_token: string, expires_at: string, needs_reconnect: boolean }} credentials
 */
export async function refreshStravaToken(userId, credentials) {
  if (credentials.needs_reconnect) {
    return { skipped: true }
  }

  const fiveMinFromNow = Date.now() / 1000 + TOKEN_EXPIRY_BUFFER_SEC
  if (new Date(credentials.expires_at).getTime() / 1000 > fiveMinFromNow) {
    return { accessToken: decrypt(credentials.access_token) }
  }

  const res = await fetch(STRAVA_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: decrypt(credentials.refresh_token),
    }),
  })

  if (res.status === 401) {
    const supabase = createAdminClient()
    const { error: updateError } = await supabase
      .from('rt_strava_credentials')
      .update({ needs_reconnect: true })
      .eq('user_id', userId)

    if (updateError) throw new Error(`Failed to set needs_reconnect: ${updateError.message}`)

    console.error(`[refreshStravaToken] 401 for user ${userId} — marked needs_reconnect`)
    return { needsReconnect: true }
  }

  if (!res.ok) {
    throw new Error(`Token refresh failed with status ${res.status}`)
  }

  const { access_token, refresh_token, expires_at } = await res.json()

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('rt_strava_credentials')
    .update({
      access_token: encrypt(access_token),
      refresh_token: encrypt(refresh_token),
      expires_at: new Date(expires_at * 1000).toISOString(),
    })
    .eq('user_id', userId)

  if (error) throw new Error(`Failed to save refreshed token: ${error.message}`)

  return { accessToken: access_token }
}
