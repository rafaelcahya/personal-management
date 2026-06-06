import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getActiveSymptomLogs, createSymptomLog } from '@/lib/services/running/symptoms/symptomLog'
import { createSymptomLogSchema } from '@/schemas/runningSymptoms'

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

    const logs = await getActiveSymptomLogs(supabase, user.id)
    return NextResponse.json({ data: logs, message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[running/symptoms GET]', err)
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
    const parsed = createSymptomLogSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const log = await createSymptomLog(supabase, user.id, parsed.data)
    return NextResponse.json({ data: log, message: 'Symptom log created' }, { status: 201 })
  } catch (err) {
    console.error('[running/symptoms POST]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
