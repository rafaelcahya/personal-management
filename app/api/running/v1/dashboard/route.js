import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCachedDashboardData } from '@/lib/services/running/analyticsCache'
import { dashboardQuerySchema } from '@/schemas/runningDashboardQuery'
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
    const parsed = dashboardQuerySchema.safeParse({
      type: searchParams.get('type') || undefined,
      tz_offset: searchParams.get('tz_offset') || undefined,
    })

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Bad request',
          message: parsed.error.issues[0]?.message ?? 'Invalid query params',
        },
        { status: 400 }
      )
    }

    const activityType = parsed.data.type ?? null
    const tzOffsetMs = parsed.data.tz_offset * 60 * 1000

    const admin = createAdminClient()
    const [data, credResult, ytd_stats] = await Promise.all([
      getCachedDashboardData(user.id, activityType, tzOffsetMs),
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
