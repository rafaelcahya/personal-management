import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { deletePushDevice } from '@/lib/services/notifications/deletePushDevice'
import { pushDeviceIdSchema } from '@/schemas/pushNotification'

export async function DELETE(_request, { params }) {
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

    const { id } = await params
    const parsed = pushDeviceIdSchema.safeParse(id)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const deleted = await deletePushDevice(supabase, user.id, parsed.data)
    if (!deleted) {
      return NextResponse.json({ error: 'Not found', message: 'Device not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Device removed' }, { status: 200 })
  } catch (err) {
    console.error('[notifications/push-subscriptions DELETE]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
