import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { savePushSubscription } from '@/lib/services/running/notifications/pushSubscriptionService'
import { getPushStatus } from '@/lib/services/running/notifications/getPushStatus'
import { savePushSubscriptionSchema } from '@/schemas/pushNotification'

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

    const status = await getPushStatus(supabase, user.id)
    return NextResponse.json({ data: status, message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[running/user/push-subscription GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

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
        { error: 'Bad request', message: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    const parsed = savePushSubscriptionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }
    const subscription = parsed.data.subscription

    const result = await savePushSubscription(supabase, user.id, subscription ?? null)

    return NextResponse.json(
      {
        data: { ...result, user_id: user.id },
        message: subscription ? 'Push subscription saved' : 'Push subscription cleared',
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('[running/user/push-subscription POST]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
