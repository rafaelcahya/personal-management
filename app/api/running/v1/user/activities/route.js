import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(request) {
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

    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Bad request', message: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    if (body.confirmation !== 'DELETE') {
      return NextResponse.json(
        { error: 'Validation failed', message: 'Type DELETE to confirm' },
        { status: 400 }
      )
    }

    const { data, error: deleteError } = await supabase
      .from('rt_activities')
      .delete()
      .eq('user_id', user.id)
      .select('id')

    if (deleteError) throw deleteError

    return NextResponse.json(
      { data: { deleted: data?.length ?? 0 }, message: 'All activity data deleted' },
      { status: 200 }
    )
  } catch (err) {
    console.error('[running/user/activities DELETE]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
