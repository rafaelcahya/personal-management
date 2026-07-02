'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Button from '@/components/base/Button/Button'
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
  Timer,
  DollarSign,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import packageJson from '@/package.json'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'

const INVENTORY_ITEMS = [
  {
    id: 'inventoryDashboardNav_sidebar',
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
    id: 'tradingDashboardNav_sidebar',
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

const CURRENCY_SUBITEMS = [
  {
    id: 'currencyDashboardNav_sidebar',
    name: 'Dashboard',
    href: '/main/trading/currency',
    exact: true,
    icon: LayoutDashboard,
  },
  {
    id: 'currencyHoldingsNav_sidebar',
    name: 'Holdings',
    href: '/main/trading/currency/holdings',
    icon: BarChart2,
  },
]

const RUNNING_ITEMS = [
  {
    id: 'runningDashboardNav_sidebar',
    name: 'Dashboard',
    tooltip: 'Running Dashboard',
    href: '/main/running/dashboard',
    icon: LayoutDashboard,
  },
  { name: 'Activities', href: '/main/running/activities', icon: Activity },
  { name: 'Race Log', href: '/main/running/race-log', icon: Trophy },
  { name: 'Analytics', href: '/main/running/analytics', icon: BarChart2 },
  { name: 'AI Coach', href: '/main/running/ai', icon: BrainCircuit },
  {
    id: 'runCalcNav_sidebar',
    name: 'Run Calc',
    href: '/main/running/run-calculator',
    icon: Timer,
  },
  { name: 'Settings', href: '/main/running/settings', icon: Settings },
]

function NavItem({ item, collapsed, onClick }) {
  const pathname = usePathname()
  const isActive =
    item.exact || item.href === '/main/inventory'
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(item.href + '/')
  const Icon = item.icon

  const link = (
    <Link
      id={item.id}
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

function NavGroup({ id, label, icon: Icon, basePath, subitems, collapsed, onItemClick }) {
  const pathname = usePathname()
  const isActive = pathname === basePath || pathname.startsWith(basePath + '/')
  const [open, setOpen] = useState(isActive)

  useEffect(() => {
    if (isActive) setOpen(true)
  }, [isActive])

  if (collapsed) {
    const trigger = (
      <Button
        variant="ghost"
        fullWidth
        className={cn(
          'justify-center px-2 py-2.5 rounded-lg',
          isActive
            ? 'bg-violet-50 text-violet-700'
            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
        )}
      >
        <Icon className={cn('size-4 shrink-0', isActive ? 'text-violet-600' : 'text-slate-400')} />
      </Button>
    )
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{trigger}</TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div>
      <Button
        id={id}
        variant="ghost"
        fullWidth
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'justify-start gap-3 rounded-lg px-3 py-2',
          isActive
            ? 'bg-violet-50 text-violet-700'
            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
        )}
      >
        <Icon className={cn('size-4 shrink-0', isActive ? 'text-violet-600' : 'text-slate-400')} />
        <span className="truncate flex-1 text-left">{label}</span>
        <ChevronDown
          className={cn(
            'size-3.5 shrink-0 transition-transform duration-200',
            open ? 'rotate-180' : ''
          )}
        />
      </Button>
      {open && (
        <div className="ml-4 pl-3 border-l border-slate-100 mt-0.5 space-y-0.5">
          {subitems.map((item) => (
            <NavItem key={item.href} item={item} collapsed={false} onClick={onItemClick} />
          ))}
        </div>
      )}
    </div>
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
      {TRADING_ITEMS.filter((item) => item.href !== '/main/trading/settings').map((item) => (
        <NavItem key={item.href} item={item} collapsed={collapsed} onClick={onNavClick} />
      ))}
      <NavGroup
        id="currencyNav_sidebar"
        label="Currency"
        icon={DollarSign}
        basePath="/main/trading/currency"
        subitems={CURRENCY_SUBITEMS}
        collapsed={collapsed}
        onItemClick={onNavClick}
      />
      <NavItem
        item={TRADING_ITEMS.find((i) => i.href === '/main/trading/settings')}
        collapsed={collapsed}
        onClick={onNavClick}
      />

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
            <Button
              id={mobile ? 'userMenuSignOut_mobile' : 'logoutBtn'}
              variant="ghost"
              fullWidth
              onClick={handleLogout}
              disabled={loading}
              aria-label="Sign out from application"
              className="justify-start gap-2.5 px-3 py-2.5 text-slate-600 hover:bg-slate-50"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin text-slate-400 shrink-0" />
              ) : (
                <LogOut className="size-4 text-slate-400 shrink-0" />
              )}
              {loading ? 'Signing out...' : 'Sign out'}
            </Button>
          </div>
        )}
        <Button
          id={mobile ? 'userMenuTrigger_mobile' : 'userMenuTrigger_landingPage'}
          variant="ghost"
          fullWidth
          aria-label="User menu"
          onClick={() => setOpen(!open)}
          className={cn(
            'justify-start gap-2.5 rounded-xl p-2 hover:bg-slate-50',
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
        </Button>
      </div>
    </div>
  )
}

