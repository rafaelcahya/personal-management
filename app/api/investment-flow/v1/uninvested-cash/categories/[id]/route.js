import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateCashCategory } from '@/lib/services/investmentFlow/updateCashCategory'
import { deleteCashCategory } from '@/lib/services/investmentFlow/deleteCashCategory'
import { updateCashCategorySchema, deleteCashCategoryQuerySchema } from '@/schemas/investmentFlow'
import { UNEXPECTED_ERROR_MESSAGE } from '@/lib/services/investmentFlow/errorMessages'

async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  return { user: error ? null : user }
}

// ── PUT /api/investment-flow/v1/uninvested-cash/categories/:id ─────
export async function PUT(request, { params }) {
  try {
    const { user } = await getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const idParsed = deleteCashCategoryQuerySchema.safeParse({ id: params.id })
    if (!idParsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid category ID' }, { status: 400 })
    }

    const body = await request.json()
    const parsed = updateCashCategorySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.errors },
        { status: 400 }
      )
    }

    const category = await updateCashCategory(user.id, params.id, parsed.data)
    return NextResponse.json({ success: true, data: { category } }, { status: 200 })
  } catch (err) {
    if (err.code === 'NOT_FOUND') {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 })
    }
    console.error('[uninvested-cash/categories/[id]/PUT]', err)
    return NextResponse.json({ success: false, error: UNEXPECTED_ERROR_MESSAGE }, { status: 500 })
  }
}

// ── DELETE /api/investment-flow/v1/uninvested-cash/categories/:id ──
export async function DELETE(request, { params }) {
  try {
    const { user } = await getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const idParsed = deleteCashCategoryQuerySchema.safeParse({ id: params.id })
    if (!idParsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid category ID' }, { status: 400 })
    }

    await deleteCashCategory(user.id, params.id)
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[uninvested-cash/categories/[id]/DELETE]', err)
    return NextResponse.json({ success: false, error: UNEXPECTED_ERROR_MESSAGE }, { status: 500 })
  }
}
