import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { favoriteEvent } from '@/lib/services/event/favoriteEvent'

export async function PATCH(req, { params }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { is_favorite } = await req.json()

    await favoriteEvent(user.id, id, is_favorite)

    return NextResponse.json(
      { success: true, message: 'Event favorite status updated' },
      { status: 200 }
    )
  } catch (err) {
    console.error('PATCH /api/event/v1/event/favorite error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
