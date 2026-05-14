import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
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

    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json({ error: 'LOGOUT_FAILED', message: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'LOGOUT_FAILED', message: err.message }, { status: 500 })
  }
}
