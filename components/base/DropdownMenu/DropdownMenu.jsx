'use client'

import { cloneElement, createContext, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronRight, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Contexts ──────────────────────────────────────────────────────────────────

const MenuCtx = createContext(null)
const SubCtx = createContext(null)
const RadioCtx = createContext(null)

// ─── Portal ────────────────────────────────────────────────────────────────────

function MenuPortal({ children }) {
  return createPortal(children, document.body)
}

// ─── Floating position hook ────────────────────────────────────────────────────

function useFloating(triggerRef, contentRef, open, side = 'bottom', posKey = 0) {
  const [style, setStyle] = useState({
    position: 'fixed',
    visibility: 'hidden',
    top: 0,
    left: 0,
    zIndex: 9999,
  })

  useEffect(() => {
    if (!open || !triggerRef?.current || !contentRef?.current) return
    const tr = triggerRef.current.getBoundingClientRect()
    const cr = contentRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const GAP = 4
    let top, left

    if (side === 'right') {
      top = tr.top
      left = tr.right + GAP
      if (left + cr.width > vw - GAP) left = tr.left - cr.width - GAP
      if (top + cr.height > vh - GAP) top = Math.max(GAP, vh - cr.height - GAP)
    } else {
      top = tr.bottom + GAP
      left = tr.left
      if (top + cr.height > vh - GAP) top = tr.top - cr.height - GAP
      if (left + cr.width > vw - GAP) left = tr.right - cr.width
    }

    setStyle({
      position: 'fixed',
      top: Math.max(GAP, top),
      left: Math.max(GAP, left),
      visibility: 'visible',
      zIndex: 9999,
    })
  }, [open, posKey])

  return style
}

// ─── Shared keyboard nav helper ─────────────────────────────────────────────────

function getItems(el) {
  if (!el) return []
  return Array.from(el.querySelectorAll('[data-menu-item]')).filter(
    (el) => !el.hasAttribute('data-disabled')
  )
}

// ─── Item base styles ───────────────────────────────────────────────────────────

const itemBase =
  'w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-sm outline-none cursor-default select-none'
const itemInteractive =
  'hover:bg-violet-50 focus:bg-violet-50 active:bg-violet-100 hover:text-violet-700 focus:text-violet-700'
const itemDisabled = 'opacity-40 cursor-not-allowed pointer-events-none'

// ─── DropdownMenu ───────────────────────────────────────────────────────────────

function DropdownMenu({ children, trigger = 'click' }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)
  const closeTimer = useRef(null)

  const openMenu = () => {
    clearTimeout(closeTimer.current)
    setOpen(true)
  }

  const closeMenu = () => {
    if (trigger === 'hover') {
      closeTimer.current = setTimeout(() => setOpen(false), 150)
    } else {
      setOpen(false)
    }
  }

  const cancelClose = () => clearTimeout(closeTimer.current)

  return (
    <MenuCtx.Provider
      value={{ open, setOpen, openMenu, closeMenu, cancelClose, trigger, triggerRef }}
    >
      {children}
    </MenuCtx.Provider>
  )
}

// ─── DropdownMenuTrigger ────────────────────────────────────────────────────────

function DropdownMenuTrigger({ children, asChild = false }) {
  const { open, openMenu, closeMenu, trigger, triggerRef } = useContext(MenuCtx)
  const handlers =
    trigger === 'hover'
      ? { onMouseEnter: openMenu, onMouseLeave: closeMenu }
      : { onClick: () => (open ? closeMenu() : openMenu()) }

  if (asChild) {
    return cloneElement(children, {
      ref: triggerRef,
      'aria-haspopup': 'menu',
      'aria-expanded': open,
      ...handlers,
    })
  }

  return (
    <span ref={triggerRef} style={{ display: 'inline-block' }} {...handlers}>
      {children}
    </span>
  )
}

// ─── DropdownMenuContent ────────────────────────────────────────────────────────

