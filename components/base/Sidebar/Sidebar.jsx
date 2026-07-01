'use client'
import { Children, cloneElement, createContext, useContext, useEffect, useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
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
      <TooltipPrimitive.Provider delayDuration={300}>
        <DialogPrimitive.Root open={isMobile && open} onOpenChange={(o) => setOpen(o)}>
          {children}
        </DialogPrimitive.Root>
      </TooltipPrimitive.Provider>
    </SidebarContext.Provider>
  )
}

function SidebarOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-40 bg-black/50',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        className
      )}
      {...props}
    />
  )
}

function Sidebar({ className, side = 'left', children, ...props }) {
  const { collapsed, isMobile, collapseAnimation } = useSidebar()

  if (isMobile) {
    return (
      <DialogPrimitive.Content
        className={cn(
          'fixed inset-y-0 z-50 flex flex-col bg-white w-72',
          'data-[state=open]:animate-in data-[state=closed]:animate-out duration-200',
          side === 'left'
            ? 'left-0 border-r border-gray-200 data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left'
            : 'right-0 border-l border-gray-200 data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right',
          className
        )}
        aria-label="Navigation sidebar"
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
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
        'flex-1 text-sm truncate whitespace-nowrap',
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
  sm: { px: 'px-1.5', rest: 'py-1 min-h-[32px] gap-2', icon: 'size-4' },
  md: { px: 'px-2', rest: 'py-1.5 min-h-[38px] gap-2', icon: 'size-4' },
  lg: { px: 'px-2', rest: 'py-2 min-h-[44px] gap-2.5', icon: 'size-5' },
}

function SidebarItem({
  icon,
  label,
  badge,
  size = 'md',
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

  const sz = itemSizeClasses[size] ?? itemSizeClasses.md

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
        {label && <SidebarItemLabel>{label}</SidebarItemLabel>}
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
    return (
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <div>{content}</div>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side="right"
            sideOffset={8}
            className="z-50 px-2.5 py-1.5 rounded-md bg-gray-900 text-white text-xs font-medium shadow-md"
          >
            {label}
            <TooltipPrimitive.Arrow className="fill-gray-900" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    )
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
