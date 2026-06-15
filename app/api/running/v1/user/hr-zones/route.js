import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const patchSchema = z.object({
  max_hr: z.number().int().min(60).max(250).nullable().optional(),
  resting_hr_baseline: z.number().int().min(30).max(120).nullable().optional(),
  threshold_hr: z.number().int().min(100).max(220).nullable().optional(),
  hr_zones_method: z.enum(['max_hr', 'karvonen', 'threshold']).optional(),
})

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

    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 422 }
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
