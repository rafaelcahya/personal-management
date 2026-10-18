import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getNotificationPreferences } from '@/lib/services/notifications/getNotificationPreferences'
import { updateNotificationPreference } from '@/lib/services/notifications/updateNotificationPreference'
import { updatePreferenceSchema } from '@/schemas/pushNotification'

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

    const preferences = await getNotificationPreferences(supabase, user.id)
    return NextResponse.json({ data: preferences, message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[notifications/preferences GET]', err)
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

    const parsed = updatePreferenceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const preference = await updateNotificationPreference(supabase, user.id, parsed.data)
    return NextResponse.json({ data: preference, message: 'Preference updated' }, { status: 200 })
  } catch (err) {
    console.error('[notifications/preferences PATCH]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
