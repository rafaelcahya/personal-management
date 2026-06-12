import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createEvent } from '@/lib/services/event/createEvent'

const VALID_OUTCOMES = ['UP', 'DOWN']

function validateLinks(links) {
  if (!Array.isArray(links) || links.length === 0) {
    return 'At least 1 reference link is required'
  }
  for (const entry of links) {
    if (!entry.hyperlink || String(entry.hyperlink).trim() === '') {
      return 'Each link must have a non-empty hyperlink text'
    }
    try {
      const url = new URL(entry.link)
      if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        return 'Links must use http or https'
      }
    } catch {
      return 'One or more links contain an invalid URL'
    }
  }
  return null
}

export async function POST(req) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Unauthorized' }, { status: 401 })
    }

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: 'INVALID_REQUEST', message: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    if (!body) {
      return NextResponse.json(
        { error: 'INVALID_REQUEST', message: 'Request body is required' },
        { status: 400 }
      )
    }

    const errors = []

    if (!body.title || String(body.title).trim() === '') errors.push('title is required')
    if (body.title && String(body.title).length > 150)
      errors.push('title must not exceed 150 characters')
    if (body.event_description && String(body.event_description).length > 2000)
      errors.push('event description must not exceed 2000 characters')
    if (!body.impact_direction || String(body.impact_direction).trim() === '')
      errors.push('impact direction is required')
    if (!body.event_date || String(body.event_date).trim() === '')
      errors.push('event date is required')
    if (body.actual_outcome != null && !VALID_OUTCOMES.includes(body.actual_outcome))
      errors.push('invalid actual outcome')
    if (body.tags != null) {
      if (!Array.isArray(body.tags)) errors.push('tags must be an array')
      else if (body.tags.length > 10) errors.push('maximum 10 tags allowed')
      else if (body.tags.some((t) => String(t).length > 30))
        errors.push('each tag must not exceed 30 characters')
    }

    const linksError = validateLinks(body.links)
    if (linksError) errors.push(linksError)

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: errors.join(', ') },
        { status: 400 }
      )
    }

    const newEvent = await createEvent(user.id, body)

    return NextResponse.json(
      { data: newEvent, message: 'Event created successfully' },
      { status: 201 }
    )
  } catch (err) {
    console.error('POST /api/trade/v1/event/create error:', err)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
