import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { inngest } from '@/lib/inngest/client'

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

    const { activity_id, focus = 'general' } = body
    if (!activity_id) {
      return NextResponse.json({ error: 'activity_id required' }, { status: 422 })
    }

    const { data: activity } = await supabase
      .from('rt_activities')
      .select('id')
      .eq('id', activity_id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
    }

    // Fire-and-forget — don't block the response waiting for Inngest to acknowledge
    inngest
      .send({
        name: 'ai/generate-post-activity-insight',
        data: { activityId: activity_id, userId: user.id, focus },
      })
      .catch((err) => {
        console.error('[ai/insights/generate] Failed to queue insight:', err.message)
      })

    return NextResponse.json({ queued: true, message: 'Analisis sedang diproses' })
  } catch (err) {
    console.error('[ai/insights/generate POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
