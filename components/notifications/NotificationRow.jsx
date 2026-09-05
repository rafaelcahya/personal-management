'use client'

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/base/Badge/Badge'
import { NOTIFICATION_MODULE } from '@/lib/constants/notificationTypes'

function formatRelativeTime(dateStr) {
  if (!dateStr) return ''
  const then = new Date(dateStr).getTime()
  const diff = Math.max(0, Date.now() - then)
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 7) return `${day}d ago`
  const wk = Math.floor(day / 7)
  if (wk < 5) return `${wk}w ago`
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Shared notification row used by both the navbar dropdown and the list page.
 * `context` only varies the id suffix and layout density.
 */
export default function NotificationRow({ notification, context = 'page', onMarkRead, onClose }) {
  const router = useRouter()
  const isDropdown = context === 'dropdown'
  const suffix = isDropdown ? 'notificationDropdown' : 'notificationsPage'
  const unread = !notification.is_read
  const module = NOTIFICATION_MODULE[notification.type]

  const handleClick = () => {
    if (unread) onMarkRead?.(notification.id)
    const url = notification.data?.url
    // Only follow internal, relative paths — never an attacker-supplied absolute/external URL.
    if (typeof url === 'string' && url.startsWith('/') && !url.startsWith('//')) router.push(url)
    onClose?.()
  }

  return (
    <button
      id={`notificationRow_${notification.id}_${suffix}`}
      type="button"
      data-menu-item={isDropdown ? '' : undefined}
      tabIndex={isDropdown ? -1 : undefined}
      onClick={handleClick}
      className={cn(
        'flex w-full items-start gap-3 text-left transition-colors outline-none',
        'hover:bg-accent focus-visible:bg-accent',
        isDropdown ? 'rounded-md px-3 py-2.5' : 'border-b border-border px-4 py-4 last:border-b-0',
        unread && !isDropdown && 'bg-secondary/40'
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span
            className={cn(
              'flex-1 truncate text-sm',
              unread ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'
            )}
          >
            {notification.title}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatRelativeTime(notification.created_at)}
          </span>
        </span>
        <span
          className={cn(
            'mt-0.5 block text-xs text-muted-foreground',
            isDropdown ? 'line-clamp-1' : ''
          )}
        >
          {notification.message}
        </span>
        {!isDropdown && module && (
          <Badge variant="outline" size="xs" radius="sm" className="mt-2">
            {module}
          </Badge>
        )}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'mt-1.5 size-2 shrink-0 rounded-full',
          unread ? 'bg-primary' : 'bg-transparent'
        )}
      />
      <span className="sr-only">{unread ? 'Unread' : 'Read'}</span>
    </button>
  )
}
