import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { deleteCurrencyInvestment } from '@/lib/services/currencyInvestment/deleteCurrencyInvestment'

export async function DELETE(_request, { params }) {
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

    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Validation failed', message: 'Investment ID is required' },
        { status: 400 }
      )
    }

    const deleted = await deleteCurrencyInvestment(supabase, user.id, id)

    if (!deleted) {
      return NextResponse.json(
        { error: 'Not found', message: 'Investment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Investment deleted successfully' }, { status: 200 })
  } catch (err) {
    console.error('[currency-investments/delete]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
