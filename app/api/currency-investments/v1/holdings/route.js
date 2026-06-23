import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrencyHoldings } from '@/lib/services/currencyInvestment/getCurrencyHoldings'

export async function GET() {
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

    const holdings = await getCurrencyHoldings(supabase, user.id)
    return NextResponse.json({ data: holdings, message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[currency-investments/holdings]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
