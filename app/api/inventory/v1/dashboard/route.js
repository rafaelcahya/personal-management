import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getInventoryDashboard } from '@/lib/services/inventory/dashboard/getInventoryDashboard'

const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 10

const rateLimitStore = new Map()

function isRateLimited(userId) {
  const now = Date.now()
  const record = rateLimitStore.get(userId)

  if (!record || now - record.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(userId, { windowStart: now, count: 1 })
    return false
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }

  record.count += 1
  return false
}

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

    if (isRateLimited(user.id)) {
      return NextResponse.json(
        {
          error: 'Too Many Requests',
          message: 'Please wait before requesting dashboard data again',
        },
        { status: 429 }
      )
    }

    const result = await getInventoryDashboard(user.id)

    return NextResponse.json({ success: true, data: result }, { status: 200 })
  } catch (err) {
    console.error('[inventory/dashboard]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
