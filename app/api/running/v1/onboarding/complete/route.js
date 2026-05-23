import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { completeOnboarding } from '@/lib/services/running/user/completeOnboarding'

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

    let body = {}
    try {
      body = await request.json()
    } catch {
      // body kosong OK — goal bersifat opsional
    }

    // Simpan goal kalau ada
    const { goal_type, target_date, target_distance_m, target_time_sec, notes } = body
    if (goal_type) {
      const { error: goalError } = await supabase.from('rt_goals').insert({
        user_id: user.id,
        goal_type,
        target_date: target_date || null,
        target_distance_m: target_distance_m || null,
        target_time_sec: target_time_sec || null,
        notes: notes || null,
        status: 'active',
      })
      if (goalError) console.error('[running/onboarding/complete] goal insert error:', goalError)
    }

    // Mark onboarding_complete = true
    const result = await completeOnboarding(user.id, user.email)

    return NextResponse.json({ data: result, message: 'Onboarding complete' }, { status: 200 })
  } catch (err) {
    console.error('[running/onboarding/complete]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
