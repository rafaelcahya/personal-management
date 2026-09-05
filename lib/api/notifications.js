export async function fetchNotifications({ page = 1, limit = 20, status = 'all' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit), status })
  const res = await fetch(`/api/notifications/v1?${params}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to load notifications')
  return data.data
}

export async function fetchLatestNotifications(limit = 5) {
  return fetchNotifications({ page: 1, limit, status: 'all' })
}

export async function fetchUnreadCount() {
  const res = await fetch('/api/notifications/v1/unread-count')
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to load unread count')
  return data.data.count
}

export async function markNotificationRead(id) {
  const res = await fetch('/api/notifications/v1/read', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to mark notification as read')
  return data.data
}

export async function markAllNotificationsRead() {
  const res = await fetch('/api/notifications/v1/read-all', { method: 'PUT' })
  const data = await res.json()
  if (!res.ok)
    throw new Error(data.message || data.error || 'Failed to mark all notifications as read')
  return data.data
}
