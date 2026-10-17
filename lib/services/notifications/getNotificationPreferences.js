import {
  NOTIFICATION_TYPES,
  NOTIFICATION_MODULE,
  NOTIFICATION_LABEL,
} from '@/lib/constants/notificationTypes'

/**
 * Every notification type with the user's push setting (default on when never changed).
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - RLS-scoped client
 * @param {string} userId
 */
export async function getNotificationPreferences(supabase, userId) {
  const { data, error } = await supabase
    .from('notification_preferences')
    .select('type, push_enabled')
    .eq('user_id', userId)
  if (error) throw new Error(error.message)

  const saved = new Map((data ?? []).map((row) => [row.type, row.push_enabled]))
  return NOTIFICATION_TYPES.map((type) => ({
    type,
    module: NOTIFICATION_MODULE[type],
    title: NOTIFICATION_LABEL[type].title,
    description: NOTIFICATION_LABEL[type].description,
    push_enabled: saved.get(type) ?? true,
  }))
}
