import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateFee } from '@/lib/services/fee/updateFee'

export async function PUT(req, { params }) {
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

    if (!id || isNaN(id) || parseInt(id) <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid fee ID format' }, { status: 400 })
    }

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, error: ['Request body cannot be empty'] },
        { status: 400 }
      )
    }

    const updatedFee = await updateFee(user.id, id, body)

    return NextResponse.json({ success: true, fee: updatedFee }, { status: 200 })
  } catch (err) {
    console.error('PUT /api/trade/v1/fee/update error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
