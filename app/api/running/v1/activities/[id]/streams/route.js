import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const VALID_RESOLUTIONS = { raw: 1, '10s': 10, '30s': 30, '60s': 60 }

export async function GET(request, { params }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const resolutionParam = searchParams.get('resolution') ?? '10s'

    if (!(resolutionParam in VALID_RESOLUTIONS)) {
      return NextResponse.json(
        { error: 'Invalid resolution. Use: raw, 10s, 30s, 60s' },
        { status: 400 }
      )
    }

    const { id } = await params

    const { data: activity, error: activityError } = await supabase
      .from('rt_activities')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (activityError) throw activityError

    if (!activity) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const downFactor = VALID_RESOLUTIONS[resolutionParam]

    const { data: rows, error: streamsError } = await supabase
      .from('rt_activity_streams')
      .select(
        'timestamp, distance_m, heart_rate, cadence, altitude_m, pace_sec_per_km, velocity_m_s, latitude, longitude'
      )
      .eq('activity_id', id)
      .order('timestamp', { ascending: true })

    if (streamsError) throw streamsError

    if (!rows || rows.length === 0) {
      return NextResponse.json({
        meta: {
          total_points: 0,
          returned_points: 0,
          resolution: resolutionParam,
          has_hr: false,
          has_cadence: false,
          has_altitude: false,
        },
        data: [],
      })
    }

    const sampled = rows.filter((_, i) => i % downFactor === 0)

    const startMs = new Date(rows[0].timestamp).getTime()
    const has_hr = rows.some((r) => r.heart_rate != null)
    const has_cadence = rows.some((r) => r.cadence != null)
    const has_altitude = rows.some((r) => r.altitude_m != null)

    const data = sampled.map((r) => ({
      t: Math.round((new Date(r.timestamp).getTime() - startMs) / 1000),
      dist_m: r.distance_m,
      hr: r.heart_rate,
      cadence: r.cadence,
      alt: r.altitude_m,
      pace: r.pace_sec_per_km,
      velocity: r.velocity_m_s,
      lat: r.latitude,
      lng: r.longitude,
    }))

    return NextResponse.json(
      {
        meta: {
          total_points: rows.length,
          returned_points: sampled.length,
          resolution: resolutionParam,
          has_hr,
          has_cadence,
          has_altitude,
        },
        data,
      },
      { headers: { 'Cache-Control': 'private, no-store' } }
    )
  } catch (err) {
    console.error('[activities/:id/streams GET]', err.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
