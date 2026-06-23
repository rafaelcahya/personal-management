import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrencyHoldingById } from '@/lib/services/currencyInvestment/getCurrencyHoldingById'

export async function GET(request, { params }) {
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

    const { id: rawId } = await params
    const id = parseInt(rawId, 10)
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: 'Invalid ID', message: 'ID must be a positive integer' },
        { status: 400 }
      )
    }

    const holding = await getCurrencyHoldingById(supabase, user.id, id)
    if (!holding) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(
      { data: { id: holding.id, currency: holding.currency }, message: 'OK' },
      { status: 200 }
    )
  } catch (err) {
    console.error('[currency-investments/holdings/[id]]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
