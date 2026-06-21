const TABLE_NAME = 'settings'

/**
 * Get trade settings for a user from the database.
 * Returns null if no row exists yet (new user with no saved settings).
 */
export async function getTradeSettingsFromDb(supabase, userId) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('initial_margin,bi_risk_free_rate,personal_risk_free_rate,margin_of_error')
    .eq('user_id', userId)
    .single()

  if (error) {
    // PGRST116 = no rows found — return null so callers can distinguish "not set" from a real error
    if (error.code === 'PGRST116') return null
    throw new Error(
      `DB query failed: ${error.message || error.details || error.hint || JSON.stringify(error)}`
    )
  }

  return data
}
