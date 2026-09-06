'use client'

import { Bell } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { Badge } from '@/components/base/Badge/Badge'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/base/DropdownMenu/DropdownMenu'
import { useNotifications } from '@/hooks/useNotifications'
import NotificationDropdownContent from './NotificationDropdownContent'

export default function NotificationBell() {
  const { items, unreadCount, loading, error, reload, markRead } = useNotifications()
  const label = unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          id="notificationBellTrigger_navbar"
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          className="relative rounded-lg hover:bg-accent"
        >
          <Bell className="size-5 text-foreground" />
          {unreadCount > 0 && (
            <Badge
              id="notificationUnreadBadge_navbar"
              variant="destructive"
              radius="full"
              className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center px-1 text-[11px] font-semibold leading-none tabular-nums"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[calc(100vw-1.5rem)] max-w-sm p-0 sm:w-96">
        <NotificationDropdownContent
          items={items}
          loading={loading}
          error={error}
          reload={reload}
          onMarkRead={markRead}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
