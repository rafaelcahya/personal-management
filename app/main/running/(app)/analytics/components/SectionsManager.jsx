'use client'

import { FieldLabel } from '@/components/base/Field/Field'
import { useState, useEffect } from 'react'
import { LayoutList, ArrowRight, Search, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/Popover/Popover'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/base/Sheet/Sheet'
import { Checkbox } from '@/components/base/Checkbox/Checkbox'
import { ANALYTICS_SECTIONS } from '../sections'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'

const SCROLL_OFFSET_PX = 80
const ALIGN_TOLERANCE_PX = 4
const MAX_ALIGN_PASSES = 4
const SETTLE_DELAY_MS = 150
const SCROLLEND_FALLBACK_MS = 900

// Lazy blocks above the target mount (and grow) while the smooth scroll is running, so a single
// computed offset lands too high. Re-measure after each scroll settles and correct the remainder.
function scrollToSection(id, onClose) {
  onClose()
  const el = document.getElementById(id)
  if (!el) return

  let pass = 0
  let cancelled = false
  const cancel = () => {
    cancelled = true
  }
  window.addEventListener('wheel', cancel, { once: true, passive: true })
  window.addEventListener('touchstart', cancel, { once: true, passive: true })

  const cleanup = () => {
    window.removeEventListener('wheel', cancel)
    window.removeEventListener('touchstart', cancel)
  }

  const align = () => {
    if (cancelled || !el.isConnected) return cleanup()
    const delta = el.getBoundingClientRect().top - SCROLL_OFFSET_PX
    if (Math.abs(delta) <= ALIGN_TOLERANCE_PX || pass >= MAX_ALIGN_PASSES) return cleanup()

    pass += 1
    window.scrollBy({ top: delta, behavior: pass === 1 ? 'smooth' : 'auto' })

    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      window.removeEventListener('scrollend', finish)
      clearTimeout(fallback)
      setTimeout(align, SETTLE_DELAY_MS)
    }
    const fallback = setTimeout(finish, SCROLLEND_FALLBACK_MS)
    window.addEventListener('scrollend', finish, { once: true })
  }

  align()
}

function SectionsContent({
  visibility,
  setVisible,
  showAll,
  resetToDefault,
  visibleCount,
  total,
  onClose,
}) {
  const [search, setSearch] = useState('')

  const filtered = ANALYTICS_SECTIONS.filter((s) =>
    s.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col">
      <div className="relative px-3 pt-3 pb-2">
        <Search className="absolute left-6 top-[22px] max-lg:top-[27px] size-3.5 text-slate-400 pointer-events-none" />
        <Input
          type="text"
          placeholder="Search sections..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-7 pr-7 max-lg:pr-12 h-auto py-1.5 max-lg:min-h-11 text-xs border-slate-200 bg-slate-50"
        />
        {search && (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setSearch('')}
            className="absolute right-6 top-[22px] max-lg:right-3 max-lg:top-3 max-lg:size-11 text-slate-400 hover:text-slate-600"
            aria-label="Clear search"
          >
            <X className="size-3" />
          </Button>
        )}
      </div>

      <div className="overflow-y-auto max-h-64 px-1 py-1">
        {filtered.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-4">No sections found</p>
        )}
        {filtered.map((section) => {
          const isVisible = visibility[section.id] ?? section.defaultVisible
          return (
            <div
              key={section.id}
              className={`flex items-center gap-2 px-2 py-1.5 max-lg:min-h-11 rounded-md ${
                isVisible ? 'text-slate-700' : 'text-slate-400'
              }`}
            >
              <Checkbox
                id={`toggle-${section.id}`}
                checked={isVisible}
                onCheckedChange={(checked) => setVisible(section.id, !!checked)}
                className="shrink-0"
                role="menuitemcheckbox"
                aria-checked={isVisible}
                aria-label={`Toggle ${section.label}`}
              />
              <FieldLabel
                htmlFor={`toggle-${section.id}`}
                className="flex-1 text-xs cursor-pointer select-none"
              >
                {section.label}
              </FieldLabel>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => scrollToSection(section.id, onClose)}
                className="shrink-0 p-0.5 max-lg:min-h-11 max-lg:min-w-11 rounded text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                aria-label={`Jump to ${section.label}`}
              >
                <ArrowRight className="size-3" />
              </Button>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-2 px-3 py-2.5 border-t border-slate-100 mt-1">
        <Button
          onClick={showAll}
          variant="ghost"
          size="xs"
          className="flex-1 text-xs py-1 max-lg:min-h-11 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
        >
          Show all
        </Button>
        <Button
          onClick={resetToDefault}
          variant="ghost"
          size="xs"
          className="flex-1 text-xs py-1 max-lg:min-h-11 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
        >
          Reset to default
        </Button>
      </div>
    </div>
  )
}

export default function SectionsManager({
  visibility,
  setVisible,
  showAll,
  resetToDefault,
  visibleCount,
  total,
}) {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const contentProps = {
    visibility,
    setVisible,
    showAll,
    resetToDefault,
    visibleCount,
    total,
    onClose: () => setOpen(false),
  }

  const triggerContent = (
    <>
      <LayoutList className="size-3.5" aria-hidden="true" />
      <span>
        Sections ({visibleCount}/{total})
      </span>
    </>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            id="sectionsManager_analytics"
            variant="ghost"
            className="flex items-center gap-1.5 px-2.5 py-1 max-lg:min-h-11 rounded-md text-xs font-medium text-slate-500 hover:bg-slate-200 transition-colors"
            aria-label="Manage sections"
          >
            {triggerContent}
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          size="auto"
          className="px-0 pb-0 gap-0 rounded-t-xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader className="px-4 pt-4 pb-2">
            <SheetTitle className="text-sm">Sections</SheetTitle>
          </SheetHeader>
          <SectionsContent {...contentProps} />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          id="sectionsManager_analytics"
          className="flex items-center gap-1.5 px-2.5 py-1 max-lg:min-h-11 rounded-md text-xs font-medium text-slate-500 hover:bg-slate-200 transition-colors"
          aria-label="Manage sections"
        >
          {triggerContent}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <SectionsContent {...contentProps} />
      </PopoverContent>
    </Popover>
  )
}
