import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { upsertRunnerProfile } from '@/lib/services/running/user/upsertRunnerProfile'
import { biometricSchema } from '@/schemas/runningOnboarding'

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

    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Validation failed', message: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const parsed = biometricSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const profile = await upsertRunnerProfile(user.id, user.email, parsed.data)

    return NextResponse.json({ data: profile, message: 'Biometric data saved' }, { status: 200 })
  } catch (err) {
    console.error('[running/onboarding/biometric]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
