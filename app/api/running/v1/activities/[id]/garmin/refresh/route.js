import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { refreshGarminMetrics } from '@/lib/services/running/garmin/refreshGarminMetrics'
import { garminErrorResponse } from '@/lib/services/running/garmin/garminErrorResponse'

export async function POST(_request, { params }) {
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

    if (!z.uuid().safeParse(id).success) {
      return NextResponse.json(
        { error: 'Not found', message: 'Activity not found' },
        { status: 404 }
      )
    }

    const result = await refreshGarminMetrics(supabase, user.id, id)

    if (!result) {
      return NextResponse.json(
        { error: 'Not found', message: 'Activity not found' },
        { status: 404 }
      )
    }

    if (!result.garmin) {
      return NextResponse.json(
        { error: 'Not found', message: 'No matching Garmin activity' },
        { status: 404 }
      )
    }

    return NextResponse.json({ garmin: result.garmin }, { status: 200 })
  } catch (err) {
    const garminResponse = garminErrorResponse(err)
    if (garminResponse) return garminResponse
    console.error('[running/activities/:id/garmin/refresh POST]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
