import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { listNotificationsQuerySchema } from '@/schemas/notification'
import { getNotifications } from '@/lib/services/notification'

export async function GET(request) {
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

    const { searchParams } = new URL(request.url)
    const parsed = listNotificationsQuerySchema.safeParse({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      status: searchParams.get('status') ?? undefined,
    })
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 422 }
      )
    }

    const result = await getNotifications(supabase, user.id, parsed.data)

    return NextResponse.json({ data: result, message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[notifications GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
