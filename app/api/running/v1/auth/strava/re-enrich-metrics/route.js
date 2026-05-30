import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { computeAndSaveDerivedMetrics } from '@/lib/services/running/metrics'

const BATCH_LIMIT = 200

export async function POST(_request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createAdminClient()

    // Only re-enrich activities that are missing at least one derived metric
    // and meet the gate conditions (moving_time_sec > 20 min AND avg_hr not null)
    const { data: activities, error: fetchError } = await admin
      .from('rt_activities')
      .select('id')
      .eq('user_id', user.id)
      .gt('moving_time_sec', 20 * 60)
      .not('avg_hr', 'is', null)
      .or('efficiency_factor.is.null,aerobic_decoupling.is.null,estimated_vo2max.is.null')
      .limit(BATCH_LIMIT)

    if (fetchError) {
      return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
    }

    if (!activities || activities.length === 0) {
      return NextResponse.json({ success: true, data: { processed: 0, updated: 0 } })
    }

    let updatedCount = 0
    for (const activity of activities) {
      const result = await computeAndSaveDerivedMetrics(activity.id, user.id)
      if (result.updated) updatedCount++
    }

    return NextResponse.json(
      {
        success: true,
        data: { processed: activities.length, updated: updatedCount },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('[strava/re-enrich-metrics]', err.message)
    return NextResponse.json({ success: false, error: 'Re-enrich metrics failed' }, { status: 500 })
  }
}
