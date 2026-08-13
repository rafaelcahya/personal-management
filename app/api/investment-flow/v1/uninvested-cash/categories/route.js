import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { listCashCategories } from '@/lib/services/investmentFlow/listCashCategories'
import { createCashCategory } from '@/lib/services/investmentFlow/createCashCategory'
import { createCashCategorySchema } from '@/schemas/investmentFlow'
import { UNEXPECTED_ERROR_MESSAGE } from '@/lib/services/investmentFlow/errorMessages'

async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  return { user: error ? null : user }
}

// ── GET /api/investment-flow/v1/uninvested-cash/categories ─────────
export async function GET() {
  try {
    const { user } = await getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const categories = await listCashCategories(user.id)
    return NextResponse.json({ success: true, data: { categories } }, { status: 200 })
  } catch (err) {
    console.error('[uninvested-cash/categories/GET]', err)
    return NextResponse.json({ success: false, error: UNEXPECTED_ERROR_MESSAGE }, { status: 500 })
  }
}

// ── POST /api/investment-flow/v1/uninvested-cash/categories ────────
export async function POST(request) {
  try {
    const { user } = await getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const parsed = createCashCategorySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.errors },
        { status: 400 }
      )
    }

    const category = await createCashCategory(user.id, parsed.data)
    return NextResponse.json({ success: true, data: { category } }, { status: 201 })
  } catch (err) {
    console.error('[uninvested-cash/categories/POST]', err)
    return NextResponse.json({ success: false, error: UNEXPECTED_ERROR_MESSAGE }, { status: 500 })
  }
}
