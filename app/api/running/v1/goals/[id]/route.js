import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateGoal } from '@/lib/services/running/goals/updateGoal'
import { updateGoalSchema } from '@/schemas/raceLog'

export async function PATCH(request, { params }) {
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

    const { id } = await params
    const body = await request.json()
    const parsed = updateGoalSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const goal = await updateGoal(supabase, user.id, id, parsed.data)

    if (!goal) {
      return NextResponse.json({ error: 'Not found', message: 'Goal not found' }, { status: 404 })
    }

    return NextResponse.json({ data: goal, message: 'Goal updated' }, { status: 200 })
  } catch (err) {
    console.error('[running/goals PATCH]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
