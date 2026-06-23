import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getForexHistory } from '@/lib/services/forex/getForexHistory'
import { forexHistoryQuerySchema } from '@/schemas/currencyInvestment'

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
    const parsed = forexHistoryQuerySchema.safeParse(Object.fromEntries(searchParams))

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid query', message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { currency, from, to } = parsed.data
    const history = await getForexHistory(currency, from, to)
    return NextResponse.json({ data: history, message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[forex/history]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
