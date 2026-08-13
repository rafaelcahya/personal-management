import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const rawNext = requestUrl.searchParams.get('next') || '/main/landing'
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/main/landing'
  const origin = requestUrl.origin

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
  if (aalData?.currentLevel === 'aal1' && aalData?.nextLevel === 'aal2') {
    return NextResponse.redirect(`${origin}/auth/verify-mfa?next=${encodeURIComponent(next)}`)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
