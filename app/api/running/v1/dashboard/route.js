import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getDashboardData } from '@/lib/services/running/dashboard/getDashboardData'
import { getYtdStats } from '@/lib/services/running/strava/getYtdStats'

export async function GET(request) {
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

    const { searchParams } = new URL(request.url)
    const activityType = searchParams.get('type') || null
    const tzOffset = parseInt(searchParams.get('tz_offset') ?? '0', 10)
    const tzOffsetMs = isNaN(tzOffset) ? 0 : tzOffset * 60 * 1000

    const admin = createAdminClient()
    const [data, credResult, ytd_stats] = await Promise.all([
      getDashboardData(user.id, activityType, tzOffsetMs),
      admin
        .from('rt_strava_credentials')
        .select('last_sync_at')
        .eq('user_id', user.id)
        .maybeSingle(),
      getYtdStats(user.id),
    ])

    return NextResponse.json(
      {
        data: {
          ...data,
          last_sync_at: credResult.data?.last_sync_at ?? null,
          training_load: { ...data.training_load, ytd_stats },
        },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('[running/dashboard GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