function DropdownMenuContent({ children, className }) {
  const { open, setOpen, closeMenu, cancelClose, trigger, triggerRef } = useContext(MenuCtx)
  const contentRef = useRef(null)
  const [posKey, setPosKey] = useState(0)
  const floatStyle = useFloating(triggerRef, contentRef, open, 'bottom', posKey)

  useEffect(() => {
    if (!open) return
    const handler = () => setPosKey((k) => k + 1)
    window.addEventListener('scroll', handler, { passive: true, capture: true })
    window.addEventListener('resize', handler, { passive: true })
    return () => {
      window.removeEventListener('scroll', handler, { capture: true })
      window.removeEventListener('resize', handler)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (!contentRef.current?.contains(e.target) && !triggerRef.current?.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (!open || !contentRef.current) return
    const items = getItems(contentRef.current)
    const t = setTimeout(() => items[0]?.focus(), 10)
    return () => clearTimeout(t)
  }, [open])

  const handleKeyDown = (e) => {
    if (!contentRef.current) return
    const items = getItems(contentRef.current)
    const focused = document.activeElement
    const idx = items.indexOf(focused)

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        items[(idx + 1) % items.length]?.focus()
        break
      case 'ArrowUp':
        e.preventDefault()
        items[(idx - 1 + items.length) % items.length]?.focus()
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
        break
      case 'Tab':
        setOpen(false)
        break
      case 'Enter':
      case ' ':
        if (focused?.hasAttribute('data-menu-item')) {
          e.preventDefault()
          focused.click()
        }
        break
    }
  }

  if (!open) return null

  return (
    <MenuPortal>
      <div
        ref={contentRef}
        role="menu"
        style={floatStyle}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onMouseEnter={trigger === 'hover' ? cancelClose : undefined}
        onMouseLeave={trigger === 'hover' ? closeMenu : undefined}
        className={cn(
          'min-w-[10rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-md outline-none',
          className
        )}
      >
        {children}
      </div>
    </MenuPortal>
  )
}

// ─── DropdownMenuItem ────────────────────────────────────────────────────────────

function DropdownMenuItem({
  icon: Icon,
  label,
  shortcut,
  disabled,
  onSelect,
  className,
  children,
}) {
  const { setOpen } = useContext(MenuCtx)

  const handleClick = () => {
    if (disabled) return
    onSelect?.()
    setOpen(false)
  }

  return (
    <button
      type="button"
      role="menuitem"
      data-menu-item=""
      data-disabled={disabled ? '' : undefined}
      disabled={disabled}
      tabIndex={-1}
      onClick={handleClick}
      className={cn(itemBase, itemInteractive, disabled && itemDisabled, className)}
    >
      {Icon && <Icon className="size-4 shrink-0 text-gray-500" />}
      <span className="flex-1 text-left">{label ?? children}</span>
      {shortcut && (
        <span className="ml-auto text-xs text-gray-400 tracking-widest">{shortcut}</span>
      )}
    </button>
  )
}

// ─── DropdownMenuGroup ───────────────────────────────────────────────────────────

function DropdownMenuGroup({ label, children, className }) {
  return (
    <div role="group" aria-label={label} className={className}>
      {label && (
        <p className="px-3 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </p>
      )}
      {children}
    </div>
  )
}

// ─── DropdownMenuSeparator ───────────────────────────────────────────────────────

function DropdownMenuSeparator({ className }) {
  return <div role="separator" className={cn('-mx-1 my-1 h-px bg-gray-100', className)} />
}

// ─── DropdownMenuCheckboxItem ────────────────────────────────────────────────────

function DropdownMenuCheckboxItem({
  label,
  checked,
  onCheckedChange,
  disabled,
  className,
  children,
}) {
  const handleClick = () => {
    if (!disabled) onCheckedChange?.(!checked)
  }

  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      data-menu-item=""
      data-disabled={disabled ? '' : undefined}
      disabled={disabled}
      tabIndex={-1}
      onClick={handleClick}
      className={cn(itemBase, itemInteractive, disabled && itemDisabled, className)}
    >
      <span className="size-4 flex items-center justify-center shrink-0">
        {checked && <Check className="size-3.5 text-violet-600" />}
      </span>
      <span className="flex-1 text-left">{label ?? children}</span>
    </button>
  )
}

// ─── DropdownMenuRadioGroup ──────────────────────────────────────────────────────

function DropdownMenuRadioGroup({ value, onValueChange, children, className }) {
  return (
    <RadioCtx.Provider value={{ value, onValueChange }}>
      <div role="group" className={className}>
        {children}
      </div>
    </RadioCtx.Provider>
  )
}

// ─── DropdownMenuRadioItem ───────────────────────────────────────────────────────

