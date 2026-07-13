'use client'
import {
  Children,
  cloneElement,
  createContext,
  createPortal,
  useContext,
  useEffect,
  useState,
} from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const SidebarContext = createContext(null)

function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('Sidebar components must be wrapped in <SidebarProvider>')
  return ctx
}

function SidebarProvider({
  children,
  defaultOpen = true,
  defaultCollapsed = false,
  collapseAnimation = 'slide',
}) {
  const [open, setOpen] = useState(defaultOpen)
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (isMobile && open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobile, open])

  useEffect(() => {
    if (!isMobile || !open) return
    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isMobile, open])

  const toggleSidebar = () => {
    if (isMobile) {
      setOpen((prev) => !prev)
    } else {
      setCollapsed((prev) => !prev)
    }
  }

  return (
    <SidebarContext.Provider
      value={{ open, setOpen, collapsed, setCollapsed, isMobile, toggleSidebar, collapseAnimation }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

function SidebarOverlay({ className, ...props }) {
  const { open, setOpen, isMobile } = useSidebar()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isMobile) return null

  return createPortal(
    <div
      onClick={() => setOpen(false)}
      aria-hidden="true"
      className={cn(
        'fixed inset-0 z-40 bg-black/50 transition-opacity duration-200',
        open ? 'opacity-100' : 'opacity-0 pointer-events-none',
        className
      )}
      {...props}
    />,
    document.body
  )
}

function Sidebar({ className, side = 'left', children, ...props }) {
  const { collapsed, isMobile, open, collapseAnimation } = useSidebar()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (isMobile) {
    if (!mounted) return null
    return createPortal(
      <aside
        className={cn(
          'fixed inset-y-0 z-50 flex flex-col bg-white w-72 transition-transform duration-200',
          side === 'left'
            ? cn('left-0 border-r border-gray-200', open ? 'translate-x-0' : '-translate-x-full')
            : cn('right-0 border-l border-gray-200', open ? 'translate-x-0' : 'translate-x-full'),
          className
        )}
        aria-label="Navigation sidebar"
        {...props}
      >
        {children}
      </aside>,
      document.body
    )
  }

  return (
    <aside
      className={cn(
        'flex flex-col shrink-0 bg-white border-gray-200 overflow-hidden',
        collapseAnimation === 'slide' && 'transition-[width] duration-200',
        side === 'left' ? 'border-r' : 'border-l',
        collapsed ? 'w-14' : 'w-60',
        className
      )}
      aria-label="Navigation sidebar"
      {...props}
    >
      {children}
    </aside>
  )
}

function SidebarTrigger({ className, ...props }) {
  const { toggleSidebar, collapsed, isMobile, open } = useSidebar()
  const isOpen = isMobile ? open : !collapsed

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      aria-expanded={isOpen}
      className={cn(
        'inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500',
        className
      )}
      {...props}
    >
      {isMobile && open ? <X className="size-5" /> : <Menu className="size-5" />}
    </button>
  )
}

function SidebarHeader({ className, children, ...props }) {
  return (
    <header
      className={cn('flex items-center shrink-0 px-3 py-3 border-b border-gray-100', className)}
      {...props}
    >
      {children}
    </header>
  )
}

function SidebarContent({ className, children, ...props }) {
  return (
    <div className={cn('flex-1 overflow-y-auto overflow-x-hidden py-2', className)} {...props}>
      {children}
    </div>
  )
}

function SidebarFooter({ className, children, ...props }) {
  return (
    <footer className={cn('shrink-0 px-3 py-3 border-t border-gray-100', className)} {...props}>
      {children}
    </footer>
  )
}

function SidebarGroup({ label, className, children, ...props }) {
  const { collapsed, collapseAnimation } = useSidebar()

  return (
    <div className={cn('mb-1 px-2', className)} {...props}>
      {label && (
        <div
          className={cn(
            'px-1 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 overflow-hidden whitespace-nowrap',
            collapseAnimation === 'slide' && 'transition-[opacity,height,padding] duration-200',
            collapsed ? 'opacity-0 h-0 py-0' : 'opacity-100 h-auto'
          )}
        >
          {label}
        </div>
      )}
      {children}
    </div>
  )
}

function SidebarItemIcon({ className, children, ...props }) {
  return (
    <span className={cn('shrink-0 size-5 flex items-center justify-center', className)} {...props}>
      {children}
    </span>
  )
}

