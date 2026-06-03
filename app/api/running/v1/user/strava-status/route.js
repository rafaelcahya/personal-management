import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
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

    const { data, error } = await supabase
      .from('rt_strava_credentials')
      .select('athlete_id, last_sync_at, needs_reconnect')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('[running/user/strava-status]', error)
      return NextResponse.json(
        { error: 'Internal server error', message: 'Something went wrong' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        data: {
          connected: data !== null,
          athlete_id: data?.athlete_id ?? null,
          last_sync_at: data?.last_sync_at ?? null,
          needs_reconnect: data?.needs_reconnect ?? false,
        },
        message: 'OK',
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('[running/user/strava-status]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
