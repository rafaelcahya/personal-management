import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCurrencyInvestment } from '@/lib/services/currencyInvestment/createCurrencyInvestment'
import { createCurrencyInvestmentSchema } from '@/schemas/currencyInvestment'

export async function POST(request) {
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

    const body = await request.json()
    const parsed = createCurrencyInvestmentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const investment = await createCurrencyInvestment(supabase, user.id, parsed.data)
    return NextResponse.json(
      { data: investment, message: 'Investment created successfully' },
      { status: 201 }
    )
  } catch (err) {
    console.error('[currency-investments/create]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
