import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { markNotificationReadSchema } from '@/schemas/notification'
import { markNotificationRead } from '@/lib/services/notification'

export async function PUT(request) {
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

    const parsed = markNotificationReadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 422 }
      )
    }

    const result = await markNotificationRead(supabase, user.id, parsed.data.id)
    if (!result) {
      return NextResponse.json(
        { error: 'Not found', message: 'Notification not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: result, message: 'Marked as read' }, { status: 200 })
  } catch (err) {
    console.error('[notifications/read PUT]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
