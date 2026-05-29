'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Tag,
  Type,
  History,
  TrendingUp,
  Receipt,
  Calendar,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  Package2,
  LogOut,
  Loader2,
  Activity,
  BarChart2,
  BrainCircuit,
  Trophy,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'

const INVENTORY_ITEMS = [
  {
    name: 'Dashboard',
    tooltip: 'Inventory Dashboard',
    href: '/main/inventory',
    icon: LayoutDashboard,
  },
  { name: 'Product List', href: '/main/inventory/product-list', icon: Package },
  { name: 'Product Brand', href: '/main/inventory/product-brand', icon: Tag },
  { name: 'Product Name', href: '/main/inventory/product-name', icon: Type },
  { name: 'Product History', href: '/main/inventory/product-history', icon: History },
]

const TRADING_ITEMS = [
  {
    name: 'Dashboard',
    tooltip: 'Trading Dashboard',
    href: '/main/trading/dashboard',
    icon: LayoutDashboard,
  },
  { name: 'Trades', href: '/main/trading/trade', icon: TrendingUp },
  { name: 'Market Events', href: '/main/trading/event', icon: Calendar },
  { name: 'Fees', href: '/main/trading/fee', icon: Receipt },
  { name: 'Settings', href: '/main/trading/settings', icon: Settings },
]

const RUNNING_ITEMS = [
  {
    name: 'Dashboard',
    tooltip: 'Running Dashboard',
    href: '/main/running/dashboard',
    icon: LayoutDashboard,
  },
  { name: 'Activities', href: '/main/running/activities', icon: Activity },
  { name: 'Race Log', href: '/main/running/race-log', icon: Trophy },
  { name: 'Analytics', href: '/main/running/analytics', icon: BarChart2 },
  { name: 'AI Coach', href: '/main/running/ai', icon: BrainCircuit },
  { name: 'Settings', href: '/main/running/settings', icon: Settings },
]

function NavItem({ item, collapsed, onClick }) {
  const pathname = usePathname()
  // '/main/inventory' is a prefix of all inventory routes — use exact match only
  const isActive =
    item.href === '/main/inventory'
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(item.href + '/')
  const Icon = item.icon

  const link = (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg text-sm font-medium transition-colors',
        collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2',
        isActive
          ? 'bg-violet-50 text-violet-700'
          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
      )}
    >
      <Icon className={cn('size-4 shrink-0', isActive ? 'text-violet-600' : 'text-slate-400')} />
      {!collapsed && <span className="truncate">{item.name}</span>}
    </Link>
  )

  if (!collapsed) return link

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{item.tooltip ?? item.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function SidebarNav({ collapsed, onNavClick }) {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
      {!collapsed && (
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 pt-3 pb-1.5">
          Inventory
        </p>
      )}
      {collapsed && <div className="h-2" />}
      {INVENTORY_ITEMS.map((item) => (
        <NavItem key={item.href} item={item} collapsed={collapsed} onClick={onNavClick} />
      ))}

      <div className="border-t border-slate-100 pt-3" />

      {!collapsed && (
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 pb-1.5">
          Trading
        </p>
      )}
      {TRADING_ITEMS.map((item) => (
        <NavItem key={item.href} item={item} collapsed={collapsed} onClick={onNavClick} />
      ))}

      <div className="border-t border-slate-100 pt-3" />

      {!collapsed && (
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 pb-1.5">
          Running
        </p>
      )}
      {RUNNING_ITEMS.map((item) => (
        <NavItem key={item.href} item={item} collapsed={collapsed} onClick={onNavClick} />
      ))}
    </nav>
  )
}

function UserSection({ collapsed, user, mobile = false }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)
  const router = useRouter()

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

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

  const name = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'
  const email = user?.email || ''
  const initials = name.charAt(0).toUpperCase()

  return (
    <div className="border-t border-slate-100 p-3" ref={ref}>
      <div className="relative">
        {open && (
          <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-10">
            {!collapsed && (
              <div className="px-3 py-2.5 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-700 truncate">{name}</p>
                <p
                  id={mobile ? 'userMenuEmail_mobile' : 'userMenuEmail_landingPage'}
                  className="text-xs text-slate-400 truncate"
                >
                  {email}
                </p>
              </div>
            )}
            <button
              id={mobile ? 'userMenuSignOut_mobile' : 'logoutBtn'}
              onClick={handleLogout}
              disabled={loading}
              aria-label="Sign out from application"
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin text-slate-400 shrink-0" />
              ) : (
                <LogOut className="size-4 text-slate-400 shrink-0" />
              )}
              {loading ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        )}
        <button
          id={mobile ? 'userMenuTrigger_mobile' : 'userMenuTrigger_landingPage'}
          aria-label="User menu"
          onClick={() => setOpen(!open)}
          className={cn(
            'flex items-center gap-2.5 w-full rounded-xl p-2 hover:bg-slate-50 transition-colors text-left',
            collapsed && 'justify-center'
          )}
        >
          <div className="size-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0 text-violet-700 font-semibold text-sm">
            {initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{name}</p>
              <p className="text-xs text-slate-400 truncate">{email}</p>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}

export default function Sidebar({ user }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) setCollapsed(saved === 'true')
  }, [])

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('sidebar-collapsed', String(next))
      return next
    })
  }

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className={cn(
          'hidden md:flex flex-col h-screen bg-white border-r border-slate-200 shrink-0 relative transition-[width] duration-300 ease-in-out',
          collapsed ? 'w-[4.5rem]' : 'w-64'
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            'flex items-center gap-3 px-4 py-4 border-b border-slate-100 shrink-0',
            collapsed && 'justify-center px-0'
          )}
        >
          <div className="size-8 bg-violet-600 rounded-lg flex items-center justify-center shrink-0">
            <Package2 className="size-4 text-white" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-slate-800 text-sm leading-tight">
              Personal Management
            </span>
          )}
        </div>

        <SidebarNav collapsed={collapsed} />
        <UserSection collapsed={collapsed} user={user} />

        {/* Collapse toggle */}
        <button
          onClick={toggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-[4.25rem] size-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 z-10 transition-colors"
        >
          {collapsed ? (
            <PanelLeftOpen className="size-3 text-slate-500" />
          ) : (
            <PanelLeftClose className="size-3 text-slate-500" />
          )}
        </button>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3">
        <button
          id="mobileMenuTrigger"
          onClick={() => setMobileOpen(true)}
          className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Menu className="size-5 text-slate-600" />
        </button>
        <div className="flex items-center gap-2">
          <div className="size-6 bg-violet-600 rounded-md flex items-center justify-center">
            <Package2 className="size-3.5 text-white" />
          </div>
          <span className="font-semibold text-slate-800 text-sm">Personal Management</span>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col">
            <div className="flex items-center justify-between px-4 h-14 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="size-7 bg-violet-600 rounded-lg flex items-center justify-center">
                  <Package2 className="size-4 text-white" />
                </div>
                <span className="font-semibold text-slate-800 text-sm">Personal Management</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-100"
              >
                <X className="size-4 text-slate-500" />
              </button>
            </div>
            <SidebarNav collapsed={false} onNavClick={() => setMobileOpen(false)} />
            <UserSection collapsed={false} user={user} mobile={true} />
          </aside>
        </>
      )}
    </>
  )
}
