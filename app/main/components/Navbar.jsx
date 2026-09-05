'use client'

import { Menu } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { useNavShell } from './NavShellProvider'
import ActiveSectionLabel from './navbar/ActiveSectionLabel'
import NotificationBell from './navbar/NotificationBell'
import UserMenu from './navbar/UserMenu'

export default function Navbar({ user }) {
  const { setMobileOpen } = useNavShell()

  return (
    <header
      id="navbar"
      className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 md:px-6"
    >
      <div className="flex min-w-0 items-center gap-2">
        <Button
          id="mobileMenuTrigger"
          variant="ghost"
          size="icon-sm"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          className="rounded-lg hover:bg-accent md:hidden"
        >
          <Menu className="size-5 text-foreground" />
        </Button>
        <ActiveSectionLabel />
      </div>

      <div className="flex items-center gap-1">
        <NotificationBell />
        <span className="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
        <UserMenu user={user} />
      </div>
    </header>
  )
}
