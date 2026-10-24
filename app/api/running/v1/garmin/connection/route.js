import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { saveGarminConnectionSchema } from '@/schemas/runningGarmin'
import { getGarminConnection } from '@/lib/services/running/garmin/getGarminConnection'
import { saveGarminConnection } from '@/lib/services/running/garmin/saveGarminConnection'
import { deleteGarminConnection } from '@/lib/services/running/garmin/deleteGarminConnection'
import { queueGarminSync } from '@/lib/services/running/garmin/queueGarminSync'
import { garminErrorResponse } from '@/lib/services/running/garmin/garminErrorResponse'

const UNAUTHORIZED = { error: 'Unauthorized', message: 'Authentication required' }
const SERVER_ERROR = { error: 'Internal server error', message: 'Something went wrong' }

async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  return { supabase, user: error ? null : user }
}

export async function GET() {
  try {
    const { supabase, user } = await getUser()
    if (!user) return NextResponse.json(UNAUTHORIZED, { status: 401 })

    const connection = await getGarminConnection(supabase, user.id)
    return NextResponse.json(connection, { status: 200 })
  } catch (err) {
    console.error('[running/garmin/connection GET]', err)
    return NextResponse.json(SERVER_ERROR, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const { user } = await getUser()
    if (!user) return NextResponse.json(UNAUTHORIZED, { status: 401 })

    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Validation failed', message: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const parsed = saveGarminConnectionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: parsed.error.issues[0]?.message ?? 'Invalid request',
          issues: parsed.error.issues,
        },
        { status: 400 }
      )
    }

    const { connection, catchUp } = await saveGarminConnection(user.id, parsed.data)

    if (catchUp) {
      // The key is already saved, so a failed catch-up must not turn into an error for the user.
      try {
        await queueGarminSync(user.id, catchUp, 'reconnect')
      } catch (err) {
        console.error('[running/garmin/connection PUT] catch-up not queued', err?.message)
      }
    }

    return NextResponse.json(connection, { status: 200 })
  } catch (err) {
    const garminResponse = garminErrorResponse(err, { savingKey: true })
    if (garminResponse) return garminResponse
    console.error('[running/garmin/connection PUT]', err)
    return NextResponse.json(SERVER_ERROR, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const { user } = await getUser()
    if (!user) return NextResponse.json(UNAUTHORIZED, { status: 401 })

    await deleteGarminConnection(user.id)
    return new Response(null, { status: 204 })
  } catch (err) {
    console.error('[running/garmin/connection DELETE]', err)
    return NextResponse.json(SERVER_ERROR, { status: 500 })
  }
}
