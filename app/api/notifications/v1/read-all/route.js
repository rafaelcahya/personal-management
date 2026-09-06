import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { markAllNotificationsRead } from '@/lib/services/notification'

export async function PUT() {
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

    await markAllNotificationsRead(supabase, user.id)

    return NextResponse.json(
      { data: { success: true }, message: 'All notifications marked as read' },
      { status: 200 }
    )
  } catch (err) {
    console.error('[notifications/read-all PUT]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
