import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Returns avg pace (sec/km) from recent stream data where HR is in threshold zone (±6% of LTHR).
export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('rt_users')
      .select('threshold_hr')
      .eq('id', user.id)
      .maybeSingle()

    const thresholdHr = profile?.threshold_hr ?? null
    if (!thresholdHr) {
      return NextResponse.json(
        {
          error: 'No threshold HR set',
          message: 'Set your Threshold HR in HR Zones settings first',
        },
        { status: 422 }
      )
    }

    const hrLow = Math.round(thresholdHr * 0.94)
    const hrHigh = Math.round(thresholdHr * 1.06)
    const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()

    // Fetch recent run activities with details
    const { data: activities, error: actErr } = await supabase
      .from('rt_activities')
      .select('id, name, started_at, distance_m')
      .eq('user_id', user.id)
      .in('activity_type', ['Run', 'TrailRun', 'VirtualRun'])
      .gte('started_at', since)
      .not('avg_hr', 'is', null)
      .order('started_at', { ascending: false })
      .limit(30)

    if (actErr) throw actErr
    if (!activities || activities.length === 0) {
      return NextResponse.json(
        { error: 'No data', message: 'No recent run activities with heart rate data found' },
        { status: 404 }
      )
    }

    const activityIds = activities.map((a) => a.id)

    const STREAM_SAMPLE_LIMIT = 5000

    // Query stream rows within threshold HR band
    const { data: rows, error: streamErr } = await supabase
      .from('rt_activity_streams')
      .select('velocity_m_s')
      .in('activity_id', activityIds)
      .gte('heart_rate', hrLow)
      .lte('heart_rate', hrHigh)
      .gte('velocity_m_s', 1.5)
      .lte('velocity_m_s', 7.0)
      .limit(STREAM_SAMPLE_LIMIT)

    if (streamErr) throw streamErr
    if (!rows || rows.length < 30) {
      return NextResponse.json(
        {
          error: 'Insufficient data',
          message: 'Not enough data points in threshold HR zone to estimate pace',
        },
        { status: 404 }
      )
    }

    const avgVelocity = rows.reduce((s, r) => s + r.velocity_m_s, 0) / rows.length
    const thresholdPaceSec = Math.round(1000 / avgVelocity)

    return NextResponse.json(
      {
        data: {
          threshold_pace_sec: thresholdPaceSec,
          sample_count: rows.length,
          activities: activities.map((a) => ({
            id: a.id,
            name: a.name,
            started_at: a.started_at,
            distance_m: a.distance_m,
          })),
        },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('[running/user/threshold-pace-detect GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
