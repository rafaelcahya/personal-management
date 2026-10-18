import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendTestPush } from '@/lib/services/notifications/sendTestPush'
import { pushTestSchema } from '@/schemas/pushNotification'

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

    const parsed = pushTestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const res = await sendTestPush(supabase, user.id, parsed.data.endpoint)
    if (res.outcome === 'not_found') {
      return NextResponse.json(
        { error: 'Not found', message: 'This device is not subscribed. Turn push on first.' },
        { status: 404 }
      )
    }

    const { sent, expired, statusCode, error: errorCode } = res.result
    return NextResponse.json(
      {
        data: {
          sent,
          expired: !!expired,
          status_code: statusCode ?? null,
          error: errorCode ?? null,
        },
        message: sent ? 'Test notification sent' : 'Test notification failed',
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('[notifications/push-subscriptions/test POST]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
