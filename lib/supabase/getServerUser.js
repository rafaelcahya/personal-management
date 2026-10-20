import { getRequestBearer } from '@/lib/auth/getRequestBearer'
import { acceptUserClaims, claimsSource } from '@/lib/auth/claims'

// Local signature check only (the Auth server call comes after); an error or throw reads as no claims.
async function readClaims(supabase, token) {
  try {
    const { data } = await supabase.auth.getClaims(token)
    return data?.claims
  } catch {
    return undefined
  }
}

async function confirmToken(supabase, token, source) {
  if (!acceptUserClaims(await readClaims(supabase, token), source)) {
    return { user: null, error: new Error('Invalid token claims') }
  }
  const { data, error } = await supabase.auth.getUser(token)
  return { user: data?.user ?? null, error }
}

/**
 * Current user as confirmed by the Auth server (a real getUser() round-trip), not just a valid JWT.
 * Use it where a revoked session must not get through: routes that create something which outlives
 * the token (push subscription, Strava link) and anywhere fresh user_metadata is needed.
 * The token's claims get the same check as middleware (AUTH_CLAIMS_MODE applies to cookies only).
 * The explicit token makes createClient()'s patched getUser() forward to the real one.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 */
export async function getServerUser(supabase) {
  // A Bearer request has no cookie session, so getSession() would be empty. The token still goes
  // through the real getUser(), same as the cookie path.
  const bearer = await getRequestBearer()
  if (bearer.status !== 'none') {
    if (!bearer.token) return { user: null, error: new Error('Invalid bearer token') }
    return confirmToken(supabase, bearer.token, claimsSource(bearer))
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session?.access_token) return { user: null, error: new Error('No session') }

  return confirmToken(supabase, session.access_token, claimsSource(bearer))
}
