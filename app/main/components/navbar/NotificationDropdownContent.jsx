'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import State from '@/components/base/State/State'
import { useDropdownMenu } from '@/components/base/DropdownMenu/DropdownMenu'
import NotificationRow from '@/components/notifications/NotificationRow'

export default function NotificationDropdownContent({ items, loading, error, reload, onMarkRead }) {
  const { setOpen } = useDropdownMenu()

  useEffect(() => {
    reload()
  }, [reload])

  const close = () => setOpen(false)

  return (
    <div id="notificationDropdown_navbar" className="flex flex-col">
      <div className="flex items-center justify-between px-3 py-2">
        <p className="text-sm font-semibold text-foreground">Notifications</p>
      </div>

      <div className="border-t border-border">
        {loading ? (
          <div
            className="flex flex-col gap-1 p-2"
            aria-busy="true"
            aria-label="Loading notifications"
          >
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-1.5 px-1 py-2">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <State
            variant="error"
            title="Couldn't load notifications"
            description="Check your connection and try again."
            action={{ label: 'Try again', onClick: reload }}
            className="py-8"
          />
        ) : items.length === 0 ? (
          <State
            variant="empty"
            title="You're all caught up"
            description="No notifications yet."
            className="py-8"
          />
        ) : (
          <div className="flex flex-col gap-0.5 p-1">
            {items.map((n) => (
              <NotificationRow
                key={n.id}
                notification={n}
                context="dropdown"
                onMarkRead={onMarkRead}
                onClose={close}
              />
            ))}
          </div>
        )}
      </div>

      <Link
        id="viewAllNotificationsLink_notificationDropdown"
        href="/main/notifications"
        onClick={close}
        className="border-t border-border px-3 py-2.5 text-center text-sm font-medium text-primary hover:bg-secondary"
      >
        View all notifications
      </Link>
    </div>
  )
}
