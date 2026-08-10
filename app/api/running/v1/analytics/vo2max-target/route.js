import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getVo2maxTarget } from '@/lib/services/running/analytics/getVo2maxTarget'
import { updateVo2maxTarget } from '@/lib/services/running/analytics/updateVo2maxTarget'
import { vo2maxTargetSchema } from '@/schemas/vo2maxTarget'

async function getAuthenticatedUser(supabase) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

export async function GET() {
  try {
    const supabase = await createClient()
    const user = await getAuthenticatedUser(supabase)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const data = await getVo2maxTarget(supabase, user.id)
    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (err) {
    console.error('[running/analytics/vo2max-target GET]', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const supabase = await createClient()
    const user = await getAuthenticatedUser(supabase)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
    }
    const parsed = vo2maxTargetSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.errors },
        { status: 400 }
      )
    }

    const data = await updateVo2maxTarget(supabase, user.id, parsed.data.vo2max_target)
    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (err) {
    console.error('[running/analytics/vo2max-target PUT]', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
