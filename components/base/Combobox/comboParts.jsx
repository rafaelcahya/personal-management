'use client'

import { clsx } from 'clsx'
import { Check, X } from 'lucide-react'

// ─── Helpers ───────────────────────────────────────────────────────────────────

export function isGroup(opt) {
  return opt && 'group' in opt && 'items' in opt
}

export function flattenOptions(options) {
  return options.flatMap((opt) => (isGroup(opt) ? opt.items : [opt]))
}

export function filterOptions(options, query) {
  const q = query.trim().toLowerCase()
  if (!q) return options
  return options
    .map((opt) => {
      if (isGroup(opt)) {
        const items = opt.items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) || String(item.value).toLowerCase().includes(q)
        )
        return items.length ? { ...opt, items } : null
      }
      return opt.label.toLowerCase().includes(q) || String(opt.value).toLowerCase().includes(q)
        ? opt
        : null
    })
    .filter(Boolean)
}

// ─── ComboOption ───────────────────────────────────────────────────────────────

export function ComboOption({ option, isSelected, onSelect }) {
  return (
    <button
      type="button"
      disabled={option.disabled}
      onClick={() => onSelect(option)}
      className={clsx(
        'w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded text-left transition-colors',
        isSelected ? 'bg-violet-50 text-violet-700 font-medium' : 'text-gray-700 hover:bg-gray-100',
        option.disabled && 'opacity-40 pointer-events-none'
      )}
    >
      <Check
        className={clsx(
          'size-3.5 shrink-0 transition-opacity',
          isSelected ? 'opacity-100' : 'opacity-0'
        )}
      />
      {option.label}
    </button>
  )
}

// ─── ComboGroup ────────────────────────────────────────────────────────────────

export function ComboGroup({ group, items, selectedValues, onSelect }) {
  return (
    <div>
      <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
        {group}
      </div>
      {items.map((item) => (
        <ComboOption
          key={item.value}
          option={item}
          isSelected={selectedValues.has(item.value)}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

// ─── ComboTag ──────────────────────────────────────────────────────────────────

export function ComboTag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-0.5 pl-2 pr-1 py-0.5 bg-violet-100 text-violet-700 text-xs font-medium rounded shrink-0">
      {label}
      <button
        type="button"
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="rounded hover:bg-violet-200 transition-colors p-0.5"
      >
        <X className="size-3" />
      </button>
    </span>
  )
}
