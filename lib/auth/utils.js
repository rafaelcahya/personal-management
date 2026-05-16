import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function requireAuth() {
  const cookieStore = await cookies()

  // Cek bypass cookie untuk Cypress
  const bypassCookie = cookieStore.get('cypress-bypass')?.value
  const isBypassed =
    process.env.NODE_ENV !== 'production' && bypassCookie === process.env.CYPRESS_AUTH_SECRET

  if (isBypassed) {
    const sessionToken = cookieStore.get('cypress-session-token')?.value
    if (sessionToken) {
      try {
        const payload = JSON.parse(
          Buffer.from(sessionToken.split('.')[1], 'base64url').toString('utf-8')
        )
        if (payload.sub) {
          return {
            id: payload.sub,
            email: payload.email || process.env.CYPRESS_TEST_EMAIL,
            user_metadata: { full_name: 'Cypress Test User' },
            app_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          }
        }
      } catch {
        // fall through to mock user
      }
    }

    return {
      id: '00000000-0000-0000-0000-000000000000',
      email: process.env.CYPRESS_TEST_EMAIL || 'test@cypress.io',
      user_metadata: { full_name: 'Cypress Test User' },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    }
  }

  // Normal auth flow
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return user
}
