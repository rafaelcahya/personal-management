import { createClient } from '@/lib/supabase/server'

export async function getEventTags(userId) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('event_list')
    .select('tags')
    .eq('user_id', userId)
    .is('deleted_at', null)

  if (error) {
    console.error('Failed to fetch event tags:', error)
    throw new Error('Database operation failed')
  }

  const tagSet = new Set()
  for (const row of data || []) {
    for (const tag of row.tags || []) {
      tagSet.add(tag)
    }
  }

  return Array.from(tagSet).sort()
}
