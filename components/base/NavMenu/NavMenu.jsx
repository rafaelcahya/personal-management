'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useId,
} from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Contexts ─────────────────────────────────────────────────────────────────

const NavMenuCtx = createContext(null)
const NavMenuItemCtx = createContext(null)

const useNavMenu = () => useContext(NavMenuCtx)
const useNavMenuItem = () => useContext(NavMenuItemCtx)

// ─── NavMenu ──────────────────────────────────────────────────────────────────

export function NavMenu({
  children,
  trigger = 'hover',
  closeDelay = 150,
  value,
  onValueChange,
  className,
}) {
  const [activeState, setActiveState] = useState(null)
  const isControlled = value !== undefined
  const activeMenu = isControlled ? value : activeState
  const closeTimer = useRef(null)
  const rootRef = useRef(null)

  function setActiveMenu(id) {
    clearTimeout(closeTimer.current)
    if (!isControlled) setActiveState(id)
    onValueChange?.(id)
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => {
      if (!isControlled) setActiveState(null)
      onValueChange?.(null)
    }, closeDelay)
  }

  function cancelClose() {
    clearTimeout(closeTimer.current)
  }

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setActiveMenu(null)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (trigger !== 'click') return
    const handler = (e) => {
      if (!rootRef.current?.contains(e.target)) setActiveMenu(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [trigger])

  return (
    <NavMenuCtx.Provider
      value={{ activeMenu, setActiveMenu, scheduleClose, cancelClose, trigger, rootRef }}
    >
      <nav ref={rootRef} className={cn('relative', className)}>
        {children}
      </nav>
    </NavMenuCtx.Provider>
  )
}

// ─── NavMenuList ──────────────────────────────────────────────────────────────

export function NavMenuList({ children, className }) {
  const { activeMenu, rootRef } = useNavMenu()
  const listRef = useRef(null)
  const [underline, setUnderline] = useState({ left: 0, width: 0, visible: false })

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const active = list.querySelector('[data-nav-trigger][data-active="true"]')
    if (active) {
      const lr = list.getBoundingClientRect()
      const tr = active.getBoundingClientRect()
      setUnderline({ left: tr.left - lr.left, width: tr.width, visible: true })
    } else {
      setUnderline((prev) => ({ ...prev, visible: false }))
    }
  }, [activeMenu])

  return (
    <div ref={listRef} className={cn('relative flex items-center gap-0.5 pb-px', className)}>
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-primary transition-all duration-200 ease-out"
        style={{
          width: underline.width,
          transform: `translateX(${underline.left}px)`,
          opacity: underline.visible ? 1 : 0,
        }}
      />
    </div>
  )
}

// ─── NavMenuItem ──────────────────────────────────────────────────────────────

export function NavMenuItem({ children, id: idProp, className }) {
  const genId = useId()
  const id = idProp ?? genId
  const containerRef = useRef(null)
  const { activeMenu, setActiveMenu, scheduleClose, cancelClose, trigger } = useNavMenu()
  const isOpen = activeMenu === id

  const hoverHandlers =
    trigger === 'hover'
      ? {
          onMouseEnter: () => {
            cancelClose()
            setActiveMenu(id)
          },
          onMouseLeave: scheduleClose,
        }
      : {}

  return (
    <NavMenuItemCtx.Provider value={{ id, isOpen, setActiveMenu, containerRef }}>
      <div ref={containerRef} className={cn('relative', className)} {...hoverHandlers}>
        {children}
      </div>
    </NavMenuItemCtx.Provider>
  )
}

// ─── NavMenuTrigger ───────────────────────────────────────────────────────────

