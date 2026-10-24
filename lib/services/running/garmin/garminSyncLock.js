import { createAdminClient } from '@/lib/supabase/admin'

// A crashed job can never release the lock, so it counts as free after this long.
const LOCK_TTL_MS = 15 * 60 * 1000

/** Returns true when this caller now holds the lock for the user. */
export async function acquireGarminSyncLock(userId) {
  const admin = createAdminClient()
  const staleBefore = new Date(Date.now() - LOCK_TTL_MS).toISOString()
  const { data, error } = await admin
    .from('rt_garmin_credentials')
    .update({ sync_started_at: new Date().toISOString() })
    .eq('user_id', userId)
    .or(`sync_started_at.is.null,sync_started_at.lt.${staleBefore}`)
    .select('user_id')
  if (error) throw new Error(`Failed to acquire Garmin sync lock: ${error.message}`)
  return (data?.length ?? 0) > 0
}

export async function releaseGarminSyncLock(userId) {
  const admin = createAdminClient()
  const { error } = await admin
    .from('rt_garmin_credentials')
    .update({ sync_started_at: null })
    .eq('user_id', userId)
  if (error) console.error('[garminSyncLock] release failed', error.message)
}
