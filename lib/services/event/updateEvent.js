import { createClient } from '@/lib/supabase/server'

export async function updateEvent(userId, eventId, eventData) {
  const supabase = await createClient()

  const rawTags = Array.isArray(eventData.tags) ? eventData.tags : []
  const tags = rawTags.map((t) => t.toLowerCase().trim()).filter(Boolean)

  const updateData = {
    title: eventData.title,
    event_description: eventData.event_description ?? null,
    impact_direction: eventData.impact_direction,
    actual_outcome: eventData.actual_outcome ?? null,
    event_date: eventData.event_date,
    tags,
    links: eventData.links ?? [],
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('event_list')
    .update(updateData)
    .eq('id', eventId)
    .eq('user_id', userId)
    .select(
      'id, title, event_date, impact_direction, actual_outcome, tags, links, event_description, user_id'
    )
    .single()

  if (error) {
    console.error('Failed to update event:', error)
    throw new Error('Database operation failed')
  }

  return data
}
