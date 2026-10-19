import { headers } from 'next/headers'
import { AUTH_SOURCE_HEADER, NO_BEARER, parseBearer } from '@/lib/auth/bearer'

/**
 * Bearer token of the current request, only when middleware accepted it for this path.
 * AUTH_SOURCE_HEADER is stripped from every incoming request and set by middleware only for
 * /api/* requests carrying a well-formed Bearer, so a client cannot turn Bearer mode on elsewhere.
 * The /api/ check on x-pathname (also set by middleware) keeps pages cookie-only even if the
 * header were ever to slip through. The token is still verified again by the caller.
 * @returns {Promise<{ status: 'none' | 'ok' | 'invalid', token: string | null, kid: string | null }>}
 */
export async function getRequestBearer() {
  const requestHeaders = await headers()
  if (
    requestHeaders.get(AUTH_SOURCE_HEADER) !== 'bearer' ||
    !requestHeaders.get('x-pathname')?.startsWith('/api/')
  ) {
    return NO_BEARER
  }
  return parseBearer(requestHeaders.get('authorization'))
}
