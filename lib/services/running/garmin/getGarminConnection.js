import { toConnectionResponse } from './connectionStatus'

/**
 * Safe columns only. The table's column grants also block the encrypted key and token
 * from the session client, so a typo here cannot leak them.
 */
export async function getGarminConnection(supabase, userId) {
  const { data, error } = await supabase
    .from('rt_garmin_credentials')
    .select('key_last4, key_expires_at, status, last_error, last_synced_at')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return toConnectionResponse(data)
}
