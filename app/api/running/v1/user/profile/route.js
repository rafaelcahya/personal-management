import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { profilePatchSchema } from '@/schemas/runningUser'

// Full profile fields used by Settings page and PATCH response.
// RacingWeightSection only needs weight_kg + height_cm — accepted as-is for a single-user app.
const PROFILE_FIELDS =
  'id, email, display_name, birth_date, height_cm, weight_kg, max_hr, resting_hr_baseline, sex, threshold_pace_sec'

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
      .from('rt_users')
      .select(PROFILE_FIELDS)
      .eq('id', user.id)
      .maybeSingle()

    if (!row) {
      return NextResponse.json(
        { error: 'Not found', message: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: row, message: 'OK' }, { status: 200 })
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
        { error: 'Bad request', message: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    const parsed = profilePatchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 }
      )
    }

    const { data: updated, error: updateError } = await supabase
      .from('rt_users')
      .update(parsed.data)
      .eq('id', user.id)
      .select(PROFILE_FIELDS)
      .single()

    if (updateError) throw updateError

    return NextResponse.json({ data: updated, message: 'Profile updated' }, { status: 200 })
  } catch (err) {
    console.error('[running/user/profile PATCH]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
