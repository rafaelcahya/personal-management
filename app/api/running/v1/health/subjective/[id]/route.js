import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { patchSubjectiveHealthSchema } from '@/schemas/runningManualEntry'

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

    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Validation failed', message: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const parsed = patchSubjectiveHealthSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 422 }
      )
    }

    const { data: existing, error: fetchError } = await supabase
      .from('rt_subjective_health_logs')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (fetchError) throw fetchError

    if (!existing) {
      return NextResponse.json(
        { error: 'Not found', message: 'Health log not found' },
        { status: 404 }
      )
    }

    const { data: updated, error: updateError } = await supabase
      .from('rt_subjective_health_logs')
      .update(parsed.data)
      .eq('id', id)
      .eq('user_id', user.id)
      .select(
        'id, log_date, sleep_hours, sleep_quality, morning_energy, mood, soreness_level, manual_rhr, notes, created_at'
      )
      .single()

    if (updateError) throw updateError

    return NextResponse.json({ data: updated }, { status: 200 })
  } catch (err) {
    console.error('[running/health/subjective/:id PATCH]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function DELETE(_request, { params }) {
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

    const { data: existing, error: fetchError } = await supabase
      .from('rt_subjective_health_logs')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (fetchError) throw fetchError

    if (!existing) {
      return NextResponse.json(
        { error: 'Not found', message: 'Health log not found' },
        { status: 404 }
      )
    }

    const { error: deleteError } = await supabase
      .from('rt_subjective_health_logs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (deleteError) throw deleteError

    return new Response(null, { status: 204 })
  } catch (err) {
    console.error('[running/health/subjective/:id DELETE]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
