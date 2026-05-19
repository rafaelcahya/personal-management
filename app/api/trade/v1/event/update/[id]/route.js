import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateEvent } from '@/lib/services/event/updateEvent'

export async function PUT(req, { params }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 })
    }

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: [
            'event date is required',
            'impact direction is required',
            'event description is required',
          ],
        },
        { status: 400 }
      )
    }

    const requiredFields = ['event_date', 'impact_direction', 'event_description']
    const missingFields = requiredFields.filter(
      (field) => !body[field] || body[field].toString().trim() === ''
    )

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: missingFields.map((f) => `${f.replace(/_/g, ' ')} is required`),
        },
        { status: 400 }
      )
    }

    const updatedEvent = await updateEvent(user.id, id, body)

    return NextResponse.json({ success: true, event: updatedEvent }, { status: 200 })
  } catch (err) {
    console.error('PUT /api/event/v1/event/update error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
