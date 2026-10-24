import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getGarminConnection } from '@/lib/services/running/garmin/getGarminConnection'

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

    const [{ data, error }, garmin] = await Promise.all([
      supabase
        .from('rt_strava_credentials')
        .select('last_sync_at')
        .eq('user_id', user.id)
        .maybeSingle(),
      // A Garmin problem must not hide the Strava status
      getGarminConnection(supabase, user.id).catch((err) => {
        console.error('[running/sync/status] garmin lookup failed', err?.message)
        return null
      }),
    ])

    if (error) {
      console.error('[running/sync/status]', error)
      return NextResponse.json(
        { error: 'Internal server error', message: 'Something went wrong' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        connected: data !== null,
        last_sync_at: data?.last_sync_at ?? null,
        garmin,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('[running/sync/status]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
