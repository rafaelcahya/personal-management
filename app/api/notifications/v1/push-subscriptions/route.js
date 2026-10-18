import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getServerUser } from '@/lib/supabase/getServerUser'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPushStatus } from '@/lib/services/notifications/getPushStatus'
import { savePushDevice } from '@/lib/services/notifications/savePushDevice'
import { savePushDeviceSchema } from '@/schemas/pushNotification'

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
    console.error('[notifications/push-subscriptions GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const supabase = await createClient()
    // A subscription outlives the token, so confirm the session with the Auth server.
    const { user, error: authError } = await getServerUser(supabase)
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

    const parsed = savePushDeviceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    // user_id comes from the session, never the body; the admin client is only here so an
    // endpoint that was registered under another account can move to this one.
    const device = await savePushDevice(
      createAdminClient(),
      user.id,
      parsed.data.subscription,
      request.headers.get('user-agent')
    )
    if (device.conflict) {
      return NextResponse.json(
        { error: 'Conflict', message: 'This device is registered to another account' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { data: { ...device, user_id: user.id }, message: 'Device saved' },
      { status: 200 }
    )
  } catch (err) {
    console.error('[notifications/push-subscriptions POST]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
