import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getActivities } from '@/lib/services/running/activities/getActivities'
import { createActivity } from '@/lib/services/running/activities/createActivity'
import { createActivitySchema } from '@/schemas/runningManualEntry'

const MAX_LIMIT = 100
const DEFAULT_LIMIT = 20

export async function GET(request) {
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

    const VALID_SORTS = ['newest', 'oldest', 'longest', 'fastest']
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from') ?? undefined
    const to = searchParams.get('to') ?? undefined
    const type = searchParams.get('type') ?? undefined
    const rawSort = searchParams.get('sort') ?? 'newest'
    const sort = VALID_SORTS.includes(rawSort) ? rawSort : 'newest'
    const page = parseInt(searchParams.get('page') ?? '1', 10) || 1
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)
    )

    const result = await getActivities(user.id, { from, to, type, sort, page, limit })

    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.error('[running/activities GET]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
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
        { error: 'Validation failed', message: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const parsed = createActivitySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 422 }
      )
    }

    const result = await createActivity(user.id, parsed.data)

    if (result.duplicate) {
      return NextResponse.json(
        { error: 'Potential duplicate', existing: { started_at: result.existing.started_at } },
        { status: 409 }
      )
    }

    return NextResponse.json({ data: result.data }, { status: 201 })
  } catch (err) {
    console.error('[running/activities POST]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
