import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { deleteFee } from '@/lib/services/fee/deleteFee'

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

    if (!id || isNaN(id) || parseInt(id) <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid fee ID format' }, { status: 400 })
    }

    await deleteFee(user.id, id)

    return NextResponse.json(
      { success: true, message: 'Fee deleted successfully' },
      { status: 200 }
    )
  } catch (err) {
    console.error('DELETE /api/trade/v1/fee/delete error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