function SidebarItemLabel({ className, children, ...props }) {
  const { collapsed, collapseAnimation } = useSidebar()
  return (
    <span
      className={cn(
        'flex-1 truncate whitespace-nowrap',
        collapseAnimation === 'slide' && 'transition-[opacity,width] duration-200',
        collapsed ? 'opacity-0 w-0 overflow-hidden flex-none' : 'opacity-100',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

function SidebarItemBadge({ className, children, ...props }) {
  const { collapsed, collapseAnimation } = useSidebar()
  return (
    <span
      className={cn(
        'ml-auto shrink-0 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold bg-violet-100 text-violet-700 overflow-hidden',
        collapseAnimation === 'slide' &&
          'transition-[opacity,width,min-width,padding] duration-200',
        collapsed ? 'opacity-0 w-0 min-w-0 px-0 ml-0' : 'opacity-100',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

function SidebarTooltip({ label, children }) {
  const [visible, setVisible] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && label && (
        <div
          role="tooltip"
          className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 px-2.5 py-1.5 rounded-md bg-gray-900 text-white text-xs font-medium shadow-md whitespace-nowrap pointer-events-none"
        >
          {label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
        </div>
      )}
    </div>
  )
}

function SidebarSub({ open: isOpen = false, animation = 'slide', className, children, ...props }) {
  if (animation === 'none') {
    if (!isOpen) return null
    return (
      <div className={cn('pl-6 py-0.5 flex flex-col gap-0.5 relative', className)} {...props}>
        <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-100" />
        {children}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid transition-[grid-template-rows] duration-200',
        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      )}
      {...props}
    >
      <div className="overflow-hidden">
        <div className={cn('pl-6 py-0.5 flex flex-col gap-0.5 relative', className)}>
          <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-100" />
          {children}
        </div>
      </div>
    </div>
  )
}

const itemSizeClasses = {
  xs: { px: 'px-1', rest: 'py-0.5 min-h-[28px] gap-1.5', icon: 'size-3.5', label: 'text-xs' },
  sm: { px: 'px-1.5', rest: 'py-1 min-h-[32px] gap-2', icon: 'size-4', label: 'text-xs' },
  base: { px: 'px-2', rest: 'py-1.5 min-h-[38px] gap-2', icon: 'size-4', label: 'text-sm' },
  lg: { px: 'px-2', rest: 'py-2 min-h-[44px] gap-2.5', icon: 'size-5', label: 'text-sm' },
  xl: { px: 'px-3', rest: 'py-2.5 min-h-[52px] gap-3', icon: 'size-5', label: 'text-base' },
}

function SidebarItem({
  icon,
  label,
  badge,
  size = 'base',
  active = false,
  disabled = false,
  onClick,
  className,
  children,
  ...props
}) {
  const { collapsed, isMobile, collapseAnimation } = useSidebar()
  const [subOpen, setSubOpen] = useState(false)

  const childArray = Children.toArray(children)
  const subChild = childArray.find((c) => c.type === SidebarSub)
  const hasSub = !!subChild
  const otherChildren = childArray.filter((c) => c.type !== SidebarSub)

  const sz = itemSizeClasses[size] ?? itemSizeClasses.base

  const handleClick = (e) => {
    if (disabled) return
    if (hasSub) setSubOpen((prev) => !prev)
    onClick?.(e)
  }

  const baseButtonClass = cn(
    'w-full flex items-center rounded-lg transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500',
    sz.rest,
    active
      ? 'bg-violet-50 text-violet-700 font-medium'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    disabled && 'opacity-40 cursor-not-allowed'
  )

  const iconEl = icon ? (
    <SidebarItemIcon className={cn(sz.icon, active ? 'text-violet-600' : '')}>
      {icon}
    </SidebarItemIcon>
  ) : (
    otherChildren.find((c) => c.type === SidebarItemIcon)
  )

  const button =
    collapsed && !isMobile ? (
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        aria-current={active ? 'page' : undefined}
        className={cn(baseButtonClass, 'justify-center', className)}
        {...props}
      >
        {iconEl}
      </button>
    ) : (
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        aria-current={active ? 'page' : undefined}
        aria-expanded={hasSub ? subOpen : undefined}
        className={cn(baseButtonClass, 'text-left', sz.px, className)}
        {...props}
      >
        {iconEl}
        {label && <SidebarItemLabel className={sz.label}>{label}</SidebarItemLabel>}
        {badge != null && <SidebarItemBadge>{badge}</SidebarItemBadge>}
        {otherChildren.filter((c) => c.type !== SidebarItemIcon).length > 0 &&
          otherChildren.filter((c) => c.type !== SidebarItemIcon)}
        {hasSub && (
          <ChevronDown
            className={cn(
              'ml-auto size-3.5 shrink-0 text-gray-400',
              collapseAnimation === 'slide' && 'transition-transform duration-200',
              subOpen && 'rotate-180'
            )}
          />
        )}
      </button>
    )

  const content = hasSub ? (
    <div>
      {button}
      {!(collapsed && !isMobile) && cloneElement(subChild, { open: subOpen })}
    </div>
  ) : (
    button
  )

  if (collapsed && !isMobile && label) {
    return <SidebarTooltip label={label}>{content}</SidebarTooltip>
  }

  return content
}

export {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarItem,
  SidebarItemIcon,
  SidebarItemLabel,
  SidebarItemBadge,
  SidebarSub,
  SidebarOverlay,
}
