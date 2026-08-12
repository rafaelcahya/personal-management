import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getDailyPnl } from '@/lib/services/trade/getDailyPnl'
import { dailyPnlQuerySchema } from '@/schemas/trade'

export async function GET(req) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const parsed = dailyPnlQuerySchema.safeParse({
      year: searchParams.get('year'),
      month: searchParams.get('month'),
    })

    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => i.message)
      return NextResponse.json({ success: false, error: errors }, { status: 400 })
    }

    const { year, month } = parsed.data
    const data = await getDailyPnl(supabase, user.id, year, month)
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('GET /api/trade/v1/trade/daily-pnl error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
