import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getForexRates } from '@/lib/services/forex/getForexRates'
import { forexRatesQuerySchema } from '@/schemas/currencyInvestment'

const DEFAULT_SYMBOLS = ['USD', 'CHF', 'JPY', 'SGD', 'AUD']

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
    const parsed = forexRatesQuerySchema.safeParse(Object.fromEntries(searchParams))

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid query', message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const symbolsRaw = parsed.data.symbols
    const currencies = symbolsRaw
      ? symbolsRaw
          .split(',')
          .map((s) => s.trim().toUpperCase())
          .filter(Boolean)
      : DEFAULT_SYMBOLS

    const { rates, fetchedAt } = await getForexRates(currencies)
    return NextResponse.json({ data: rates, fetchedAt, message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[forex/rates]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
