import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { detectMaxHr } from '@/lib/services/running/user/detectMaxHr'

export async function GET() {
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

    const maxHr = await detectMaxHr(user.id)

    return NextResponse.json({ data: { max_hr: maxHr }, message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[running/user/max-hr-detect GET]', err.message)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
