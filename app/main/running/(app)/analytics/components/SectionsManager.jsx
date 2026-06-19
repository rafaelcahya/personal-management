'use client'

import { useState, useEffect } from 'react'
import { LayoutList, ArrowRight, Search, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import { Checkbox } from '@/components/ui/checkbox'
import { ANALYTICS_SECTIONS } from '../sections'

function scrollToSection(id, onClose) {
  const el = document.getElementById(id)
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
  onClose()
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
        <Search className="absolute left-6 top-[22px] size-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search sections..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-7 pr-7 py-1.5 text-xs border border-slate-200 rounded-md bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-violet-300 focus:border-violet-400"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-6 top-[22px] text-slate-400 hover:text-slate-600"
            aria-label="Clear search"
          >
            <X className="size-3" />
          </button>
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
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md ${
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
              <label
                htmlFor={`toggle-${section.id}`}
                className="flex-1 text-xs cursor-pointer select-none"
              >
                {section.label}
              </label>
              <button
                onClick={() => scrollToSection(section.id, onClose)}
                className="shrink-0 p-0.5 rounded text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                aria-label={`Jump to ${section.label}`}
              >
                <ArrowRight className="size-3" />
              </button>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-2 px-3 py-2.5 border-t border-slate-100 mt-1">
        <button
          onClick={showAll}
          className="flex-1 text-xs py-1 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
        >
          Show all
        </button>
        <button
          onClick={resetToDefault}
          className="flex-1 text-xs py-1 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
        >
          Reset to default
        </button>
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
      <span className="hidden md:inline">
        Sections ({visibleCount}/{total})
      </span>
      <span
        className="md:hidden inline-flex items-center justify-center size-4 text-[10px] font-bold bg-violet-100 text-violet-700 rounded-full"
        aria-label={`${visibleCount} sections visible`}
      >
        {visibleCount}
      </span>
    </>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            id="sectionsManager_analytics"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-500 hover:bg-slate-200 transition-colors"
            aria-label="Manage sections"
          >
            {triggerContent}
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="px-0 pb-0 gap-0 rounded-t-xl">
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
        <button
          id="sectionsManager_analytics"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-500 hover:bg-slate-200 transition-colors"
          aria-label="Manage sections"
        >
          {triggerContent}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <SectionsContent {...contentProps} />
      </PopoverContent>
    </Popover>
  )
}
