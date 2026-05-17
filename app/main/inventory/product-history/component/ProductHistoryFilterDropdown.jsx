'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SlidersHorizontal, Check } from 'lucide-react'
import { useMemo } from 'react'

const FILTER_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'completed', label: 'Completed' },
]

const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Most Recent First' },
  { value: 'date_asc', label: 'Oldest First' },
  { value: 'name_asc', label: 'Product Name A→Z' },
  { value: 'name_desc', label: 'Product Name Z→A' },
]

const DEFAULT_SORT = 'date_desc'

export default function ProductHistoryFilterDropdown({
  filter,
  onFilterChange,
  sortOption = DEFAULT_SORT,
  onSortChange,
  productHistories = [],
}) {
  const summary = useMemo(() => {
    const totalStatus = { active: 0, inactive: 0, completed: 0 }
    productHistories.forEach((history) => {
      const status = history.status
      if (Object.prototype.hasOwnProperty.call(totalStatus, status)) {
        totalStatus[status]++
      }
    })
    return { totalHistories: productHistories.length, totalStatus }
  }, [productHistories])

  const activeCount = (filter ? 1 : 0) + (sortOption !== DEFAULT_SORT ? 1 : 0)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          id="filterSortBtn_productHistoryPage"
          variant="outline"
          size="sm"
          className="relative gap-2 focus-visible:ring-0 focus-visible:ring-offset-0"
          aria-label="Filter and sort product history"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Filter & Sort</span>
          <span className="sm:hidden">Filter</span>
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center size-4 rounded-full bg-violet-600 text-white text-[10px] font-bold leading-none">
              {activeCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* Filter section */}
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Filter by Status</span>
          {filter && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                onFilterChange(null)
              }}
            >
              Clear
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {FILTER_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            id={`filterOption_${option.value}_productHistoryPage`}
            onClick={() => onFilterChange(filter === option.value ? null : option.value)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{option.label}</span>
            <span className="flex items-center gap-2 text-muted-foreground text-xs">
              {summary.totalStatus[option.value] ?? 0}
              {filter === option.value && (
                <Check className="size-4 text-foreground" aria-hidden="true" />
              )}
            </span>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        {/* Sort section */}
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Sort</span>
          {sortOption !== DEFAULT_SORT && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                onSortChange(DEFAULT_SORT)
              }}
            >
              Reset
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {SORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            id={`sortOption_${option.value}_productHistoryPage`}
            onClick={() => onSortChange(option.value)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{option.label}</span>
            {sortOption === option.value && (
              <Check className="size-4 text-foreground" aria-hidden="true" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
