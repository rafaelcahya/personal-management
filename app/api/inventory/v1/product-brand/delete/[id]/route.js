import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { deleteProductBrand } from '@/lib/services/inventory/product_brand/deleteProductBrand'

export async function DELETE(req, { params }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { success: false, error: 'Invalid product brand ID provided' },
        { status: 400 }
      )
    }

    const idNum = Number(id)

    if (idNum <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid product brand ID format' },
        { status: 400 }
      )
    }

    const deletedProductBrand = await deleteProductBrand(idNum, user.id)

    return NextResponse.json({ success: true, data: deletedProductBrand }, { status: 200 })
  } catch (err) {
    console.error('DELETE /api/inventory/v1/product-brand/delete error:', err)

    if (err.status === 409) {
      return NextResponse.json({ success: false, error: err.message }, { status: 409 })
    }

    if (err.message.includes('not found') || err.message.includes('unauthorized')) {
      return NextResponse.json({ success: false, error: err.message }, { status: 404 })
    }

    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
