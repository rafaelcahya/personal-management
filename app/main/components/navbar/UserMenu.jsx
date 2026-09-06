'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Loader2, ShieldCheck, Settings } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/base/Avatar/Avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/base/DropdownMenu/DropdownMenu'
import { useUserProfile } from '../UserProfileProvider'

export default function UserMenu({ user }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { profile } = useUserProfile()

  // Prefer the editable profile (nickname/username) so topbar updates the moment Settings saves.
  const displayName =
    profile?.nickname ||
    profile?.username ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'User'
  const name = displayName.split(' ')[0]
  const fullName = displayName
  const email = user?.email || ''
  const initials = name.charAt(0).toUpperCase()
  const avatarUrl = profile?.avatar || user?.user_metadata?.avatar_url

  const handleLogout = async () => {
    setLoading(true)
    sessionStorage.setItem('intentional_logout', 'true')
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (!res.ok) throw new Error()
      router.push('/login')
      router.refresh()
    } catch {
      sessionStorage.removeItem('intentional_logout')
      toast.error("Couldn't sign you out — please try again.")
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          id="userMenuTrigger_navbar"
          type="button"
          aria-label={`Account menu for ${name}`}
          className="flex items-center gap-2.5 rounded-lg p-1 pr-2 outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/30"
        >
          <Avatar size="sm">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} />}
            <AvatarFallback className="bg-secondary text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden min-w-0 flex-col text-left md:flex">
            <span className="max-w-[120px] truncate text-sm font-medium text-foreground">
              {name}
            </span>
            <span className="hidden max-w-[160px] truncate text-xs text-muted-foreground lg:block">
              {email}
            </span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-1">
        <div className="border-b border-border px-3 py-2.5">
          <p className="truncate text-sm font-medium text-foreground">{name}</p>
          <p id="userMenuEmail_navbar" className="truncate text-xs text-muted-foreground">
            {email}
          </p>
        </div>
        <DropdownMenuItem asDiv className="p-0">
          <Link
            id="settingsLink_navbar"
            href="/main/settings"
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground"
          >
            <Settings className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asDiv className="p-0">
          <Link
            id="securityLink_navbar"
            href="/main/security"
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground"
          >
            <ShieldCheck className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            Security
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          id="userMenuSignOut_navbar"
          icon={loading ? Loader2 : LogOut}
          label={loading ? 'Signing out...' : 'Sign out'}
          disabled={loading}
          onSelect={handleLogout}
          className={loading ? '[&>svg]:animate-spin' : undefined}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