function DropdownMenuRadioItem({ value, label, disabled, className, children }) {
  const { value: groupValue, onValueChange } = useContext(RadioCtx)
  const checked = groupValue === value

  const handleClick = () => {
    if (!disabled) onValueChange?.(value)
  }

  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={checked}
      data-menu-item=""
      data-disabled={disabled ? '' : undefined}
      disabled={disabled}
      tabIndex={-1}
      onClick={handleClick}
      className={cn(itemBase, itemInteractive, disabled && itemDisabled, className)}
    >
      <span className="size-4 flex items-center justify-center shrink-0">
        {checked && <Circle className="size-2 fill-violet-600 text-violet-600" />}
      </span>
      <span className="flex-1 text-left">{label ?? children}</span>
    </button>
  )
}

// ─── DropdownMenuSub ─────────────────────────────────────────────────────────────

function DropdownMenuSub({ children }) {
  const [subOpen, setSubOpen] = useState(false)
  const subTriggerRef = useRef(null)
  const subCloseTimer = useRef(null)

  const openSub = () => {
    clearTimeout(subCloseTimer.current)
    setSubOpen(true)
  }

  const closeSub = () => {
    subCloseTimer.current = setTimeout(() => setSubOpen(false), 150)
  }

  const cancelSubClose = () => clearTimeout(subCloseTimer.current)

  return (
    <SubCtx.Provider
      value={{ subOpen, setSubOpen, openSub, closeSub, cancelSubClose, subTriggerRef }}
    >
      {children}
    </SubCtx.Provider>
  )
}

// ─── DropdownMenuSubTrigger ──────────────────────────────────────────────────────

function DropdownMenuSubTrigger({ label, icon: Icon, disabled, className, children }) {
  const { subOpen, openSub, closeSub, subTriggerRef } = useContext(SubCtx)

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      e.stopPropagation()
      openSub()
    }
  }

  return (
    <button
      ref={subTriggerRef}
      type="button"
      role="menuitem"
      aria-haspopup="menu"
      aria-expanded={subOpen}
      data-menu-item=""
      data-disabled={disabled ? '' : undefined}
      disabled={disabled}
      tabIndex={-1}
      onClick={openSub}
      onMouseEnter={openSub}
      onMouseLeave={closeSub}
      onKeyDown={handleKeyDown}
      className={cn(itemBase, itemInteractive, disabled && itemDisabled, className)}
    >
      {Icon && <Icon className="size-4 shrink-0 text-gray-500" />}
      <span className="flex-1 text-left">{label ?? children}</span>
      <ChevronRight className="size-4 shrink-0 text-gray-400" />
    </button>
  )
}

// ─── DropdownMenuSubContent ──────────────────────────────────────────────────────

function DropdownMenuSubContent({ children, className }) {
  const { subOpen, setSubOpen, closeSub, cancelSubClose, subTriggerRef } = useContext(SubCtx)
  const contentRef = useRef(null)
  const [posKey, setPosKey] = useState(0)
  const floatStyle = useFloating(subTriggerRef, contentRef, subOpen, 'right', posKey)

  useEffect(() => {
    if (!subOpen) return
    const handler = () => setPosKey((k) => k + 1)
    window.addEventListener('scroll', handler, { passive: true, capture: true })
    window.addEventListener('resize', handler, { passive: true })
    return () => {
      window.removeEventListener('scroll', handler, { capture: true })
      window.removeEventListener('resize', handler)
    }
  }, [subOpen])

  useEffect(() => {
    if (!subOpen || !contentRef.current) return
    const items = getItems(contentRef.current)
    const t = setTimeout(() => items[0]?.focus(), 10)
    return () => clearTimeout(t)
  }, [subOpen])

  const handleKeyDown = (e) => {
    if (!contentRef.current) return

    if (e.key === 'ArrowLeft' || e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      setSubOpen(false)
      subTriggerRef.current?.focus()
      return
    }

    const items = getItems(contentRef.current)
    const focused = document.activeElement
    const idx = items.indexOf(focused)

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        items[(idx + 1) % items.length]?.focus()
        break
      case 'ArrowUp':
        e.preventDefault()
        items[(idx - 1 + items.length) % items.length]?.focus()
        break
      case 'Enter':
      case ' ':
        if (focused?.hasAttribute('data-menu-item')) {
          e.preventDefault()
          focused.click()
        }
        break
    }
  }

  if (!subOpen) return null

  return (
    <MenuPortal>
      <div
        ref={contentRef}
        role="menu"
        style={floatStyle}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onMouseEnter={cancelSubClose}
        onMouseLeave={closeSub}
        className={cn(
          'min-w-[10rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-md outline-none',
          className
        )}
      >
        {children}
      </div>
    </MenuPortal>
  )
}

// ─── Exports ───────────────────────────────────────────────────────────────────

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
