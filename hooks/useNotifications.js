'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import {
  fetchLatestNotifications,
  fetchUnreadCount,
  markNotificationRead as apiMarkRead,
} from '@/lib/api/notifications'
import { onNotificationsChanged, emitNotificationsChanged } from '@/lib/notificationsBus'

/**
 * Powers the navbar bell: unread count (loaded on mount) and the latest 5
 * notifications (loaded on demand when the dropdown opens).
 */
export function useNotifications() {
  const [items, setItems] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadCount = useCallback(async () => {
    try {
      setUnreadCount(await fetchUnreadCount())
    } catch {
      // Badge is non-critical — silently ignore count failures.
    }
  }, [])

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchLatestNotifications(5)
      setItems(data.items ?? [])
    } catch (err) {
      setError(err.message || 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCount()
    // Refetch the badge whenever read-state changes elsewhere (e.g. the list page).
    return onNotificationsChanged(loadCount)
  }, [loadCount])

  const markRead = useCallback(
    async (id) => {
      let wasUnread = false
      setItems((prev) =>
        prev.map((n) => {
          if (n.id === id && !n.is_read) wasUnread = true
          return n.id === id ? { ...n, is_read: true } : n
        })
      )
      if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1))
      try {
        await apiMarkRead(id)
        emitNotificationsChanged()
      } catch {
        toast.error('Failed to mark notification as read')
        loadCount()
      }
    },
    [loadCount]
  )

  return { items, unreadCount, loading, error, reload, markRead }
}
