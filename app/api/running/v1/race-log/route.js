import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRaceLogs } from '@/lib/services/running/raceLog/getRaceLogs'
import { createRaceLog } from '@/lib/services/running/raceLog/createRaceLog'
import { createRaceLogSchema } from '@/schemas/raceLog'

const MAX_LIMIT = 100
const DEFAULT_LIMIT = 15
const VALID_BUCKETS = ['5k', '10k', '21k', '42k', 'other']

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
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)
    )
    const search = searchParams.get('search') || undefined
    const rawBucket = searchParams.get('distance_bucket') || undefined
    const distance_bucket = rawBucket && VALID_BUCKETS.includes(rawBucket) ? rawBucket : undefined

    const result = await getRaceLogs(supabase, user.id, { page, limit, search, distance_bucket })
    return NextResponse.json({ ...result, message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[running/race-log GET]', err)
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

    const body = await request.json()
    const parsed = createRaceLogSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const entry = await createRaceLog(supabase, user.id, parsed.data)
    return NextResponse.json({ data: entry, message: 'Race log created' }, { status: 201 })
  } catch (err) {
    console.error('[running/race-log POST]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
