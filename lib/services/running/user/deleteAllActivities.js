/**
 * Deletes every activity of the user and clears the Strava sync cursor, so the next sync
 * re-imports history instead of only fetching activities newer than the deleted ones.
 * Returns the number of deleted activities.
 */
export async function deleteAllActivities(supabase, userId) {
  const { data, error } = await supabase
    .from('rt_activities')
    .delete()
    .eq('user_id', userId)
    .select('id')

  if (error) throw new Error(error.message)

  const { error: resetError } = await supabase
    .from('rt_strava_credentials')
    .update({ last_sync_at: null })
    .eq('user_id', userId)

  if (resetError) throw new Error(resetError.message)

  return data?.length ?? 0
}
