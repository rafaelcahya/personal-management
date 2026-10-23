// Fake Strava athlete id used only by seeded credential rows, so cleanup can never touch a real link.
export const SEED_ATHLETE_ID = 990000845
export const SEED_TAG = 'cypress-845-seed'

export async function seedStravaCredentialsInDb(supabase, userId, { needsReconnect }) {
  const { data: existing, error: lookupError } = await supabase
    .from('rt_strava_credentials')
    .select('user_id, athlete_id')
    .eq('user_id', userId)
    .maybeSingle()
  if (lookupError) throw new Error(`DB query failed: ${lookupError.message}`)
  if (existing && existing.athlete_id !== SEED_ATHLETE_ID) {
    throw new Error('Refusing to overwrite pre-existing real Strava credentials')
  }

  const { data, error } = await supabase
    .from('rt_strava_credentials')
    .upsert(
      {
        user_id: userId,
        athlete_id: SEED_ATHLETE_ID,
        access_token: 'cypress-fake-access',
        refresh_token: 'cypress-fake-refresh',
        expires_at: new Date(Date.now() - 3600 * 1000).toISOString(),
        scope: 'read',
        needs_reconnect: needsReconnect,
      },
      { onConflict: 'user_id' }
    )
    .select('user_id, athlete_id, needs_reconnect')
    .single()
  if (error) throw new Error(`DB query failed: ${error.message}`)
  return data
}

export async function deleteSeededStravaCredentialsInDb(supabase, userId) {
  const { data, error } = await supabase
    .from('rt_strava_credentials')
    .delete()
    .eq('user_id', userId)
    .eq('athlete_id', SEED_ATHLETE_ID)
    .select('user_id')
  if (error) throw new Error(`DB query failed: ${error.message}`)
  return { deleted: data?.length ?? 0 }
}

export async function getStravaCredentialsFromDb(supabase, userId) {
  const { data, error } = await supabase
    .from('rt_strava_credentials')
    .select('user_id, athlete_id, needs_reconnect, last_sync_at')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw new Error(`DB query failed: ${error.message}`)
  return data ?? null
}

export async function getHealthLogFromDb(supabase, kind, id) {
  const table = kind === 'weight' ? 'rt_weight_logs' : 'rt_subjective_health_logs'
  const { data, error } = await supabase
    .from(table)
    .select('id, user_id, notes')
    .eq('id', id)
    .maybeSingle()
  if (error) throw new Error(`DB query failed: ${error.message}`)
  return data ?? null
}

// Only rows carrying the seed tag are removed, whichever user owns them.
export async function deleteSeededHealthLogsInDb(supabase) {
  const results = {}
  for (const table of ['rt_subjective_health_logs', 'rt_weight_logs']) {
    const { data, error } = await supabase.from(table).delete().eq('notes', SEED_TAG).select('id')
    if (error) throw new Error(`DB query failed: ${error.message}`)
    results[table] = data?.length ?? 0
  }
  return results
}
