import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { getRateLimitTier, rateLimit, rateLimitResponse } from '@/lib/rate-limit'
import { AUTH_SOURCE_HEADER, INVALID_BEARER, NO_BEARER, parseBearer } from '@/lib/auth/bearer'
import { acceptUserClaims, claimsSource } from '@/lib/auth/claims'
import { isKnownKid } from '@/lib/auth/jwksKids'

export async function middleware(request) {
  const path = request.nextUrl.pathname

  // Built before any early return so a client-sent AUTH_SOURCE_HEADER / x-pathname can never
  // reach a route, including on public paths and the Cypress bypass.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.delete(AUTH_SOURCE_HEADER)
  requestHeaders.set('x-pathname', path)

  const cypressAuthCookie = request.cookies.get('cypress-bypass')?.value
  const expectedSecret = process.env.CYPRESS_AUTH_SECRET

  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.CYPRESS_BYPASS_ENABLED === 'true' &&
    cypressAuthCookie &&
    expectedSecret &&
    cypressAuthCookie === expectedSecret
  ) {
    if (path === '/') {
      return NextResponse.redirect(new URL('/main/inventory', request.url))
    }
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  if (
    path.startsWith('/auth/v1/callback') ||
    path.startsWith('/login') ||
    path.startsWith('/_next') ||
    path.startsWith('/api/auth') ||
    path.startsWith('/api/inngest') ||
    path.startsWith('/docs') ||
    path.startsWith('/api/docs') ||
    path === '/api/running/v1/auth/strava/callback'
  ) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // Bearer is read on /api/* only; pages stay cookie-only. A Bearer header always wins over the
  // cookie and never falls back to it: a bad Bearer is a 401 even with a good session cookie.
  let bearer = path.startsWith('/api/')
    ? parseBearer(request.headers.get('authorization'))
    : NO_BEARER
  // A kid the project never issued is rejected here, before getClaims() could spend network calls on it.
  if (bearer.status === 'ok' && !(await isKnownKid(bearer.kid))) bearer = INVALID_BEARER
  if (bearer.status === 'ok') requestHeaders.set(AUTH_SOURCE_HEADER, 'bearer')

  let response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      // Bearer requests never read or write cookies, so they can never get a Set-Cookie.
      cookies:
        bearer.status !== 'none'
          ? { get: () => undefined, set() {}, remove() {} }
          : {
              get(name) {
                return request.cookies.get(name)?.value
              },
              set(name, value, options) {
                request.cookies.set({ name, value, ...options })
                response = NextResponse.next({
                  request: { headers: requestHeaders },
                })
                response.cookies.set({ name, value, ...options })
              },
              remove(name, options) {
                request.cookies.set({ name, value: '', ...options })
                response = NextResponse.next({
                  request: { headers: requestHeaders },
                })
                response.cookies.set({ name, value: '', ...options })
              },
            },
    }
  )

  // Verifies the JWT locally against the project's public key; no call to the Auth server.
  // A malformed token can make getClaims() throw; that must read as "not signed in", not a 500.
  let user = null
  if (bearer.status !== 'invalid') {
    try {
      const { data: claimsData } = await supabase.auth.getClaims(bearer.token ?? undefined)
      const claims = claimsData?.claims
      // One `user` feeds both the 401/login gate and the /login bounce, so a session that fails the
      // claims check lands on /login and is served there instead of being sent back.
      if (acceptUserClaims(claims, claimsSource(bearer))) {
        user = { id: claims.sub }
      }
    } catch {
      user = null
    }
  }

  if (!user && path !== '/login') {
    if (path.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', path)
    return NextResponse.redirect(loginUrl)
  }

  if (user && path.startsWith('/api/')) {
    const tier = getRateLimitTier(path)
    const result = rateLimit(`${tier}:${user.id}`, tier)
    if (!result.allowed) return rateLimitResponse(result)
  }

  if (user && (path === '/login' || path === '/')) {
    return NextResponse.redirect(new URL('/main/inventory', request.url))
  }

  return response
}

export const config = {
  // Entries are OR'd. '/api/:path*' keeps /api/... paths ending in an image extension from
  // skipping middleware, which is where client-sent x-auth-source / x-pathname are stripped.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/api/:path*',
  ],
}
