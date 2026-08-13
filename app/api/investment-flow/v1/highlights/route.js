import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getHighlights } from '@/lib/services/investmentFlow/getHighlights'
import { updateHighlights } from '@/lib/services/investmentFlow/updateHighlights'
import { updateHighlightsSchema } from '@/schemas/investmentFlow'
import { UNEXPECTED_ERROR_MESSAGE } from '@/lib/services/investmentFlow/errorMessages'

// ── GET /api/investment-flow/v1/highlights ─────────────────────
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

    const highlights = await getHighlights(user.id)
    return NextResponse.json({ success: true, data: { highlights } }, { status: 200 })
  } catch (err) {
    console.error('[investment-flow/highlights/GET]', err)
    return NextResponse.json({ success: false, error: UNEXPECTED_ERROR_MESSAGE }, { status: 500 })
  }
}

// ── PATCH /api/investment-flow/v1/highlights ───────────────────
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
    const parsed = updateHighlightsSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.errors },
        { status: 400 }
      )
    }

    const highlights = await updateHighlights(user.id, parsed.data.highlights)
    return NextResponse.json({ success: true, data: { highlights } }, { status: 200 })
  } catch (err) {
    console.error('[investment-flow/highlights/PATCH]', err)
    return NextResponse.json({ success: false, error: UNEXPECTED_ERROR_MESSAGE }, { status: 500 })
  }
}
