import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { patchActivitySchema } from '@/schemas/runningManualEntry'

export async function GET(_request, { params }) {
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

    const { id } = await params

    const { data: activity, error: activityError } = await supabase
      .from('rt_activities')
      .select(
        'id, user_id, source, external_id, started_at, duration_sec, moving_time_sec, distance_m, avg_pace_sec_per_km, max_pace_sec_per_km, avg_hr, max_hr, avg_cadence, elevation_gain_m, elevation_loss_m, calories, activity_type, perceived_exertion, notes, description, weather_summary, created_at, name, avg_watts, weighted_avg_watts, device_watts, summary_polyline, gear_id, avg_temp_c, pr_count, workout_type, relative_effort, max_pace_sec_per_km, device_name, kilojoules, elev_high_m, elev_low_m, achievement_count, kudos_count, zones'
      )
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (activityError) throw activityError

    if (!activity) {
      return NextResponse.json(
        { error: 'Not found', message: 'Activity not found' },
        { status: 404 }
      )
    }

    let gear = null
    if (activity.gear_id) {
      const admin = createAdminClient()
      const { data: gearRow } = await admin
        .from('rt_gear')
        .select('name, distance_m')
        .eq('id', activity.gear_id)
        .eq('user_id', user.id)
        .maybeSingle()
      if (gearRow) gear = { name: gearRow.name, distance_m: gearRow.distance_m }
    }

    const { data: splits, error: splitsError } = await supabase
      .from('rt_activity_splits')
      .select(
        'id, split_number, distance_m, duration_sec, pace_sec_per_km, avg_hr, elevation_gain_m'
      )
      .eq('activity_id', id)
      .order('split_number', { ascending: true })

    if (splitsError) throw splitsError

    const { data: laps, error: lapsError } = await supabase
      .from('rt_activity_laps')
      .select(
        'id, lap_index, name, distance_m, elapsed_time_sec, moving_time_sec, avg_speed_ms, max_speed_ms, avg_cadence, avg_watts, total_elevation_gain_m, pace_zone, started_at'
      )
      .eq('activity_id', id)
      .order('lap_index', { ascending: true })
    if (lapsError) throw lapsError

    const { data: bestEfforts, error: bestEffortsError } = await supabase
      .from('rt_activity_best_efforts')
      .select('id, name, distance_m, elapsed_time_sec, moving_time_sec, pr_rank, started_at')
      .eq('activity_id', id)
      .order('distance_m', { ascending: true })
    if (bestEffortsError) throw bestEffortsError

    const { data: photos, error: photosError } = await supabase
      .from('rt_activity_photos')
      .select('id, unique_id, url_600, url_100, media_type')
      .eq('activity_id', id)
    if (photosError) throw photosError

    return NextResponse.json(
      {
        activity: { ...activity, gear },
        splits: splits ?? [],
        laps: laps ?? [],
        best_efforts: bestEfforts ?? [],
        photos: photos ?? [],
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('[running/activities/:id GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function PATCH(request, { params }) {
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

    const { id } = await params

    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Validation failed', message: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const parsed = patchActivitySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 422 }
      )
    }

    const { data: existing, error: fetchError } = await supabase
      .from('rt_activities')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (fetchError) throw fetchError

    if (!existing) {
      return NextResponse.json(
        { error: 'Not found', message: 'Activity not found' },
        { status: 404 }
      )
    }

    const { data: updated, error: updateError } = await supabase
      .from('rt_activities')
      .update(parsed.data)
      .eq('id', id)
      .eq('user_id', user.id)
      .select(
        'id, started_at, duration_sec, distance_m, avg_pace_sec_per_km, avg_hr, activity_type, perceived_exertion, notes, source, created_at'
      )
      .single()

    if (updateError) throw updateError

    return NextResponse.json({ data: updated }, { status: 200 })
  } catch (err) {
    console.error('[running/activities/:id PATCH]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function DELETE(_request, { params }) {
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

    const { id } = await params

    const { data: existing, error: fetchError } = await supabase
      .from('rt_activities')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (fetchError) throw fetchError

    if (!existing) {
      return NextResponse.json(
        { error: 'Not found', message: 'Activity not found' },
        { status: 404 }
      )
    }

    const { error: deleteError } = await supabase
      .from('rt_activities')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (deleteError) throw deleteError

    return new Response(null, { status: 204 })
  } catch (err) {
    console.error('[running/activities/:id DELETE]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
