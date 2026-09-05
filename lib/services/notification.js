import { NOTIFICATION_TYPES } from '@/lib/constants/notificationTypes'

const NOTIFICATION_FIELDS = 'id, type, title, message, data, is_read, created_at, read_at'

/**
 * Lists a user's notifications, newest first, with pagination and read/unread filter.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - RLS-scoped client
 * @param {string} userId
 * @param {{ page?: number, limit?: number, status?: 'all'|'unread'|'read' }} opts
 */
export async function getNotifications(
  supabase,
  userId,
  { page = 1, limit = 20, status = 'all' } = {}
) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  let countQuery = supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (status === 'unread') countQuery = countQuery.eq('is_read', false)
  else if (status === 'read') countQuery = countQuery.eq('is_read', true)

  const { count, error: countError } = await countQuery
  if (countError) throw new Error(countError.message)

  const total = count ?? 0

  // PostgREST throws PGRST103 ("Requested range not satisfiable") when the
  // requested offset is beyond the last row — e.g. paginating past the last
  // page. Treat that as a valid empty page instead of propagating a 500.
  if (total === 0 || from >= total) {
    return {
      items: [],
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      hasMore: false,
    }
  }

  let query = supabase.from('notifications').select(NOTIFICATION_FIELDS).eq('user_id', userId)

  if (status === 'unread') query = query.eq('is_read', false)
  else if (status === 'read') query = query.eq('is_read', true)

  const { data, error } = await query.order('created_at', { ascending: false }).range(from, to)

  if (error) throw new Error(error.message)

  return {
    items: data ?? [],
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    hasMore: from + (data?.length ?? 0) < total,
  }
}

/**
 * Returns the count of unread notifications for a user.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - RLS-scoped client
 * @param {string} userId
 */
export async function getUnreadNotificationCount(supabase, userId) {
  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) throw new Error(error.message)
  return { count: count ?? 0 }
}

/**
 * Marks a single notification as read, scoped to the owner.
 * Returns null when the row does not exist or is not owned by the user.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - RLS-scoped client
 * @param {string} userId
 * @param {number} notificationId
 */
export async function markNotificationRead(supabase, userId, notificationId) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .eq('user_id', userId)
    .select('id, is_read, read_at')
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data ?? null
}

/**
 * Marks all of a user's unread notifications as read.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - RLS-scoped client
 * @param {string} userId
 */
export async function markAllNotificationsRead(supabase, userId) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) throw new Error(error.message)
  return { success: true }
}

/**
 * Inserts a notification row. Used by Inngest producers via the admin client.
 * Persistence is unconditional — independent of the user's push settings.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - admin client
 * @param {{ userId: string, type: string, title: string, message: string, data?: object|null }} payload
 */
export async function createNotification(supabase, { userId, type, title, message, data = null }) {
  if (!NOTIFICATION_TYPES.includes(type)) {
    throw new Error(`Create notification failed: unknown type "${type}"`)
  }

  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    type,
    title,
    message,
    data,
  })

  if (error) throw new Error(`Create notification failed: ${error.message}`)
  return { success: true }
}
