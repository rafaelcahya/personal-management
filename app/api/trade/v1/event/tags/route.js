import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getEventTags } from '@/lib/services/event/getEventTags'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Unauthorized' }, { status: 401 })
    }

    const tags = await getEventTags(user.id)

    return NextResponse.json({ tags }, { status: 200 })
  } catch (err) {
    console.error('GET /api/trade/v1/event/tags error:', err)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
