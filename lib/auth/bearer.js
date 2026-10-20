// Pure parsing, no next/headers import: middleware (edge) and server code both use it.
export const AUTH_SOURCE_HEADER = 'x-auth-source'

export const NO_BEARER = Object.freeze({ status: 'none', token: null, kid: null })
export const INVALID_BEARER = Object.freeze({ status: 'invalid', token: null, kid: null })

const MAX_TOKEN_LENGTH = 4096
const SCHEME_PREFIX_LENGTH = 'Bearer '.length
// Scheme is case-insensitive (RFC 7235); one space, one token, three base64url parts.
const BEARER_PATTERN = /^bearer ([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/i
// getClaims() leaves local verification and calls the Auth server when the alg is HS* or missing,
// the kid is missing, or the kid is not in the cached JWKS (a JWKS refetch, then getUser()).
// So only ES256/RS256 with a kid is accepted here, and the kid must also be known (jwksKids.js).
const ALLOWED_ALGS = ['ES256', 'RS256']

function readKid(token) {
  try {
    const base64 = token.split('.')[0].replace(/-/g, '+').replace(/_/g, '/')
    const header = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')))
    if (!ALLOWED_ALGS.includes(header?.alg)) return null
    return typeof header.kid === 'string' && header.kid ? header.kid : null
  } catch {
    return null
  }
}

/**
 * @param {string | null | undefined} headerValue raw Authorization header
 * @returns {{ status: 'none' | 'ok' | 'invalid', token: string | null, kid: string | null }}
 *   none = no header; invalid = header present but not one well-formed Bearer token.
 */
export function parseBearer(headerValue) {
  if (headerValue === null || headerValue === undefined) return NO_BEARER
  if (headerValue.length > MAX_TOKEN_LENGTH + SCHEME_PREFIX_LENGTH) return INVALID_BEARER

  const token = BEARER_PATTERN.exec(headerValue)?.[1]
  if (!token || token.length > MAX_TOKEN_LENGTH) return INVALID_BEARER

  const kid = readKid(token)
  if (!kid) return INVALID_BEARER
  return { status: 'ok', token, kid }
}
