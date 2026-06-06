import { archiveStaleSymptoms } from './archiveStaleSymptoms'

/**
 * Returns active symptom logs for a user (archives stale entries first).
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 */
export async function getActiveSymptomLogs(supabase, userId) {
  await archiveStaleSymptoms(supabase, userId)

  const { data, error } = await supabase
    .from('rt_symptom_logs')
    .select('id, body_region, pain_level, pain_type, occurs_when, notes, logged_at')
    .eq('user_id', userId)
    .is('archived_at', null)
    .order('logged_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

/**
 * Creates a new symptom log entry for a user.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {{ body_region: string, pain_level: number, pain_type?: string, occurs_when?: string, notes?: string }} payload
 */
export async function createSymptomLog(supabase, userId, payload) {
  const { data, error } = await supabase
    .from('rt_symptom_logs')
    .insert({ ...payload, user_id: userId })
    .select('id, body_region, pain_level, pain_type, occurs_when, notes, logged_at')
    .single()

  if (error) throw new Error(error.message)
  return data
}
