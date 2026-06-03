import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { inngest } from '@/lib/inngest/client'
import { encrypt } from '@/lib/utils/running/encrypt'

const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token'
const SETTINGS_ERROR_URL = '/main/running/settings?error=strava_auth'
const DASHBOARD_URL = '/main/running/dashboard'
const ONBOARDING_NEXT_URL = '/main/running/onboarding?step=3'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL(SETTINGS_ERROR_URL, request.url))
  }

  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  let tokenData
  try {
    const tokenRes = await fetch(STRAVA_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenRes.ok) {
      return NextResponse.redirect(new URL(SETTINGS_ERROR_URL, request.url))
    }

    tokenData = await tokenRes.json()
  } catch {
    return NextResponse.redirect(new URL(SETTINGS_ERROR_URL, request.url))
  }

  try {
    const athleteId = tokenData?.athlete?.id
    if (!athleteId) throw new Error('No athlete in Strava response')

    const encryptedAccessToken = encrypt(tokenData.access_token)
    const encryptedRefreshToken = encrypt(tokenData.refresh_token)

    const { error: dbError } = await supabase.from('rt_strava_credentials').upsert(
      {
        user_id: user.id,
        athlete_id: athleteId,
        access_token: encryptedAccessToken,
        refresh_token: encryptedRefreshToken,
        expires_at: new Date(tokenData.expires_at * 1000).toISOString(),
        scope: tokenData.scope,
        needs_reconnect: false,
      },
      { onConflict: 'user_id' }
    )

    if (dbError) {
      console.error('[strava/callback] upsert error:', dbError.message)
      return NextResponse.redirect(new URL(SETTINGS_ERROR_URL, request.url))
    }

    await inngest.send({ name: 'strava/backfill', data: { userId: user.id } })

    const { data: rtUser } = await supabase
      .from('rt_users')
      .select('onboarding_complete')
      .eq('id', user.id)
      .maybeSingle()

    const dest = rtUser?.onboarding_complete ? DASHBOARD_URL : ONBOARDING_NEXT_URL
    return NextResponse.redirect(new URL(dest, request.url))
  } catch (err) {
    console.error('[strava/callback] post-token error:', err.message)
    return NextResponse.redirect(new URL(SETTINGS_ERROR_URL, request.url))
  }
}
