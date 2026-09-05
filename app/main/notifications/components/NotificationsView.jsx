'use client'

import { Bell, Loader2, CheckCheck } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import State from '@/components/base/State/State'
import NotificationRow from '@/components/notifications/NotificationRow'
import { useNotificationsList } from '@/hooks/useNotificationsList'
import { cn } from '@/lib/utils'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
]

export default function NotificationsView() {
  const {
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
    retry,
  } = useNotificationsList()

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
          <Bell className="size-4 text-primary" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">All Notifications</p>
          <p className="text-xs text-muted-foreground">Unread and read alerts</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div
          id="notificationFilterToggle_notificationsPage"
          role="group"
          aria-label="Filter notifications"
          className="flex gap-2"
        >
          {FILTERS.map((f) => (
            <Button
              key={f.key}
              id={`${f.key}FilterBtn_notificationsPage`}
              variant={filter === f.key ? 'secondary' : 'ghost'}
              size="sm"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={cn(filter === f.key && 'text-primary')}
            >
              {f.label}
            </Button>
          ))}
        </div>
        <Button
          id="markAllReadBtn_notificationsPage"
          variant="outline"
          size="sm"
          onClick={markAll}
          disabled={!hasUnread}
        >
          <CheckCheck className="size-4" />
          Mark all read
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col" aria-busy="true" aria-label="Loading notifications">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-2 border-b border-border px-4 py-4 last:border-b-0"
            >
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3.5 w-2/3" />
            </div>
          ))}
        </div>
      ) : error ? (
        <State
          variant="error"
          title="Failed to load notifications"
          description="Check your connection and try again."
          action={{ label: 'Try again', onClick: retry }}
        />
      ) : items.length === 0 ? (
        <State
          variant="empty"
          title={filter === 'unread' ? "You're all caught up" : 'No notifications yet'}
          description={
            filter === 'unread'
              ? 'No unread notifications.'
              : "You'll see alerts from Inventory, Trading, and Running here."
          }
        />
      ) : (
        <>
          <div className="flex flex-col">
            {items.map((n) => (
              <NotificationRow key={n.id} notification={n} context="page" onMarkRead={markRead} />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center p-4">
              <Button
                id="loadMoreBtn_notificationsPage"
                variant="outline"
                size="sm"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load more'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
