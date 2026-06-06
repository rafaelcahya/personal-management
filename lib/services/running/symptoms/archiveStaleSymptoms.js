const STALE_DAYS = 30

/**
 * Archives symptom logs older than 30 days that are still marked active.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @returns {Promise<number>} count of archived rows
 */
export async function archiveStaleSymptoms(supabase, userId) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - STALE_DAYS)

  const { data, error } = await supabase
    .from('rt_symptom_logs')
    .update({ archived_at: new Date().toISOString() })
    .eq('user_id', userId)
    .is('archived_at', null)
    .lt('logged_at', cutoff.toISOString())
    .select('id')

  if (error) throw new Error(error.message)
  return data?.length ?? 0
}
