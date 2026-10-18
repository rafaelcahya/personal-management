import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { deleteAllActivities } from '@/lib/services/running/user/deleteAllActivities'
import { invalidateRunningAnalytics } from '@/lib/services/running/analyticsCache'
import { deleteActivitiesSchema } from '@/schemas/runningUser'

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

    const parsed = deleteActivitiesSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'Type DELETE to confirm',
          issues: parsed.error.issues,
        },
        { status: 400 }
      )
    }

    const deleted = await deleteAllActivities(supabase, user.id)
    invalidateRunningAnalytics(user.id)

    return NextResponse.json(
      { data: { deleted }, message: 'All activity data deleted' },
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
