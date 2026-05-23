import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  getSubjectiveHealth,
  upsertSubjectiveHealth,
} from '@/lib/services/running/health/subjectiveHealth'
import { createSubjectiveHealthSchema } from '@/schemas/runningManualEntry'

const MAX_LIMIT = 100
const DEFAULT_LIMIT = 30

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

    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from') ?? undefined
    const to = searchParams.get('to') ?? undefined
    const page = parseInt(searchParams.get('page') ?? '1', 10) || 1
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)
    )

    const result = await getSubjectiveHealth(user.id, { from, to, page, limit })

    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.error('[running/health/subjective GET]', err)
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

    const parsed = createSubjectiveHealthSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 422 }
      )
    }

    const row = await upsertSubjectiveHealth(user.id, parsed.data)

    return NextResponse.json({ data: row }, { status: 200 })
  } catch (err) {
    console.error('[running/health/subjective POST]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
