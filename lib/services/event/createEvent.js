import { createClient } from '@/lib/supabase/server'

export async function createEvent(userId, eventData) {
  const supabase = await createClient()

  const rawTags = Array.isArray(eventData.tags) ? eventData.tags : []
  const tags = rawTags.map((t) => t.toLowerCase().trim()).filter(Boolean)

  const insertData = {
    user_id: userId,
    title: eventData.title,
    event_description: eventData.event_description,
    impact_direction: eventData.impact_direction,
    actual_outcome: eventData.actual_outcome ?? null,
    event_date: eventData.event_date,
    tags,
    links: eventData.links ?? [],
    is_favorite: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('event_list')
    .insert(insertData)
    .select(
      'id, title, event_date, impact_direction, actual_outcome, tags, links, event_description, user_id'
    )
    .single()

  if (error) {
    console.error('Failed to create event:', error)
    throw new Error('Database operation failed')
  }

  return data
}
