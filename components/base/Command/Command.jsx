'use client'

import { createContext, useContext, useState, useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Context ──────────────────────────────────────────────────────────────────

const CommandCtx = createContext(null)
const useCommand = () => useContext(CommandCtx)

// ─── Command ──────────────────────────────────────────────────────────────────

export function Command({ children, open: openProp, onOpenChange }) {
  const [openState, setOpenState] = useState(false)
  const [query, setQuery] = useState('')

  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : openState

  // Stable ref so the global keydown listener always calls the latest setOpen
  const setOpenRef = useRef(null)
  setOpenRef.current = (val) => {
    if (!isControlled) setOpenState(val)
    onOpenChange?.(val)
    if (!val) setQuery('')
  }

  const setOpen = (val) => setOpenRef.current(val)

  useEffect(() => {
    function handler(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpenRef.current(true)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <CommandCtx.Provider value={{ query, setQuery, open, setOpen }}>{children}</CommandCtx.Provider>
  )
}

// ─── CommandTrigger ───────────────────────────────────────────────────────────

export function CommandTrigger({ children, className, ...props }) {
  const { setOpen } = useCommand()
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={cn(
        'flex items-center gap-2 text-sm text-gray-500 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors',
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <Search className="size-4 shrink-0" />
          <span>Search…</span>
          <kbd className="ml-auto text-[10px] font-mono bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-gray-400">
            ⌘K
          </kbd>
        </>
      )}
    </button>
  )
}

// ─── CommandDialog ────────────────────────────────────────────────────────────

export function CommandDialog({ children }) {
  const { open, setOpen, query } = useCommand()
  const [activeIndex, setActiveIndex] = useState(0)
  const panelRef = useRef(null)

  // Reset active item when search changes
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  // Stamp data-active on visible items after every render
  useLayoutEffect(() => {
    if (!open || !panelRef.current) return
    getVisibleItems().forEach((el, i) => {
      el.setAttribute('data-active', String(i === activeIndex))
    })
  })

  function getVisibleItems() {
    return [...(panelRef.current?.querySelectorAll('[data-command-item]:not([hidden])') ?? [])]
  }

  function handleKeyDown(e) {
    const items = getVisibleItems()

    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      return
    }
    if (!items.length) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % items.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + items.length) % items.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      items[activeIndex]?.click()
    }
  }

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[18vh]"
      onKeyDown={handleKeyDown}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={() => setOpen(false)}
      />
      {/* Panel */}
      <div
        ref={panelRef}
        className="relative z-10 w-full max-w-lg mx-4 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

// ─── CommandInput ─────────────────────────────────────────────────────────────

export function CommandInput({ placeholder = 'Type to search…', className, ...props }) {
  const { query, setQuery } = useCommand()
  const inputRef = useRef(null)

  useEffect(() => {
    // Small delay lets the portal mount before focusing
    const t = setTimeout(() => inputRef.current?.focus(), 0)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
      <Search className="size-4 text-gray-400 shrink-0" />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'flex-1 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-400',
          className
        )}
        {...props}
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}

// ─── CommandList ──────────────────────────────────────────────────────────────

export function CommandList({ children, className }) {
  return (
    <div data-command-list="" className={cn('max-h-80 overflow-y-auto py-2', className)}>
      {children}
    </div>
  )
}

// ─── CommandGroup ─────────────────────────────────────────────────────────────

export function CommandGroup({ label, children }) {
  const containerRef = useRef(null)
  const [hasVisible, setHasVisible] = useState(true)

  // After every render, check whether any child items are still visible
  useLayoutEffect(() => {
    if (!containerRef.current) return
    const items = containerRef.current.querySelectorAll('[data-command-item]')
    const anyVisible = Array.from(items).some((el) => !el.hidden)
    setHasVisible(anyVisible)
  })

  return (
    <div style={{ display: hasVisible ? '' : 'none' }}>
      {label && (
        <p className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 select-none">
          {label}
        </p>
      )}
      <div ref={containerRef}>{children}</div>
    </div>
  )
}

// ─── CommandItem ──────────────────────────────────────────────────────────────

export function CommandItem({ icon: Icon, label, shortcut, onSelect, className, ...props }) {
  const { query, setOpen } = useCommand()

  const isFiltered =
    !!query &&
    !String(label ?? '')
      .toLowerCase()
      .includes(query.toLowerCase())

  function handleSelect() {
    onSelect?.()
    setOpen(false)
  }

  return (
    <div
      data-command-item=""
      data-active="false"
      hidden={isFiltered || undefined}
      onClick={handleSelect}
      className={cn(
        'mx-2 flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-sm text-gray-700 select-none transition-colors',
        'data-[active=true]:bg-gray-100 data-[active=true]:text-gray-900',
        className
      )}
      {...props}
    >
      {Icon && <Icon className="size-4 text-gray-500 shrink-0" />}
      <span className="flex-1 truncate">{label}</span>
      {shortcut && (
        <span className="flex items-center gap-1 shrink-0">
          {shortcut.split(' ').map((k, i) => (
            <kbd
              key={i}
              className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-gray-100 border border-gray-200 rounded text-gray-500"
            >
              {k}
            </kbd>
          ))}
        </span>
      )}
    </div>
  )
}

// ─── CommandSeparator ─────────────────────────────────────────────────────────

export function CommandSeparator({ className }) {
  return <hr className={cn('my-1.5 border-gray-100', className)} />
}

// ─── CommandEmpty ─────────────────────────────────────────────────────────────

export function CommandEmpty({ children }) {
  const ref = useRef(null)
  const [show, setShow] = useState(false)

  useLayoutEffect(() => {
    const list = ref.current?.closest('[data-command-list]')
    if (!list) return
    const visible = list.querySelectorAll('[data-command-item]:not([hidden])')
    setShow(visible.length === 0)
  })

  return (
    <div
      ref={ref}
      style={{ display: show ? '' : 'none' }}
      className="py-10 text-center text-sm text-gray-400"
    >
      {children ?? 'No results found.'}
    </div>
  )
}
