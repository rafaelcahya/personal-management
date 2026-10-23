// Pure, no next/headers import: middleware (edge) and server code both use it.

/**
 * Names of the rules a verified token's claims break. Empty = the claims are fine.
 * A missing sub is the only case that returns just ['sub'], since nothing else can be trusted then.
 * @param {Record<string, any> | null | undefined} claims
 * @returns {string[]}
 */
export function getFailedClaims(claims) {
  if (!claims?.sub) return ['sub']
  const issuer = `${(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/+$/, '')}/auth/v1`
  const audience = Array.isArray(claims.aud) ? claims.aud : [claims.aud]
  const failed = []
  if (claims.role !== 'authenticated') failed.push('role')
  if (!audience.includes('authenticated')) failed.push('aud')
  if (claims.iss !== issuer) failed.push('iss')
  if (claims.is_anonymous === true) failed.push('is_anonymous')
  return failed
}

/**
 * Only the exact value 'log' relaxes the cookie path; unset, typos and anything else enforce.
 * Read on every call so the value follows the deployment's env, not module load time.
 * @returns {'log' | 'enforce'}
 */
export function getClaimsMode() {
  return process.env.AUTH_CLAIMS_MODE === 'log' ? 'log' : 'enforce'
}

/**
 * Any request that carries an Authorization header (even a malformed one) counts as Bearer, so it
 * can never fall back to the more lenient cookie rules.
 * @param {{ status: 'none' | 'ok' | 'invalid' }} bearer result of parseBearer / getRequestBearer
 * @returns {'bearer' | 'cookie'}
 */
export function claimsSource(bearer) {
  return bearer.status === 'none' ? 'cookie' : 'bearer'
}

/**
 * Whether a request's claims are accepted. Bearer always enforces. A cookie session that breaks a
 * rule logs the rule names only (never the token or claim values): in 'log' mode it is still
 * accepted, otherwise it is rejected. A missing sub is "not signed in", not a claims problem, so
 * it never logs.
 * @param {Record<string, any> | null | undefined} claims
 * @param {'bearer' | 'cookie'} source
 */
export function acceptUserClaims(claims, source) {
  if (!claims?.sub) return false
  const failed = getFailedClaims(claims)
  if (failed.length === 0) return true
  if (source === 'bearer') return false

  if (getClaimsMode() === 'log') {
    console.warn(`[auth/claims] cookie session would be rejected: ${failed.join(', ')}`)
    return true
  }
  console.warn(`[auth/claims] cookie session rejected: ${failed.join(', ')}`)
  return false
}