const EDGE_THRESHOLD = 30
const SWIPE_MIN_X = 60
const SWIPE_MAX_Y = 80

export default function Sidebar({ user }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) setCollapsed(saved === 'true')
  }, [])

  useEffect(() => {
    let startX = 0
    let startY = 0
    let eligible = false
    let tracking = false

    function onTouchStart(e) {
      if (window.innerWidth >= 768) return
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      tracking = false
      eligible = !mobileOpen ? startX < EDGE_THRESHOLD : true
    }

    function onTouchMove(e) {
      if (window.innerWidth >= 768 || !eligible) return
      const deltaX = e.touches[0].clientX - startX
      const deltaY = e.touches[0].clientY - startY
      if (!tracking) {
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 8) {
          tracking = true
        } else if (Math.abs(deltaY) > 8) {
          eligible = false
          return
        }
      }
      if (tracking) e.preventDefault()
    }

    function onTouchEnd(e) {
      if (window.innerWidth >= 768 || !eligible) return
      const deltaX = e.changedTouches[0].clientX - startX
      const deltaY = e.changedTouches[0].clientY - startY
      if (Math.abs(deltaY) >= SWIPE_MAX_Y) return
      if (!mobileOpen && deltaX > SWIPE_MIN_X) setMobileOpen(true)
      else if (mobileOpen && deltaX < -SWIPE_MIN_X) setMobileOpen(false)
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    document.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [mobileOpen])

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
        {!collapsed && (
          <div className="px-4 pb-1">
            <p id="appVersion_sidebar" className="text-[10px] text-slate-400">
              v{packageJson.version}
            </p>
          </div>
        )}
        <UserSection collapsed={collapsed} user={user} />

        {/* Collapse toggle */}
        <Button
          id="sidebarCollapseBtn_sidebar"
          variant="ghost"
          size="icon-xs"
          onClick={toggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-[4.25rem] rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 z-10"
        >
          {collapsed ? (
            <PanelLeftOpen className="size-3 text-slate-500" />
          ) : (
            <PanelLeftClose className="size-3 text-slate-500" />
          )}
        </Button>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3">
        <Button
          id="mobileMenuTrigger"
          variant="ghost"
          size="icon-sm"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg hover:bg-slate-100"
        >
          <Menu className="size-5 text-slate-600" />
        </Button>
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
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg hover:bg-slate-100"
              >
                <X className="size-4 text-slate-500" />
              </Button>
            </div>
            <SidebarNav collapsed={false} onNavClick={() => setMobileOpen(false)} />
            <div className="px-4 pb-1">
              <p id="appVersion_mobileDrawer" className="text-[10px] text-slate-400">
                v{packageJson.version}
              </p>
            </div>
            <UserSection collapsed={false} user={user} mobile={true} />
          </aside>
        </>
      )}
    </>
  )
}
