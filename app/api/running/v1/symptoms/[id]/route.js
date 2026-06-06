import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { archiveSymptomSchema } from '@/schemas/runningSymptoms'

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
    const parsed = archiveSymptomSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { data: existing } = await supabase
      .from('rt_symptom_logs')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (!existing) {
      return NextResponse.json(
        { error: 'Not found', message: 'Symptom log not found' },
        { status: 404 }
      )
    }

    const { data, error } = await supabase
      .from('rt_symptom_logs')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id, body_region, pain_level, archived_at')
      .single()

    if (error) throw new Error(error.message)

    return NextResponse.json({ data, message: 'Symptom log archived' }, { status: 200 })
  } catch (err) {
    console.error('[running/symptoms/:id PATCH]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
