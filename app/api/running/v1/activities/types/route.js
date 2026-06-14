import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('rt_activities')
      .select('activity_type')
      .eq('user_id', user.id)
      .not('activity_type', 'is', null)
      .order('activity_type')
      .limit(2000)

    if (error) throw error

    const types = [...new Set(data.map((r) => r.activity_type))]

    return NextResponse.json({ data: types }, { status: 200 })
  } catch (err) {
    console.error('[running/activities/types GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
