import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  getSubjectiveHealth,
  upsertSubjectiveHealth,
} from '@/lib/services/running/health/subjectiveHealth'
import { createSubjectiveHealthSchema, healthListQuerySchema } from '@/schemas/runningManualEntry'

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

    const parsedQuery = healthListQuerySchema.safeParse(
      Object.fromEntries(new URL(request.url).searchParams)
    )
    if (!parsedQuery.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsedQuery.error.issues },
        { status: 400 }
      )
    }

    const result = await getSubjectiveHealth(user.id, parsedQuery.data)

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
        { status: 400 }
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
