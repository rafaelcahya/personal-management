import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRunningHighlights } from '@/lib/services/home/getRunningHighlights'

export async function GET(request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const rawTz = parseInt(searchParams.get('tz_offset') ?? '0', 10)
    // Clamp to the real-world TZ range (±14h) so malformed input can't skew date math.
    const tzOffset = isNaN(rawTz) ? 0 : Math.max(-840, Math.min(840, rawTz))
    const tzOffsetMs = tzOffset * 60 * 1000

    const data = await getRunningHighlights(user.id, tzOffsetMs)
    return NextResponse.json({ data }, { status: 200 })
  } catch (err) {
    console.error('[home/running GET]', err)
    return NextResponse.json({ error: 'Failed to load running highlights' }, { status: 500 })
  }
}
