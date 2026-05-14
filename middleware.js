import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const path = request.nextUrl.pathname

  const cypressAuthCookie = request.cookies.get('cypress-bypass')?.value
  const expectedSecret = process.env.CYPRESS_AUTH_SECRET

  if (
    process.env.NODE_ENV !== 'production' &&
    cypressAuthCookie &&
    expectedSecret &&
    cypressAuthCookie === expectedSecret
  ) {
    if (path === '/') {
      return NextResponse.redirect(new URL('/main/inventory', request.url))
    }
    return NextResponse.next()
  }

  if (
    path.startsWith('/auth/v1/callback') ||
    path.startsWith('/login') ||
    path.startsWith('/_next') ||
    path.startsWith('/api/auth')
  ) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

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

  if (user && (path === '/login' || path === '/')) {
    return NextResponse.redirect(new URL('/main/inventory', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