export function NavMenuTrigger({ children, icon: Icon, className }) {
  const { trigger } = useNavMenu()
  const { id, isOpen, setActiveMenu } = useNavMenuItem()

  return (
    <button
      type="button"
      data-nav-trigger=""
      data-active={String(isOpen)}
      aria-expanded={isOpen}
      onClick={() => {
        if (trigger === 'click') setActiveMenu(isOpen ? null : id)
      }}
      className={cn(
        'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium',
        'text-foreground hover:text-foreground hover:bg-accent transition-colors',
        isOpen && 'text-foreground bg-accent',
        className
      )}
    >
      {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
      {children}
      <ChevronDown
        className={cn(
          'size-3.5 text-muted-foreground transition-transform duration-200 ml-0.5',
          isOpen && 'rotate-180'
        )}
      />
    </button>
  )
}

// ─── NavMenuIndicator ─────────────────────────────────────────────────────────

export function NavMenuIndicator({ className }) {
  const { isOpen } = useNavMenuItem()

  return (
    <div
      aria-hidden="true"
      className={cn(
        'absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full z-[51]',
        'pointer-events-none transition-opacity duration-150',
        isOpen ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      <div className="mt-[3px] size-[10px] rotate-45 bg-popover border-l border-t border-border" />
    </div>
  )
}

// ─── NavMenuContent ───────────────────────────────────────────────────────────

const contentWidthMap = {
  1: 'min-w-48',
  2: 'w-[480px]',
  3: 'w-[640px]',
  4: 'w-[800px]',
}

const contentColsMap = {
  1: '',
  2: 'grid grid-cols-2 gap-2',
  3: 'grid grid-cols-3 gap-2',
  4: 'grid grid-cols-4 gap-2',
}

const contentAlignMap = {
  start: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
  end: 'right-0',
}

export function NavMenuContent({ children, columns = 1, align = 'start', className }) {
  const { isOpen, containerRef } = useNavMenuItem()
  const { cancelClose, scheduleClose, trigger } = useNavMenu()
  const contentRef = useRef(null)
  const [style, setStyle] = useState({
    position: 'fixed',
    visibility: 'hidden',
    top: 0,
    left: 0,
    zIndex: 9999,
  })

  useEffect(() => {
    if (!isOpen) return
    const reposition = () => {
      if (!containerRef?.current || !contentRef?.current) return
      const tr = containerRef.current.getBoundingClientRect()
      const cr = contentRef.current.getBoundingClientRect()
      const vw = window.innerWidth
      let left
      if (align === 'start') left = tr.left
      else if (align === 'center') left = tr.left + tr.width / 2 - cr.width / 2
      else left = tr.right - cr.width
      left = Math.max(4, Math.min(left, vw - cr.width - 4))
      setStyle({ position: 'fixed', top: tr.bottom + 8, left, visibility: 'visible', zIndex: 9999 })
    }
    reposition()
    window.addEventListener('scroll', reposition, { passive: true, capture: true })
    window.addEventListener('resize', reposition, { passive: true })
    return () => {
      window.removeEventListener('scroll', reposition, { capture: true })
      window.removeEventListener('resize', reposition)
    }
  }, [isOpen, align])

  const hoverHandlers =
    trigger === 'hover' ? { onMouseEnter: cancelClose, onMouseLeave: scheduleClose } : {}

  if (!isOpen) return null

  return createPortal(
    <div
      ref={contentRef}
      style={style}
      className={cn(
        contentWidthMap[columns] ?? 'min-w-48',
        'bg-popover rounded-xl border border-border shadow-lg',
        className
      )}
      {...hoverHandlers}
    >
      <div className={cn('p-2', contentColsMap[columns])}>{children}</div>
    </div>,
    document.body
  )
}

// ─── NavMenuLink ──────────────────────────────────────────────────────────────

export function NavMenuLink({
  as: As = 'a',
  href,
  active,
  icon: Icon,
  children,
  className,
  ...props
}) {
  return (
    <As
      href={href}
      data-nav-trigger=""
      data-active={String(!!active)}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
        'text-foreground hover:text-foreground hover:bg-accent',
        active && 'text-primary bg-secondary',
        className
      )}
      {...props}
    >
      {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
      {children}
    </As>
  )
}

// ─── NavMenuGroup ─────────────────────────────────────────────────────────────

export function NavMenuGroup({ children, className }) {
  return <div className={cn('flex flex-col gap-0.5 p-1', className)}>{children}</div>
}

// ─── NavMenuGroupTitle ────────────────────────────────────────────────────────

export function NavMenuGroupTitle({ children, className }) {
  return (
    <p
      className={cn(
        'px-2 pt-1 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground select-none',
        className
      )}
    >
      {children}
    </p>
  )
}

// ─── NavMenuGroupItem ─────────────────────────────────────────────────────────

export function NavMenuGroupItem({
  as: As = 'a',
  href,
  active,
  icon: Icon,
  label,
  description,
  className,
  ...props
}) {
  return (
    <As
      href={href}
      className={cn(
        'flex items-start gap-3 px-2 py-2 rounded-lg transition-colors group cursor-pointer',
        'hover:bg-accent',
        active && 'bg-secondary',
        className
      )}
      {...props}
    >
      {Icon && (
        <div
          className={cn(
            'shrink-0 size-8 rounded-md flex items-center justify-center transition-colors',
            'bg-muted text-muted-foreground group-hover:bg-secondary group-hover:text-primary',
            active && 'bg-secondary text-primary'
          )}
        >
          <Icon className="size-4" />
        </div>
      )}
      <div className="flex flex-col min-w-0">
        <span
          className={cn(
            'text-sm font-medium text-foreground leading-tight',
            active && 'text-primary'
          )}
        >
          {label}
        </span>
        {description && (
          <span className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {description}
          </span>
        )}
      </div>
    </As>
  )
}

// ─── NavMenuSeparator ─────────────────────────────────────────────────────────

export function NavMenuSeparator({ className }) {
  return <hr className={cn('my-1 border-border', className)} />
}

// ─── NavMenuSub (nested flyout) ───────────────────────────────────────────────

const NavMenuSubCtx = createContext(null)
const useNavMenuSub = () => useContext(NavMenuSubCtx)

export function NavMenuSubItem({ children, className }) {
  const [isOpen, setIsOpen] = useState(false)
  const closeTimer = useRef(null)

  function open() {
    clearTimeout(closeTimer.current)
    setIsOpen(true)
  }

  function scheduleSubClose() {
    closeTimer.current = setTimeout(() => setIsOpen(false), 150)
  }

  function cancelSubClose() {
    clearTimeout(closeTimer.current)
  }

  return (
    <NavMenuSubCtx.Provider value={{ isOpen, open, scheduleSubClose, cancelSubClose }}>
      <div
        className={cn('relative', className)}
        onMouseEnter={() => {
          cancelSubClose()
          open()
        }}
        onMouseLeave={scheduleSubClose}
      >
        {children}
      </div>
    </NavMenuSubCtx.Provider>
  )
}

export function NavMenuSubTrigger({ children, icon: Icon, className }) {
  const { isOpen } = useNavMenuSub()

  return (
    <div
      role="menuitem"
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-default select-none',
        'text-foreground hover:text-foreground hover:bg-accent',
        isOpen && 'bg-accent text-foreground',
        className
      )}
    >
      {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
      <span className="flex-1">{children}</span>
      <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
    </div>
  )
}

export function NavMenuSubContent({ children, className }) {
  const { isOpen, cancelSubClose, scheduleSubClose } = useNavMenuSub()

  if (!isOpen) return null

  return (
    <div
      className={cn(
        'absolute left-full top-0 z-50 ml-1',
        'min-w-48 bg-popover rounded-xl border border-border shadow-lg overflow-hidden',
        className
      )}
      onMouseEnter={cancelSubClose}
      onMouseLeave={scheduleSubClose}
    >
      <div className="p-2">{children}</div>
    </div>
  )
}
