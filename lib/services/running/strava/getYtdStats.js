import { createAdminClient } from '@/lib/supabase/admin'
import { decrypt, encrypt } from '@/lib/utils/running/encrypt'

const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token'
const STRAVA_STATS_URL = 'https://www.strava.com/api/v3/athletes'
const TOKEN_EXPIRY_BUFFER_SEC = 300
const YTD_CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

async function getValidAccessToken(credentials, admin, userId) {
  const expiresAt = new Date(credentials.expires_at).getTime() / 1000
  if (expiresAt > Date.now() / 1000 + TOKEN_EXPIRY_BUFFER_SEC) {
    return decrypt(credentials.access_token)
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

  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`)

  const { access_token, refresh_token, expires_at } = await res.json()

  await admin
    .from('rt_strava_credentials')
    .update({
      access_token: encrypt(access_token),
      refresh_token: encrypt(refresh_token),
      expires_at: new Date(expires_at * 1000).toISOString(),
    })
    .eq('user_id', userId)

  return access_token
}

export async function getYtdStats(userId) {
  const admin = createAdminClient()

  const { data: creds, error } = await admin
    .from('rt_strava_credentials')
    .select(
      'athlete_id, access_token, refresh_token, expires_at, ytd_stats, ytd_stats_refreshed_at'
    )
    .eq('user_id', userId)
    .single()

  if (error || !creds) return null

  const cacheAge = creds.ytd_stats_refreshed_at
    ? Date.now() - new Date(creds.ytd_stats_refreshed_at).getTime()
    : Infinity

  if (creds.ytd_stats && cacheAge < YTD_CACHE_TTL_MS) {
    return creds.ytd_stats
  }

  try {
    const accessToken = await getValidAccessToken(creds, admin, userId)
    const res = await fetch(`${STRAVA_STATS_URL}/${creds.athlete_id}/stats`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!res.ok) return creds.ytd_stats ?? null

    const stats = await res.json()
    const ytd = {
      count: stats.ytd_run_totals?.count ?? 0,
      distance_m: stats.ytd_run_totals?.distance ?? 0,
      moving_time_sec: stats.ytd_run_totals?.moving_time ?? 0,
      elevation_gain_m: stats.ytd_run_totals?.elevation_gain ?? 0,
      achievement_count: stats.ytd_run_totals?.achievement_count ?? 0,
    }

    await admin
      .from('rt_strava_credentials')
      .update({ ytd_stats: ytd, ytd_stats_refreshed_at: new Date().toISOString() })
      .eq('user_id', userId)

    return ytd
  } catch {
    return creds.ytd_stats ?? null
  }
}
