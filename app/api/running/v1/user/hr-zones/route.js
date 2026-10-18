import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { hrZonesPatchSchema } from '@/schemas/runningUser'

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

    const [{ data: profile }, { data: settings }] = await Promise.all([
      supabase
        .from('rt_users')
        .select('max_hr, resting_hr_baseline, threshold_hr')
        .eq('id', user.id)
        .maybeSingle(),
      supabase
        .from('rt_user_settings')
        .select('hr_zones_method')
        .eq('user_id', user.id)
        .maybeSingle(),
    ])

    return NextResponse.json(
      {
        data: {
          max_hr: profile?.max_hr ?? null,
          resting_hr_baseline: profile?.resting_hr_baseline ?? null,
          threshold_hr: profile?.threshold_hr ?? null,
          hr_zones_method: settings?.hr_zones_method ?? 'max_hr',
        },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('[running/user/hr-zones GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    const parsed = hrZonesPatchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: parsed.error.issues[0]?.message,
          issues: parsed.error.issues,
        },
        { status: 400 }
      )
    }

    const { hr_zones_method, ...profileFields } = parsed.data

    const ops = []

    if (Object.keys(profileFields).length > 0) {
      ops.push(supabase.from('rt_users').update(profileFields).eq('id', user.id))
    }

    if (hr_zones_method !== undefined) {
      ops.push(
        supabase
          .from('rt_user_settings')
          .upsert({ user_id: user.id, hr_zones_method }, { onConflict: 'user_id' })
      )
    }

    const results = await Promise.all(ops)
    for (const { error } of results) {
      if (error) throw error
    }

    return NextResponse.json({ message: 'HR zones updated' }, { status: 200 })
  } catch (err) {
    console.error('[running/user/hr-zones PATCH]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
