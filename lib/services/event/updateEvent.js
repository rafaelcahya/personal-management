import { createClient } from '@/lib/supabase/server'

export async function updateEvent(userId, eventId, eventData) {
  const supabase = await createClient()

  const updateData = {
    title: eventData.title,
    event_description: eventData.event_description ?? null,
    impact_direction: eventData.impact_direction,
    event_date: eventData.event_date,
    event_type: eventData.event_type ?? null,
    links: eventData.links ?? [],
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('event_list')
    .update(updateData)
    .eq('id', eventId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Failed to update event:', error)
    throw new Error('Database operation failed')
  }

  return data
}
