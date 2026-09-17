import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getInventoryHighlights } from '@/lib/services/home/getInventoryHighlights'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await getInventoryHighlights(user.id)
    return NextResponse.json({ data }, { status: 200 })
  } catch (err) {
    console.error('[home/inventory GET]', err)
    return NextResponse.json({ error: 'Failed to load inventory highlights' }, { status: 500 })
  }
}
