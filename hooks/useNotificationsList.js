'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import {
  fetchNotifications,
  markNotificationRead as apiMarkRead,
  markAllNotificationsRead as apiMarkAllRead,
} from '@/lib/api/notifications'
import { emitNotificationsChanged } from '@/lib/notificationsBus'

const LIMIT = 20

/**
 * Powers the /main/notifications page: paginated list with all/unread filter,
 * load-more, and mark-read / mark-all-read with optimistic updates.
 */
export function useNotificationsList() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const reqIdRef = useRef(0)
  const inFlightRef = useRef(false)

  const load = useCallback(async (nextPage, status) => {
    const isFirst = nextPage === 1
    const reqId = ++reqIdRef.current
    inFlightRef.current = true
    if (isFirst) {
      setLoading(true)
      setError(null)
    } else {
      setLoadingMore(true)
    }
    try {
      const data = await fetchNotifications({ page: nextPage, limit: LIMIT, status })
      // Ignore stale responses when a newer request has since started (e.g. fast filter switch).
      if (reqId !== reqIdRef.current) return
      setItems((prev) => (isFirst ? data.items : [...prev, ...data.items]))
      setHasMore(data.hasMore)
      setPage(nextPage)
    } catch (err) {
      if (reqId !== reqIdRef.current) return
      if (isFirst) setError(err.message || 'Failed to load notifications')
      else toast.error("Couldn't load more notifications")
    } finally {
      if (reqId === reqIdRef.current) {
        inFlightRef.current = false
        if (isFirst) setLoading(false)
        else setLoadingMore(false)
      }
    }
  }, [])

  useEffect(() => {
    load(1, filter)
  }, [filter, load])

  const loadMore = useCallback(() => {
    if (inFlightRef.current) return
    load(page + 1, filter)
  }, [load, page, filter])

  const markRead = useCallback(async (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
    try {
      await apiMarkRead(id)
      emitNotificationsChanged()
    } catch {
      toast.error('Failed to mark notification as read')
    }
  }, [])

  const markAll = useCallback(async () => {
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })))
    try {
      await apiMarkAllRead()
      emitNotificationsChanged()
      toast.success('All notifications marked as read')
      if (filter === 'unread') load(1, 'unread')
    } catch {
      toast.error('Failed to mark all as read')
    }
  }, [filter, load])

  const hasUnread = items.some((n) => !n.is_read)

  return {
    items,
    filter,
    setFilter,
    hasMore,
    loading,
    loadingMore,
    error,
    hasUnread,
    loadMore,
    markRead,
    markAll,
    retry: () => load(1, filter),
  }
}
