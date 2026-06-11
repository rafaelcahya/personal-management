import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { upsertRunnerSettings } from '@/lib/services/running/user/upsertRunnerProfile'

const SETTINGS_FIELDS =
  'user_id, hr_zones_method, threshold_hr, notify_post_activity, notify_weekly_review, notify_friday_prep, notify_anomaly, notify_race_reminder, push_notifications_enabled'

const DEFAULT_SETTINGS = {
  hr_zones_method: 'max_hr',
  threshold_hr: null,
  notify_post_activity: true,
  notify_weekly_review: true,
  notify_friday_prep: true,
  notify_anomaly: true,
  notify_race_reminder: true,
}

const patchSchema = z.object({
  hr_zones_method: z.enum(['max_hr', 'karvonen', 'threshold']).optional(),
  threshold_hr: z.number().int().min(100).max(220).nullable().optional(),
  notify_post_activity: z.boolean().optional(),
  notify_weekly_review: z.boolean().optional(),
  notify_friday_prep: z.boolean().optional(),
  notify_anomaly: z.boolean().optional(),
  notify_race_reminder: z.boolean().optional(),
})

export async function GET() {
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

    const { data: row } = await supabase
      .from('rt_user_settings')
      .select(SETTINGS_FIELDS)
      .eq('user_id', user.id)
      .maybeSingle()

    if (!row) {
      return NextResponse.json({ data: DEFAULT_SETTINGS, message: 'OK' }, { status: 200 })
    }

    return NextResponse.json({ data: row, message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[running/user/settings GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function PATCH(request) {
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

    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Bad request', message: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 422 }
      )
    }

    const result = await upsertRunnerSettings(user.id, parsed.data)

    return NextResponse.json({ data: result, message: 'Settings updated' }, { status: 200 })
  } catch (err) {
    console.error('[running/user/settings PATCH]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
