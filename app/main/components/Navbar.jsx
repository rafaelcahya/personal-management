'use client'

import { Menu, Search } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { useNavShell } from './NavShellProvider'
import ActiveSectionLabel from './navbar/ActiveSectionLabel'
import NotificationBell from './navbar/NotificationBell'
import UserMenu from './navbar/UserMenu'

export default function Navbar({ user }) {
  const { setMobileOpen, setPaletteOpen } = useNavShell()

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
        <button
          id="commandPaletteTrigger_navbar"
          type="button"
          onClick={() => setPaletteOpen(true)}
          aria-label="Open command palette"
          className="flex shrink-0 items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30 sm:w-48 md:w-56"
        >
          <Search className="size-4 shrink-0" aria-hidden="true" />
          <span className="hidden text-sm sm:inline">Search…</span>
          <kbd className="ml-auto hidden items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium sm:inline-flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
        <span className="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
        <UserMenu user={user} />
      </div>
    </header>
  )
}
