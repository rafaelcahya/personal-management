import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { patchActivitySchema } from '@/schemas/runningManualEntry'
import { computeAndSaveDerivedMetrics } from '@/lib/services/running/metrics'

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
        'id, user_id, source, external_id, started_at, duration_sec, moving_time_sec, distance_m, avg_pace_sec_per_km, max_pace_sec_per_km, avg_hr, max_hr, avg_cadence, elevation_gain_m, elevation_loss_m, calories, activity_type, perceived_exertion, notes, description, weather_summary, created_at, name, avg_watts, weighted_avg_watts, device_watts, summary_polyline, gear_id, avg_temp_c, pr_count, workout_type, relative_effort, device_name, kilojoules, elev_high_m, elev_low_m, achievement_count, kudos_count, zones, aerobic_decoupling, efficiency_factor, estimated_vo2max, max_watts, commute, trainer, has_heartrate, manual'
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

    const metricsIncomplete =
      activity.aerobic_decoupling == null ||
      activity.efficiency_factor == null ||
      activity.estimated_vo2max == null
    const gatePassed =
      (activity.moving_time_sec ?? activity.duration_sec ?? 0) > 1200 && activity.avg_hr != null

    if (metricsIncomplete && gatePassed) {
      try {
        const { updated, values } = await computeAndSaveDerivedMetrics(id, user.id)
        if (updated) Object.assign(activity, values)
      } catch (computeErr) {
        console.error('[running/activities/:id] lazy compute failed', computeErr)
      }
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

    const { data: bestEffortsRaw, error: bestEffortsError } = await supabase
      .from('rt_activity_best_efforts')
      .select('id, name, distance_m, elapsed_time_sec, moving_time_sec, pr_rank, started_at')
      .eq('activity_id', id)
      .order('distance_m', { ascending: true })
    if (bestEffortsError) throw bestEffortsError

    const TOP_DISTANCES_DETAIL = ['1 mile', '5K', '10K', '15K', 'Half-Marathon']
    const relevantEfforts = (bestEffortsRaw ?? []).filter(
      (e) => e.pr_rank != null && e.pr_rank <= 5 && TOP_DISTANCES_DETAIL.includes(e.name)
    )

    const supersededSet = new Set()
    if (relevantEfforts.length > 0) {
      const names = [...new Set(relevantEfforts.map((e) => e.name))]
      const ranks = [...new Set(relevantEfforts.map((e) => e.pr_rank))]
      const { data: candidateRows } = await supabase
        .from('rt_activity_best_efforts')
        .select('name, pr_rank, rt_activities!inner(started_at)')
        .in('name', names)
        .in('pr_rank', ranks)
        .not('pr_rank', 'is', null)
        .lte('pr_rank', 5)
        .eq('rt_activities.user_id', user.id)
        .neq('activity_id', id)
      for (const row of candidateRows ?? []) {
        if ((row.rt_activities?.started_at ?? '') > activity.started_at) {
          supersededSet.add(`${row.name}__${row.pr_rank}`)
        }
      }
    }

    const bestEfforts = (bestEffortsRaw ?? []).map((e) => {
      const isRelevant =
        e.pr_rank != null && e.pr_rank <= 5 && TOP_DISTANCES_DETAIL.includes(e.name)
      return {
        ...e,
        is_latest_for_rank: !isRelevant || !supersededSet.has(`${e.name}__${e.pr_rank}`),
      }
    })

    const { data: photos, error: photosError } = await supabase
      .from('rt_activity_photos')
      .select('id, unique_id, url_600, url_100, media_type')
      .eq('activity_id', id)
    if (photosError) throw photosError

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data: efRows, error: efError } = await supabase
      .from('rt_activities')
      .select('efficiency_factor')
      .eq('user_id', user.id)
      .not('efficiency_factor', 'is', null)
      .gte('started_at', thirtyDaysAgo)
      .neq('id', id)

    if (efError) throw efError

    let efficiency_factor_30d_avg = null
    if (efRows && efRows.length >= 3) {
      const sum = efRows.reduce((acc, row) => acc + Number(row.efficiency_factor), 0)
      efficiency_factor_30d_avg = parseFloat((sum / efRows.length).toFixed(4))
    }

    const { data: userProfile } = await supabase
      .from('rt_users')
      .select('max_hr, weight_kg')
      .eq('id', user.id)
      .maybeSingle()
    const user_max_hr = userProfile?.max_hr ?? null
    const user_weight_kg = userProfile?.weight_kg ?? null

    const { data: hrRows, error: hrError } = await supabase
      .from('rt_activities')
      .select('avg_hr, moving_time_sec, duration_sec')
      .eq('user_id', user.id)
      .not('avg_hr', 'is', null)
      .neq('id', id)
      .in('activity_type', ['Run', 'TrailRun', 'VirtualRun'])

    if (hrError) throw hrError

    let historical_avg_hr = null
    if (hrRows && hrRows.length > 0) {
      let weightedSum = 0
      let totalDuration = 0
      for (const row of hrRows) {
        const dur = row.moving_time_sec ?? row.duration_sec ?? 0
        if (dur > 0) {
          weightedSum += Number(row.avg_hr) * dur
          totalDuration += dur
        }
      }
      if (totalDuration > 0) historical_avg_hr = Math.round(weightedSum / totalDuration)
    }

    const { data: cadenceRows, error: cadenceError } = await supabase
      .from('rt_activities')
      .select('avg_cadence, moving_time_sec, duration_sec')
      .eq('user_id', user.id)
      .not('avg_cadence', 'is', null)
      .neq('id', id)
      .in('activity_type', ['Run', 'TrailRun', 'VirtualRun'])

    if (cadenceError) throw cadenceError

    let historical_avg_cadence = null
    if (cadenceRows && cadenceRows.length > 0) {
      let weightedSum = 0
      let totalDuration = 0
      for (const row of cadenceRows) {
        const dur = row.moving_time_sec ?? row.duration_sec ?? 0
        if (dur > 0) {
          weightedSum += Number(row.avg_cadence) * dur
          totalDuration += dur
        }
      }
      if (totalDuration > 0) historical_avg_cadence = Math.round(weightedSum / totalDuration) * 2
    }

    return NextResponse.json(
      {
        activity: {
          ...activity,
          gear,
          efficiency_factor_30d_avg,
          historical_avg_hr,
          historical_avg_cadence,
          user_max_hr,
          user_weight_kg,
        },
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
