// GET /api/running/v1/user/profile → fetch profile + biometric fields
// PATCH /api/running/v1/user/profile → partial update of profile + biometric fields

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const PROFILE_FIELDS =
  'display_name, birth_date, height_cm, weight_kg, max_hr, resting_hr_baseline, sex'

const patchProfileSchema = z.object({
  display_name: z.string().min(1).max(100).optional(),
  birth_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'birth_date must be in YYYY-MM-DD format')
    .optional()
    .nullable(),
  height_cm: z.number().min(50).max(300).optional().nullable(),
  weight_kg: z.number().min(20).max(500).optional().nullable(),
  max_hr: z.number().int().min(60).max(250).optional().nullable(),
  resting_hr_baseline: z.number().int().min(20).max(150).optional().nullable(),
  sex: z.enum(['male', 'female']).optional().nullable(),
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

    const { data, error } = await supabase
      .from('rt_users')
      .select(PROFILE_FIELDS)
      .eq('id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('[running/user/profile GET]', error)
      return NextResponse.json(
        { error: 'Internal server error', message: 'Something went wrong' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: data ?? {} }, { status: 200 })
  } catch (err) {
    console.error('[running/user/profile GET]', err)
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
        { error: 'Validation failed', message: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const parsed = patchProfileSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 422 }
      )
    }

    const { data, error } = await supabase
      .from('rt_users')
      .upsert({ id: user.id, ...parsed.data }, { onConflict: 'id' })
      .select(PROFILE_FIELDS)
      .single()

    if (error) {
      console.error('[running/user/profile PATCH]', error)
      return NextResponse.json(
        { error: 'Internal server error', message: 'Something went wrong' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (err) {
    console.error('[running/user/profile PATCH]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
