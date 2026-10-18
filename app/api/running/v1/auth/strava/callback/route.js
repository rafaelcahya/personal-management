import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getServerUser } from '@/lib/supabase/getServerUser'
import { inngest } from '@/lib/inngest/client'
import { encrypt } from '@/lib/utils/running/encrypt'
import { isStravaStubbed } from '@/lib/services/running/strava/stravaStub'
import {
  STRAVA_STATE_COOKIE,
  isValidOAuthState,
  stateCookieOptions,
} from '@/lib/utils/running/stravaOAuthState'

const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token'
const SETTINGS_ERROR_URL = '/main/running/settings?error=strava_auth'
const ONBOARDING_ERROR_URL = '/main/running/onboarding?step=2&strava_error=1'
const DASHBOARD_URL = '/main/running/dashboard'
const ONBOARDING_NEXT_URL = '/main/running/onboarding?step=3'

const settingsErrorUrl = (reason) =>
  reason ? `/main/running/settings?error=strava_${reason}` : SETTINGS_ERROR_URL

async function getErrorRedirect(supabase, reason) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return settingsErrorUrl(reason)
    const { data: rtUser } = await supabase
      .from('rt_users')
      .select('onboarding_complete')
      .eq('id', user.id)
      .maybeSingle()
    if (rtUser?.onboarding_complete === false) {
      return reason ? `${ONBOARDING_ERROR_URL}&reason=${reason}` : ONBOARDING_ERROR_URL
    }
  } catch {
    // fall through
  }
  return settingsErrorUrl(reason)
}

// The state is single-use: every exit path clears the cookie.
function redirectAndClearState(url) {
  const response = NextResponse.redirect(url)
  response.cookies.set(STRAVA_STATE_COOKIE, '', stateCookieOptions(0))
  return response
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  const supabase = await createClient()
  const errorRedirect = async (reason) =>
    redirectAndClearState(new URL(await getErrorRedirect(supabase, reason), request.url))

  if (!code) {
    return errorRedirect()
  }

  const expectedState = request.cookies.get(STRAVA_STATE_COOKIE)?.value
  if (!isValidOAuthState(expectedState, searchParams.get('state'))) {
    return errorRedirect('state')
  }
  if (isStravaStubbed()) {
    return errorRedirect()
  }

  // The Strava link outlives the token, so confirm the session with the Auth server.
  const { user, error: authError } = await getServerUser(supabase)

  if (authError || !user) {
    return redirectAndClearState(new URL('/login', request.url))
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
      return errorRedirect()
    }

    tokenData = await tokenRes.json()
  } catch {
    return errorRedirect()
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
      return errorRedirect()
    }

    await inngest.send({ name: 'strava/backfill', data: { userId: user.id } })

    const { data: rtUser } = await supabase
      .from('rt_users')
      .select('onboarding_complete')
      .eq('id', user.id)
      .maybeSingle()

    const dest = rtUser?.onboarding_complete ? DASHBOARD_URL : ONBOARDING_NEXT_URL
    return redirectAndClearState(new URL(dest, request.url))
  } catch (err) {
    console.error('[strava/callback] post-token error:', err.message)
    return errorRedirect()
  }
}
