export async function getAiInsightFromDb(supabase, insightId, userId) {
  const { data, error } = await supabase
    .from('rt_ai_insights')
    .select('*')
    .eq('id', insightId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw new Error(`DB query failed: ${error.message}`)
  return data
}

export async function getLatestAiInsightByTypeFromDb(supabase, insightType, userId) {
  const { data, error } = await supabase
    .from('rt_ai_insights')
    .select('*')
    .eq('user_id', userId)
    .eq('insight_type', insightType)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(`DB query failed: ${error.message}`)
  return data
}

export async function getUnacknowledgedInsightIdFromDb(supabase, userId) {
  const { data, error } = await supabase
    .from('rt_ai_insights')
    .select('id')
    .eq('user_id', userId)
    .eq('acknowledged', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(`DB query failed: ${error.message}`)
  return data
}
