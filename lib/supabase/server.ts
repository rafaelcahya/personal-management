import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { AuthSessionMissingError, type UserResponse } from '@supabase/supabase-js'
import { getRequestBearer } from '@/lib/auth/getRequestBearer'
import { hasValidBearerClaims } from '@/lib/auth/bearer'

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const cookieStore = await cookies()
  const bearer = await getRequestBearer()

  // Bearer mode: the Authorization header makes PostgREST run as the token's user (RLS applies),
  // and the empty cookie adapter keeps a stale cookie from being read or written. A header that
  // middleware flagged but that no longer parses gets no token at all, so it ends as a 401.
  const supabase =
    bearer.status !== 'none'
      ? createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: { getAll: () => [], setAll() {} },
            global: bearer.token ? { headers: { Authorization: `Bearer ${bearer.token}` } } : {},
          }
        )
      : createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              getAll() {
                return cookieStore.getAll()
              },
              setAll(cookiesToSet) {
                try {
                  cookiesToSet.forEach(({ name, value, options }) =>
                    cookieStore.set(name, value, options)
                  )
                } catch {
                  // The `setAll` method was called from a Server Component.
                  // This can be ignored if you have middleware refreshing
                  // user sessions.
                }
              },
            },
          }
        )

  // getUser() asks the Auth server on every call. getClaims() checks the JWT signature locally
  // against the project's public key (ES256 JWKS), so routes skip that round-trip. The trade-off:
  // a revoked session stays valid until its access token expires.
  // Only getUser() is patched, and auth-js calls it internally too: never use auth.mfa.* or
  // getUserIdentities() on this client (they would see a user without factors or identities).
  const getUserFromServer = supabase.auth.getUser.bind(supabase.auth)
  supabase.auth.getUser = async (jwt?: string) => {
    // Load-bearing: getClaims() falls back to getUser(token) for HS256 or unknown-kid tokens,
    // and this branch is what sends that fallback to the real Auth server check.
    if (jwt) return getUserFromServer(jwt)

    let claims
    let claimsError = null
    try {
      const { data, error } = await supabase.auth.getClaims(bearer.token ?? undefined)
      claims = data?.claims
      claimsError = error
    } catch {
      // A malformed token can make getClaims() throw; treat it as not signed in (401), not a 500.
    }
    // The cookie path keeps its current checks; the extra claim checks are for Bearer only.
    if (bearer.status !== 'none' && !hasValidBearerClaims(claims)) claims = undefined
    if (!claims?.sub) {
      return {
        data: { user: null },
        error: claimsError ?? new AuthSessionMissingError(),
      } as unknown as UserResponse
    }

    return {
      data: {
        user: {
          id: claims.sub,
          aud: claims.aud,
          role: claims.role,
          email: claims.email,
          phone: claims.phone,
          app_metadata: claims.app_metadata ?? {},
          user_metadata: claims.user_metadata ?? {},
          is_anonymous: claims.is_anonymous ?? false,
        },
      },
      error: null,
    } as unknown as UserResponse
  }

  return supabase
}
