import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { garminSyncSchema, resolveGarminSyncRange } from '@/schemas/runningGarmin'
import { getGarminConnection } from '@/lib/services/running/garmin/getGarminConnection'
import { queueGarminSync } from '@/lib/services/running/garmin/queueGarminSync'
import { jobsUnavailableResponse } from '@/lib/inngest/sendEvent'

export async function POST(request) {
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

    // The body is optional: no body means the default last 7 days
    let body = {}
    const raw = await request.text()
    if (raw.trim()) {
      try {
        body = JSON.parse(raw)
      } catch {
        return NextResponse.json(
          { error: 'Validation failed', message: 'Invalid JSON in request body' },
          { status: 400 }
        )
      }
    }

    const parsed = garminSyncSchema.safeParse(body ?? {})
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: parsed.error.issues[0]?.message ?? 'Invalid request',
          issues: parsed.error.issues,
        },
        { status: 400 }
      )
    }

    const connection = await getGarminConnection(supabase, user.id)
    if (connection.status === 'not_connected') {
      return NextResponse.json(
        { error: 'Conflict', message: 'Garmin is not connected' },
        { status: 409 }
      )
    }
    if (connection.status !== 'connected') {
      return NextResponse.json(
        { error: 'Conflict', message: 'Garmin key is expired or invalid' },
        { status: 409 }
      )
    }

    const range = resolveGarminSyncRange(parsed.data)
    const { queued } = await queueGarminSync(user.id, range, 'manual')
    if (!queued) {
      return NextResponse.json(
        { error: 'Too many requests', message: 'A Garmin sync is already running' },
        { status: 429 }
      )
    }

    return NextResponse.json({ queued: true, ...range }, { status: 202 })
  } catch (err) {
    const unavailable = jobsUnavailableResponse(err)
    if (unavailable) return unavailable
    console.error('[running/sync/garmin POST]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
