'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Subscribes to Supabase Realtime changes on the current user's notifications
 * (INSERT + UPDATE) and invokes the given callbacks. RLS scopes the stream to
 * the user's own rows; the explicit filter keeps the channel narrow.
 *
 * Callbacks are held in refs so changing their identity doesn't tear down and
 * re-create the channel on every render.
 */
export function useRealtimeNotifications({ onInsert, onUpdate } = {}) {
  const onInsertRef = useRef(onInsert)
  const onUpdateRef = useRef(onUpdate)
  onInsertRef.current = onInsert
  onUpdateRef.current = onUpdate

  useEffect(() => {
    const supabase = createClient()
    let channel
    let cancelled = false

    ;(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user || cancelled) return

      channel = supabase
        .channel(`notifications:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => onInsertRef.current?.(payload.new)
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => onUpdateRef.current?.(payload.new)
        )
        .subscribe()
    })()

    return () => {
      cancelled = true
      if (channel) supabase.removeChannel(channel)
    }
  }, [])
}
