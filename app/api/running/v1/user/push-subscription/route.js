import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { savePushSubscription } from '@/lib/services/running/notifications/pushSubscriptionService'

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

    // subscription is null when disabling push notifications
    const { subscription } = body

    if (subscription !== null && subscription !== undefined) {
      if (
        typeof subscription !== 'object' ||
        !subscription.endpoint ||
        typeof subscription.keys?.p256dh !== 'string' ||
        !subscription.keys.p256dh ||
        typeof subscription.keys?.auth !== 'string' ||
        !subscription.keys.auth
      ) {
        return NextResponse.json(
          { error: 'Validation failed', message: 'Invalid push subscription object' },
          { status: 400 }
        )
      }
    }

    const result = await savePushSubscription(supabase, user.id, subscription ?? null)

    return NextResponse.json(
      {
        data: result,
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
