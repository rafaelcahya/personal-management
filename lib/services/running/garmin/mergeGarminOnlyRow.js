/**
 * Folds a Garmin-only run into the Strava run it duplicates: the RPE the user may have set
 * moves over (only when the Strava run has none), then the Garmin-only row is deleted, which
 * also frees its Garmin id and removes its metrics. The caller links the Strava run right after.
 */
export async function mergeGarminOnlyRow(admin, userId, garminRow, stravaActivityId) {
  if (garminRow.source !== 'garmin') {
    throw new Error('Only a Garmin-only run can be merged into a Strava run')
  }

  const { data: row, error: readError } = await admin
    .from('rt_activities')
    .select('perceived_exertion')
    .eq('id', garminRow.id)
    .eq('user_id', userId)
    .maybeSingle()
  if (readError) throw new Error(`Failed to read Garmin-only run: ${readError.message}`)

  if (row?.perceived_exertion != null) {
    const { error } = await admin
      .from('rt_activities')
      .update({ perceived_exertion: row.perceived_exertion })
      .eq('id', stravaActivityId)
      .eq('user_id', userId)
      .is('perceived_exertion', null)
    if (error) throw new Error(`Failed to carry over perceived exertion: ${error.message}`)
  }

  const { error: deleteError } = await admin
    .from('rt_activities')
    .delete()
    .eq('id', garminRow.id)
    .eq('user_id', userId)
    .eq('source', 'garmin')
  if (deleteError)
    throw new Error(`Failed to remove duplicate Garmin-only run: ${deleteError.message}`)
}
