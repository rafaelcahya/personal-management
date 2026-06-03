import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { inngest } from '@/lib/inngest/client'

export async function POST(req) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let force = false
    try {
      const body = await req.json()
      force = body?.force === true
    } catch {
      // body is optional; default force to false
    }

    if (!force) {
      const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      const { data: recent } = await supabase
        .from('rt_ai_insights')
        .select('id')
        .eq('user_id', user.id)
        .eq('insight_type', 'daily')
        .gte('created_at', since)
        .limit(1)
        .maybeSingle()

      if (recent) {
        return NextResponse.json(
          { error: 'Daily insight already generated recently. Try again later.' },
          { status: 429 }
        )
      }
    }

    try {
      await inngest.send({
        name: 'ai/generate-daily-insight',
        data: { userId: user.id, force },
      })
    } catch (err) {
      console.error('[ai/insights/daily] Failed to queue daily insight:', err.message)
      return NextResponse.json({ error: 'Failed to queue insight' }, { status: 500 })
    }

    return NextResponse.json({ queued: true, message: 'Daily insight queued' })
  } catch (err) {
    console.error('[ai/insights/daily POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
