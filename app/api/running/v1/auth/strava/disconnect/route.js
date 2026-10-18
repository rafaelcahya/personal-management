import { NextResponse, after } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { refreshStravaToken } from '@/lib/services/running/strava/refreshStravaToken'
import { isStravaStubbed } from '@/lib/services/running/strava/stravaStub'

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { data: creds, error: lookupError } = await supabase
      .from('rt_strava_credentials')
      .select('access_token, refresh_token, expires_at, needs_reconnect')
      .eq('user_id', user.id)
      .maybeSingle()

    if (lookupError) throw lookupError

    if (!creds) {
      return NextResponse.json(
        { error: 'Not found', message: 'Strava not connected' },
        { status: 404 }
      )
    }

    // Done before the delete: an expired access token would make deauthorize fail silently.
    let accessToken = null
    if (!isStravaStubbed()) {
      try {
        const tokenResult = await refreshStravaToken(user.id, creds)
        accessToken = tokenResult.accessToken ?? null
      } catch (err) {
        console.error('[strava/disconnect] token refresh failed', err.message)
      }
    }

    // Delete first so a failing deauthorize call can never leave the user stuck connected.
    const { data: deleted, error: deleteError } = await supabase
      .from('rt_strava_credentials')
      .delete()
      .eq('user_id', user.id)
      .select('user_id')

    if (deleteError) throw deleteError
    if (!deleted?.length) throw new Error('Credentials were not deleted')

    if (accessToken) {
      after(async () => {
        try {
          await fetch('https://www.strava.com/oauth/deauthorize', {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + accessToken },
          })
        } catch (err) {
          console.error('[strava/disconnect] deauthorize failed', err.message)
        }
      })
    }

    return NextResponse.json({ data: null, message: 'Disconnected' }, { status: 200 })
  } catch (err) {
    console.error('[running/auth/strava/disconnect POST]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
