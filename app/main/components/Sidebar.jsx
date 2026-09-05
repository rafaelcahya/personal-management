'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/base/Button/Button'
import { SidebarHeader, SidebarContent, SidebarFooter } from '@/components/base/Sidebar/Sidebar.jsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  X,
  Package2,
  Activity,
  BarChart2,
  BrainCircuit,
  Trophy,
  Timer,
  DollarSign,
  ChevronDown,
  MapPin,
  Microscope,
  GitBranch,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import packageJson from '@/package.json'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useNavShell } from './NavShellProvider'

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
  {
    id: 'tradingValuationNav_sidebar',
    name: 'Valuation',
    tooltip: 'Stock Valuation',
    href: '/main/trading/valuation',
    icon: BarChart2,
  },
  { name: 'Trades', href: '/main/trading/trade', icon: TrendingUp },
  { name: 'Market Events', href: '/main/trading/event', icon: Calendar },
  { name: 'Research', href: '/main/trading/research', icon: Microscope },
  { name: 'Fees', href: '/main/trading/fee', icon: Receipt },
  { name: 'Investment Flow', href: '/main/trading/investment-flow', icon: GitBranch },
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
  {
    id: 'routeBuilderNav_sidebar',
    name: 'Routes',
    href: '/main/running/route-builder',
    icon: MapPin,
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
          ? 'bg-secondary text-primary'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
      )}
    >
      <Icon
        className={cn('size-4 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')}
      />
      {!collapsed && <span className="truncate">{item.name}</span>}
    </Link>
  )

  if (!collapsed) return link

  return (
    <Popover>
      <PopoverTrigger asChild>{link}</PopoverTrigger>
      <PopoverContent side="right" className="w-auto p-2 text-xs">
        {item.tooltip ?? item.name}
      </PopoverContent>
    </Popover>
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
            ? 'bg-secondary text-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
        )}
      >
        <Icon
          className={cn('size-4 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')}
        />
      </Button>
    )
    return (
      <Popover>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent side="right" className="w-auto p-2 text-xs">
          {label}
        </PopoverContent>
      </Popover>
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
            ? 'bg-secondary text-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
        )}
      >
        <Icon
          className={cn('size-4 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')}
        />
        <span className="truncate flex-1 text-left">{label}</span>
        <ChevronDown
          className={cn(
            'size-3.5 shrink-0 transition-transform duration-200',
            open ? 'rotate-180' : ''
          )}
        />
      </Button>
      {open && (
        <div className="ml-4 pl-3 border-l border-border mt-0.5 space-y-0.5">
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
    <nav className="px-3 py-2 space-y-0.5">
      {!collapsed && (
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 pt-3 pb-1.5">
          Inventory
        </p>
      )}
      {collapsed && <div className="h-2" />}
      {INVENTORY_ITEMS.map((item) => (
        <NavItem key={item.href} item={item} collapsed={collapsed} onClick={onNavClick} />
      ))}

      <div className="border-t border-border pt-3" />

      {!collapsed && (
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-1.5">
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

      <div className="border-t border-border pt-3" />

      {!collapsed && (
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-1.5">
          Running
        </p>
      )}
      {RUNNING_ITEMS.map((item) => (
        <NavItem key={item.href} item={item} collapsed={collapsed} onClick={onNavClick} />
      ))}
    </nav>
  )
}

const EDGE_THRESHOLD = 30
const SWIPE_MIN_X = 60
const SWIPE_MAX_Y = 80

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { mobileOpen, setMobileOpen } = useNavShell()
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
          'hidden md:flex flex-col h-screen bg-card border-r border-border shrink-0 relative transition-[width] duration-300 ease-in-out',
          collapsed ? 'w-[4.5rem]' : 'w-64'
        )}
      >
        {/* Logo */}
        <SidebarHeader
          className={cn('gap-3 px-4 py-4 border-border', collapsed && 'justify-center px-0')}
        >
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <Package2 className="size-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-foreground text-sm leading-tight">
              Personal Management
            </span>
          )}
        </SidebarHeader>

        <SidebarContent className="py-0">
          <SidebarNav collapsed={collapsed} />
        </SidebarContent>
        <SidebarFooter>
          {!collapsed && (
            <p id="appVersion_sidebar" className="text-[10px] text-muted-foreground pb-2 mt-2">
              v{packageJson.version}
            </p>
          )}
        </SidebarFooter>

        {/* Collapse toggle */}
        <Button
          id="sidebarCollapseBtn_sidebar"
          variant="ghost"
          size="icon-xs"
          onClick={toggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-[4.25rem] rounded-full bg-card border border-border shadow-sm hover:bg-accent z-10"
        >
          {collapsed ? (
            <PanelLeftOpen className="size-3 text-muted-foreground" />
          ) : (
            <PanelLeftClose className="size-3 text-muted-foreground" />
          )}
        </Button>
      </aside>

      {/* ── Mobile drawer (opened from Navbar hamburger) ── */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-card border-r border-border flex flex-col">
            <SidebarHeader className="justify-between h-14 border-border gap-2 px-4">
              <div className="flex items-center gap-2">
                <div className="size-7 bg-primary rounded-lg flex items-center justify-center">
                  <Package2 className="size-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-foreground text-sm">Personal Management</span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
                className="rounded-lg hover:bg-accent"
              >
                <X className="size-4 text-muted-foreground" />
              </Button>
            </SidebarHeader>
            <SidebarContent className="py-0">
              <SidebarNav collapsed={false} onNavClick={() => setMobileOpen(false)} />
            </SidebarContent>
            <SidebarFooter>
              <p
                id="appVersion_mobileDrawer"
                className="text-[10px] text-muted-foreground pb-2 mt-2"
              >
                v{packageJson.version}
              </p>
            </SidebarFooter>
          </aside>
        </>
      )}
    </>
  )
}
