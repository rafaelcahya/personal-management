'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2, CornerDownLeft } from 'lucide-react'
import { Modal, ModalContent } from '@/components/base/Modal/Modal'
import { cn } from '@/lib/utils'
import { COMMAND_GROUPS } from '../lib/navItems'
import { fuzzyScore } from '../lib/fuzzyMatch'
import { searchEntities } from '../lib/entitySearch'

const ENTITY_DEBOUNCE_MS = 250
const FIELD_STYLING =
  'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500'

// Page destinations as flat rows the palette can score and render.
const PAGE_GROUPS = COMMAND_GROUPS.map((group) => ({
  module: group.module,
  items: group.items.map((item) => ({
    id: `page-${item.href}`,
    label: item.tooltip ?? item.name,
    sublabel: group.module,
    href: item.href,
    icon: item.icon,
  })),
}))

function filterPageGroups(query) {
  if (!query.trim()) return PAGE_GROUPS
  return PAGE_GROUPS.map((group) => {
    const scored = group.items
      .map((item) => ({ item, score: fuzzyScore(query, `${item.label} ${group.module}`) }))
      .filter(({ score }) => score !== -Infinity)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item)
    return { module: group.module, items: scored }
  }).filter((group) => group.items.length > 0)
}

export default function CommandPalette({ open, onOpenChange }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [entityGroups, setEntityGroups] = useState([])
  const [entityLoading, setEntityLoading] = useState(false)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const restoreFocusRef = useRef(null)

  const pageGroups = useMemo(() => filterPageGroups(query), [query])
  const visibleGroups = useMemo(() => [...pageGroups, ...entityGroups], [pageGroups, entityGroups])
  const flatItems = useMemo(() => visibleGroups.flatMap((g) => g.items), [visibleGroups])

  // Reset transient state on open and remember what to refocus on close.
  useEffect(() => {
    if (!open) {
      if (restoreFocusRef.current instanceof HTMLElement) restoreFocusRef.current.focus()
      return
    }

    restoreFocusRef.current = document.activeElement
    setQuery('')
    setActiveIndex(0)
    setEntityGroups([])
    setEntityLoading(false)

    // Modal focuses its own panel on mount, so claim focus twice: once on the next frame,
    // and again after the open animation settles — whichever wins, the input ends up focused.
    const focusInput = () => inputRef.current?.focus()
    const raf = requestAnimationFrame(focusInput)
    const timer = setTimeout(focusInput, 80)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [open])

  // Debounced entity search with a stale-query guard (the list APIs take no AbortSignal).
  useEffect(() => {
    if (!open) return
    const q = query.trim()
    if (q.length < 2) {
      setEntityGroups([])
      setEntityLoading(false)
      return
    }
    setEntityLoading(true)
    const handle = setTimeout(async () => {
      const groups = await searchEntities(q)
      if (inputRef.current?.value.trim() === q) {
        setEntityGroups(groups)
        setEntityLoading(false)
      }
    }, ENTITY_DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [query, open])

  useEffect(() => {
    setActiveIndex((prev) => (prev >= flatItems.length ? 0 : prev))
  }, [flatItems.length])

  // Keep the highlighted row in view as the user arrows through results.
  useEffect(() => {
    const active = listRef.current?.querySelector('[aria-selected="true"]')
    active?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  const navigateTo = useCallback(
    (href) => {
      onOpenChange(false)
      router.push(href)
    },
    [onOpenChange, router]
  )

  const onKeyDown = (e) => {
    if (!flatItems.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % flatItems.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + flatItems.length) % flatItems.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const target = flatItems[activeIndex]
      if (target) navigateTo(target.href)
    }
  }

  const hasResults = flatItems.length > 0
  let rowIndex = -1

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        size="md"
        radius="lg"
        showCloseButton={false}
        closeOnOverlayClick
        className="mt-[10vh] self-start !p-0 !gap-0 overflow-hidden"
      >
        <div className="flex items-center gap-2.5 border-b border-border px-4">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            id="commandPaletteInput_navbar"
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="commandPaletteList_navbar"
            aria-activedescendant={hasResults ? `commandPaletteOption_${activeIndex}` : undefined}
            aria-autocomplete="list"
            autoFocus
            autoComplete="off"
            spellCheck="false"
            placeholder="Search pages, products, activities, races…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={onKeyDown}
            className={cn(
              'h-12 w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none',
              FIELD_STYLING
            )}
          />
          {entityLoading && (
            <Loader2
              className="size-4 shrink-0 animate-spin text-muted-foreground"
              aria-hidden="true"
            />
          )}
        </div>

        <ul
          id="commandPaletteList_navbar"
          ref={listRef}
          role="listbox"
          aria-label="Search results"
          className="max-h-[min(60vh,24rem)] overflow-y-auto p-2"
        >
          {!hasResults && (
            <li
              id="commandPaletteEmpty_navbar"
              role="presentation"
              className="px-3 py-8 text-center text-sm text-muted-foreground"
            >
              {entityLoading ? 'Searching…' : 'No results'}
            </li>
          )}

          {visibleGroups.map((group) => (
            <li key={group.module} role="presentation">
              <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {group.module}
              </p>
              <ul role="presentation">
                {group.items.map((item) => {
                  rowIndex += 1
                  const index = rowIndex
                  const Icon = item.icon
                  const selected = index === activeIndex
                  return (
                    <li
                      key={item.id}
                      id={`commandPaletteOption_${index}`}
                      role="option"
                      aria-selected={selected}
                      onMouseMove={() => setActiveIndex(index)}
                      onClick={() => navigateTo(item.href)}
                      className={cn(
                        'flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm',
                        selected ? 'bg-secondary text-primary' : 'text-foreground'
                      )}
                    >
                      {Icon && (
                        <Icon
                          className={cn(
                            'size-4 shrink-0',
                            selected ? 'text-primary' : 'text-muted-foreground'
                          )}
                          aria-hidden="true"
                        />
                      )}
                      <span className="min-w-0 flex-1 truncate font-medium">{item.label}</span>
                      {item.sublabel && item.sublabel !== group.module && (
                        <span className="shrink-0 truncate text-xs text-muted-foreground">
                          {item.sublabel}
                        </span>
                      )}
                      {selected && (
                        <CornerDownLeft
                          className="size-3.5 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ul>
      </ModalContent>
    </Modal>
  )
}
