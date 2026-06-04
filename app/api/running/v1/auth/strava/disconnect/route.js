import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/utils/running/encrypt'

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

    const { data: creds } = await supabase
      .from('rt_strava_credentials')
      .select('access_token')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!creds) {
      return NextResponse.json(
        { error: 'Not found', message: 'Strava not connected' },
        { status: 404 }
      )
    }

    fetch('https://www.strava.com/oauth/deauthorize', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + decrypt(creds.access_token) },
    }).catch((err) => console.error('[strava/deauthorize fire-and-forget]', err.message))

    const { error: deleteError } = await supabase
      .from('rt_strava_credentials')
      .delete()
      .eq('user_id', user.id)

    if (deleteError) throw deleteError

    return NextResponse.json({ data: null, message: 'Disconnected' }, { status: 200 })
  } catch (err) {
    console.error('[running/auth/strava/disconnect POST]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
