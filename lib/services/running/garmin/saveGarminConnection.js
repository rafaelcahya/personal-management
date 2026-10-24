import { createAdminClient } from '@/lib/supabase/admin'
import { encrypt } from '@/lib/utils/running/encrypt'
import { DAY_MS, GARMIN_DEFAULT_SYNC_DAYS, GARMIN_MAX_SYNC_DAYS } from '@/lib/constants/garmin'
import { deriveGarminStatus, toConnectionResponse } from './connectionStatus'
import { exchangeApiKey } from './garminClient'

const SAFE_COLUMNS = 'key_last4, key_expires_at, status, last_error, last_synced_at'

function catchUpRange(lastSyncedAt) {
  const today = new Date().toISOString().slice(0, 10)
  const todayMs = new Date(`${today}T00:00:00Z`).getTime()
  const earliestMs = todayMs - GARMIN_MAX_SYNC_DAYS * DAY_MS
  const fromMs = lastSyncedAt
    ? Math.max(new Date(lastSyncedAt).getTime(), earliestMs)
    : todayMs - GARMIN_DEFAULT_SYNC_DAYS * DAY_MS
  return { from: new Date(fromMs).toISOString().slice(0, 10), to: today }
}

/**
 * Checks the key with Garmin, then stores it encrypted. Throws GarminError when Garmin
 * rejects the key (kind "rejected") or is down (kind "unavailable"); nothing is saved then.
 *
 * Returns { connection, catchUp }. catchUp is a { from, to } range when the user was
 * expired or invalid before, so the caller can start a sync for the days that were missed.
 */
export async function saveGarminConnection(userId, { api_key, expires_at }) {
  const exchanged = await exchangeApiKey(api_key)

  const admin = createAdminClient()
  const { data: previous, error: previousError } = await admin
    .from('rt_garmin_credentials')
    .select('status, key_expires_at, last_synced_at')
    .eq('user_id', userId)
    .maybeSingle()
  if (previousError) throw new Error(previousError.message)

  const { data, error } = await admin
    .from('rt_garmin_credentials')
    .upsert(
      {
        user_id: userId,
        api_key_encrypted: encrypt(api_key),
        key_last4: api_key.slice(-4),
        key_expires_at: `${expires_at}T00:00:00Z`,
        access_token_encrypted: encrypt(exchanged.token),
        token_expires_at: exchanged.expiresAt.toISOString(),
        status: 'connected',
        last_error: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select(SAFE_COLUMNS)
    .single()
  if (error) throw new Error(error.message)

  const previousStatus = deriveGarminStatus(previous)
  const wasBroken = previousStatus === 'expired' || previousStatus === 'invalid'

  return {
    connection: toConnectionResponse(data),
    catchUp: wasBroken ? catchUpRange(previous.last_synced_at) : null,
  }
}
