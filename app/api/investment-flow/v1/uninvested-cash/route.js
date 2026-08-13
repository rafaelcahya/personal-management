import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUninvestedCash } from '@/lib/services/investmentFlow/getUninvestedCash'
import { updateUninvestedCash } from '@/lib/services/investmentFlow/updateUninvestedCash'
import { updateUninvestedCashSchema } from '@/schemas/investmentFlow'
import { UNEXPECTED_ERROR_MESSAGE } from '@/lib/services/investmentFlow/errorMessages'

// ── GET /api/investment-flow/v1/uninvested-cash ────────────────
// Returns the authenticated user's uninvested cash amount (0 if unset).
export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const uninvestedCash = await getUninvestedCash(user.id)
    return NextResponse.json({ success: true, data: { uninvestedCash } }, { status: 200 })
  } catch (err) {
    console.error('[investment-flow/uninvested-cash/GET]', err)
    return NextResponse.json({ success: false, error: UNEXPECTED_ERROR_MESSAGE }, { status: 500 })
  }
}

// ── PATCH /api/investment-flow/v1/uninvested-cash ───────────────
// Sets the authenticated user's uninvested cash amount.
export async function PATCH(request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = updateUninvestedCashSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.errors },
        { status: 400 }
      )
    }

    const uninvestedCash = await updateUninvestedCash(user.id, parsed.data.amount)
    return NextResponse.json({ success: true, data: { uninvestedCash } }, { status: 200 })
  } catch (err) {
    console.error('[investment-flow/uninvested-cash/PATCH]', err)
    return NextResponse.json({ success: false, error: UNEXPECTED_ERROR_MESSAGE }, { status: 500 })
  }
}
