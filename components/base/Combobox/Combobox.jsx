'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useFieldContentContext } from '../Field/FieldContent'
import { triggerVariants } from '../DatePicker/calendarParts'
import {
  isGroup,
  flattenOptions,
  filterOptions,
  ComboOption,
  ComboGroup,
  ComboTag,
} from './comboParts'

// ─── Combobox ─────────────────────────────────────────────────────────────────

const DEFAULT_CREATE_LABEL = (val) => `Create "${val}"`

export default function Combobox({
  value = null,
  onChange,
  options = [],
  onSearch,
  multiple = false,
  inputTrigger = true,
  clearable = true,
  creatable = false,
  max,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results.',
  createLabel = DEFAULT_CREATE_LABEL,
  variant: variantProp,
  size: sizeProp,
  disabled: disabledProp = false,
  align = 'start',
  className,
  ...props
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [asyncOptions, setAsyncOptions] = useState([])
  const [loading, setLoading] = useState(false)

  const inputRef = useRef(null)

  const {
    id,
    descriptionId,
    errorId,
    hasError,
    required,
    disabled: ctxDisabled,
    size: ctxSize,
  } = useFieldContentContext()

  const resolvedSize = sizeProp ?? ctxSize ?? 'base'
  const isDisabled = ctxDisabled || disabledProp || variantProp === 'disabled'
  const resolvedVariant = variantProp ?? (hasError ? 'error' : isDisabled ? 'disabled' : 'default')

  // Normalize value to array for unified handling
  const selectedItems = multiple ? (Array.isArray(value) ? value : []) : value ? [value] : []
  const selectedValues = new Set(selectedItems.map((i) => i.value))

  // Active options
  const sourceOptions = onSearch ? asyncOptions : options
  const visibleOptions = onSearch
    ? sourceOptions
    : query
      ? filterOptions(sourceOptions, query)
      : sourceOptions

  // Async search with 300ms debounce
  useEffect(() => {
    if (!onSearch || !query.trim()) {
      setAsyncOptions([])
      setLoading(false)
      return
    }
    let cancelled = false
    const timer = setTimeout(() => {
      setLoading(true)
      Promise.resolve(onSearch(query))
        .then((res) => {
          if (!cancelled) {
            setAsyncOptions(res ?? [])
            setLoading(false)
          }
        })
        .catch(() => {
          if (!cancelled) setLoading(false)
        })
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, onSearch])

  // Creatable — show only when query has no exact match
  const flatOpts = flattenOptions(sourceOptions)
  const exactMatch = flatOpts.some((o) => o.label.toLowerCase() === query.trim().toLowerCase())
  const showCreate = creatable && query.trim() && !exactMatch

  const hasValue = multiple ? selectedItems.length > 0 : !!value
  const canSelectMore = !max || selectedItems.length < max

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleOpenChange = (next) => {
    // Keep popover open while user is typing (input still focused)
    if (!next && inputTrigger && document.activeElement === inputRef.current) return
    setOpen(next)
    if (!next) setQuery('')
  }

  const handleSelect = (option) => {
    if (multiple) {
      if (selectedValues.has(option.value)) {
        onChange?.(selectedItems.filter((i) => i.value !== option.value))
      } else if (canSelectMore) {
        onChange?.([...selectedItems, option])
      }
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 0)
    } else {
      onChange?.(option)
      setOpen(false)
      setQuery('')
    }
  }

  const handleCreate = () => {
    const q = query.trim()
    handleSelect({ value: q, label: q })
    setQuery('')
  }

  const handleClear = (e) => {
    e.stopPropagation()
    onChange?.(multiple ? [] : null)
    setQuery('')
    if (inputTrigger) setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleRemoveTag = (itemValue) => {
    onChange?.(selectedItems.filter((i) => i.value !== itemValue))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false)
      setQuery('')
    }
    if (e.key === 'Enter' && showCreate) {
      e.preventDefault()
      handleCreate()
    }
    if (e.key === 'Backspace' && !query && multiple && selectedItems.length > 0) {
      handleRemoveTag(selectedItems[selectedItems.length - 1].value)
    }
  }

  // ── Shared: right icons ──────────────────────────────────────────────────────

  const renderIcons = () => (
    <div className="flex items-center gap-0.5 ml-auto pl-1 shrink-0">
      {clearable && hasValue && !isDisabled && (
        <button
          type="button"
          tabIndex={-1}
          onClick={handleClear}
          className="rounded p-0.5 hover:bg-gray-100 transition-colors"
        >
          <X className="size-3.5 text-slate-400" />
        </button>
      )}
      <ChevronDown
        className={clsx(
          'size-4 text-slate-400 transition-transform duration-150',
          open && 'rotate-180'
        )}
      />
    </div>
  )

  // ── Shared: option list ──────────────────────────────────────────────────────

  const renderOptions = () => (
    <div className="max-h-60 overflow-y-auto p-1">
      {loading && (
        <div className="flex justify-center py-5">
          <Loader2 className="size-4 animate-spin text-slate-400" />
        </div>
      )}
      {!loading && visibleOptions.length === 0 && !showCreate && (
        <p className="px-3 py-5 text-sm text-slate-400 text-center">{emptyText}</p>
      )}
      {!loading &&
        visibleOptions.map((opt, i) =>
          isGroup(opt) ? (
            <ComboGroup
              key={opt.group + i}
              group={opt.group}
              items={opt.items}
              selectedValues={selectedValues}
              onSelect={handleSelect}
            />
          ) : (
            <ComboOption
              key={opt.value}
              option={opt}
              isSelected={selectedValues.has(opt.value)}
              onSelect={handleSelect}
            />
          )
        )}
      {showCreate && (
        <button
          type="button"
          onClick={handleCreate}
          className="w-full flex items-center px-3 py-1.5 text-sm text-violet-600 hover:bg-violet-50 rounded transition-colors"
        >
          {createLabel(query.trim())}
        </button>
      )}
    </div>
  )

  // ── Size + variant styles ────────────────────────────────────────────────────

  const sizeConfig = {
    xs: 'min-h-6 px-2 text-xs rounded gap-1',
    sm: 'min-h-7 px-2.5 text-xs rounded-md gap-1.5',
    base: 'min-h-8 px-3 text-sm rounded-md gap-1.5',
    md: 'min-h-9 px-3.5 text-sm rounded-md gap-2',
    lg: 'min-h-10 px-4 text-sm rounded-md gap-2',
  }[resolvedSize]

  const variantStyle = {
    default:
      'border-input hover:border-slate-300 focus-within:ring-2 focus-within:ring-violet-200 focus-within:border-violet-600',
    error:
      'border-destructive focus-within:ring-2 focus-within:ring-destructive/20 focus-within:border-destructive',
    disabled: 'border-input opacity-50 pointer-events-none bg-muted',
  }[resolvedVariant]

  // ── Input trigger ────────────────────────────────────────────────────────────

  if (inputTrigger) {
    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <div
            id={id}
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-required={required || undefined}
            onClick={() => {
              if (!isDisabled) {
                setOpen(true)
                setTimeout(() => inputRef.current?.focus(), 0)
              }
            }}
            className={twMerge(
              clsx(
                'flex w-full flex-wrap items-center border bg-background cursor-text',
                'transition-[color,box-shadow,border-color] duration-150',
                sizeConfig,
                variantStyle,
                className
              )
            )}
            {...props}
          >
            {multiple &&
              selectedItems.map((item) => (
                <ComboTag
                  key={item.value}
                  label={item.label}
                  onRemove={() => handleRemoveTag(item.value)}
                />
              ))}

            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setOpen(true)
              }}
              onFocus={() => !isDisabled && setOpen(true)}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              disabled={isDisabled}
              placeholder={
                multiple
                  ? selectedItems.length === 0
                    ? placeholder
                    : searchPlaceholder
                  : !query && value
                    ? value.label
                    : placeholder
              }
              aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
              aria-invalid={hasError || undefined}
              className="flex-1 min-w-16 bg-transparent outline-none placeholder:text-muted-foreground text-foreground disabled:cursor-not-allowed"
            />

            {renderIcons()}
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align={align}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {renderOptions()}
        </PopoverContent>
      </Popover>
    )
  }

  // ── Button trigger ───────────────────────────────────────────────────────────

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div
          id={id}
          role="button"
          tabIndex={isDisabled ? -1 : 0}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-required={required || undefined}
          aria-disabled={isDisabled || undefined}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              if (!isDisabled) setOpen((v) => !v)
            }
            handleKeyDown(e)
          }}
          className={twMerge(
            clsx(
              triggerVariants({ variant: resolvedVariant, size: resolvedSize }),
              'cursor-pointer',
              className
            )
          )}
          {...props}
        >
          <div className="flex flex-1 min-w-0 flex-wrap gap-1.5 items-center">
            {multiple ? (
              selectedItems.length > 0 ? (
                <span className="text-foreground">
                  {selectedItems[0].label}
                  {selectedItems.length > 1 && (
                    <span className="text-muted-foreground ml-1">
                      +{selectedItems.length - 1} more
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )
            ) : (
              <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
                {value?.label ?? placeholder}
              </span>
            )}
          </div>
          {renderIcons()}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align={align}>
        <div className="p-2 border-b border-slate-100">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={searchPlaceholder}
            className="w-full text-sm outline-none placeholder:text-muted-foreground bg-transparent"
            autoFocus
          />
        </div>
        {renderOptions()}
      </PopoverContent>
    </Popover>
  )
}

Combobox.displayName = 'Combobox'
