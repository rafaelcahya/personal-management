/**
 * Current user as confirmed by the Auth server (a real getUser() round-trip), not just a valid JWT.
 * Use it where a revoked session must not get through: routes that create something which outlives
 * the token (push subscription, Strava link) and anywhere fresh user_metadata is needed.
 * The explicit token makes createClient()'s patched getUser() forward to the real one.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 */
export async function getServerUser(supabase) {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session?.access_token) return { user: null, error: new Error('No session') }

  const { data, error } = await supabase.auth.getUser(session.access_token)
  return { user: data?.user ?? null, error }
}
