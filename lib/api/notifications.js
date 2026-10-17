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

export async function getPushStatus() {
  const res = await fetch('/api/notifications/v1/push-subscriptions')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to load push status')
  return data.data
}

export async function savePushDevice(subscription) {
  const res = await fetch('/api/notifications/v1/push-subscriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription }),
  })
  const data = await res.json()
  if (!res.ok) {
    const error = new Error(data.message || data.error || 'Failed to save this device')
    error.status = res.status
    throw error
  }
  return data.data
}

export async function removePushDevice(id) {
  const res = await fetch(`/api/notifications/v1/push-subscriptions/${id}`, { method: 'DELETE' })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to remove the device')
}

export async function sendTestPush(endpoint) {
  const res = await fetch('/api/notifications/v1/push-subscriptions/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to send the test notification')
  return data.data
}

export async function getNotificationPreferences() {
  const res = await fetch('/api/notifications/v1/preferences')
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to load preferences')
  return data.data
}

export async function updateNotificationPreference(type, push_enabled) {
  const res = await fetch('/api/notifications/v1/preferences', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, push_enabled }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to save the preference')
  return data.data
}
