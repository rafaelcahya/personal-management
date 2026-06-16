import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { inngest } from '@/lib/inngest/client'

const VALID_FOCUS = [
  'general',
  'performance',
  'recovery',
  'next_race',
  'next_training',
  'detail_training',
  'zone_analysis',
  'compare_baseline',
]

export async function POST(request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const { type = 'post_activity' } = body

    if (type === 'analytics_summary') {
      return handleAnalyticsSummary(user)
    }

    return handlePostActivity(supabase, user.id, body)
  } catch (err) {
    console.error('[ai/insights/generate POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleAnalyticsSummary(user) {
  inngest
    .send({
      name: 'ai/generate-analytics-summary',
      data: { userId: user.id },
    })
    .catch((err) => {
      console.error('[ai/insights/generate] Failed to queue analytics summary:', err.message)
    })

  return NextResponse.json({ queued: true, message: 'Analytics summary queued' })
}

async function handlePostActivity(supabase, userId, body) {
  const { activity_id, focus = 'general', perceived_effort, user_note } = body

  if (!activity_id) {
    return NextResponse.json({ error: 'activity_id required' }, { status: 422 })
  }

  if (!VALID_FOCUS.includes(focus)) {
    return NextResponse.json({ error: 'Invalid focus value' }, { status: 422 })
  }

  if (
    perceived_effort != null &&
    (!Number.isInteger(perceived_effort) || perceived_effort < 1 || perceived_effort > 10)
  ) {
    return NextResponse.json(
      { error: 'perceived_effort must be an integer between 1 and 10' },
      { status: 422 }
    )
  }

  const { data: activity } = await supabase
    .from('rt_activities')
    .select('id')
    .eq('id', activity_id)
    .eq('user_id', userId)
    .maybeSingle()

  if (!activity) {
    return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
  }

  const activityUpdates = {}
  if (perceived_effort != null) activityUpdates.perceived_effort = perceived_effort
  if (user_note != null) activityUpdates.user_note = String(user_note).slice(0, 500)
  if (Object.keys(activityUpdates).length > 0) {
    await supabase
      .from('rt_activities')
      .update(activityUpdates)
      .eq('id', activity_id)
      .eq('user_id', userId)
  }

  // Fire-and-forget — don't block the response waiting for Inngest to acknowledge
  inngest
    .send({
      name: 'ai/generate-post-activity-insight',
      data: {
        activityId: activity_id,
        userId,
        focus,
        perceivedEffort: perceived_effort ?? null,
        userNote: user_note ? String(user_note).slice(0, 500) : null,
      },
    })
    .catch((err) => {
      console.error('[ai/insights/generate] Failed to queue insight:', err.message)
    })

  return NextResponse.json({ queued: true, message: 'Analisis sedang diproses' })
}
