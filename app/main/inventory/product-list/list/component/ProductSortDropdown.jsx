'use client'

import Button from '@/components/base/Button/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/base/DropdownMenu/DropdownMenu'
import { ArrowDown, ArrowUp, ArrowUpDown, Check } from 'lucide-react'

const UPDATED_SORT_OPTIONS = [
  { value: 'updated_at_desc', label: 'Updated: Newest First', icon: ArrowDown },
  { value: 'updated_at_asc', label: 'Updated: Oldest First', icon: ArrowUp },
]

const UPDATED_SORT_VALUES = new Set(UPDATED_SORT_OPTIONS.map((o) => o.value))

export default function ProductSortDropdown({ sort, onSortChange }) {
  const activeOption = UPDATED_SORT_OPTIONS.find((o) => o.value === sort) ?? null
  const isActive = activeOption !== null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          id="sortDropdownTrigger_productListPage"
          variant={isActive ? 'default' : 'outline'}
          className={`gap-2 focus-visible:ring-violet-200 focus-visible:border-violet-500 ${
            isActive ? 'bg-violet-600 hover:bg-violet-700 text-white' : ''
          }`}
        >
          <ArrowUpDown className="size-4" aria-hidden="true" />
          <span>{isActive ? activeOption.label : 'Sort'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <div className="px-3 py-1.5 text-sm font-semibold flex items-center justify-between">
          <span>Sort By</span>
          {isActive && (
            <Button
              variant="ghost"
              className="h-6 px-2 text-xs hover:bg-violet-100 text-violet-500 hover:text-violet-500"
              onClick={(e) => {
                e.stopPropagation()
                onSortChange(null)
              }}
            >
              Clear
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">Updated At</div>
        {UPDATED_SORT_OPTIONS.map((option) => {
          const Icon = option.icon
          return (
            <DropdownMenuItem
              key={option.value}
              id={`sortOption_${option.value}_productListPage`}
              onSelect={() => {
                const next =
                  sort === option.value && UPDATED_SORT_VALUES.has(sort) ? null : option.value
                onSortChange(next)
              }}
              className="flex items-center justify-between cursor-pointer hover:bg-violet-50 hover:outline-none focus:bg-violet-50"
            >
              <span className="flex items-center gap-2">
                <Icon className="size-4 text-slate-500" />
                <span>{option.label}</span>
              </span>
              {sort === option.value && <Check className="size-4 text-violet-500" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
