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
import { SlidersHorizontal, Check, Loader2 } from 'lucide-react'
import { getProductNameSummary } from '@/lib/api/productName'
import { useEffect, useState } from 'react'

const FILTER_OPTIONS = [
  { value: null, label: 'All Names', icon: '📦' },
  { value: 'active', label: 'Active', icon: '✅' },
  { value: 'inactive', label: 'Inactive', icon: '⏸️' },
  { value: 'deleted', label: 'Deleted', icon: '🗑️' },
]

const SORT_OPTIONS = [
  { value: 'name_asc', label: 'A → Z' },
  { value: 'name_desc', label: 'Z → A' },
  { value: 'most_products', label: 'Most products first' },
  { value: 'least_products', label: 'Fewest products first' },
]

export default function ProductNameFilterDropdown({
  filter,
  onFilterChange,
  sortOrder = 'name-asc',
  onSortChange,
}) {
  const [summary, setSummary] = useState({
    totalProductNames: 0,
    totalStatus: { active: 0, inactive: 0, deleted: 0 },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSummary() {
      try {
        const data = await getProductNameSummary()
        setSummary(data)
      } catch (err) {
        console.error('Failed to fetch summary:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSummary()
  }, [])

  const getFilterCount = (filterValue) => {
    if (loading) return <Loader2 className="size-3 animate-spin" />
    if (filterValue === null) return summary.totalProductNames
    return summary.totalStatus[filterValue] || 0
  }

  const hasActiveFilter = filter !== null
  const hasNonDefaultSort = sortOrder !== 'name_asc'
  const activeCount = (hasActiveFilter ? 1 : 0) + (hasNonDefaultSort ? 1 : 0)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          id="filterSortBtn_productNamePage"
          className="gap-2 focus-visible:ring-0 focus-visible:ring-offset-0 relative"
        >
          <SlidersHorizontal className="size-4" />
          <span className="hidden sm:inline">Filter & Sort</span>
          <span className="sm:hidden">Filter</span>
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-violet-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Filter section */}
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Filter by status</span>
          {hasActiveFilter && (
            <Button
              variant="ghost"
              size="sm"
              id="clearFilterBtn_productNamePage"
              className="h-6 px-2 text-xs hover:bg-violet-100 text-violet-500 hover:text-violet-500"
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
            key={option.value ?? 'all'}
            id={`filterOption_${option.value ?? 'all'}_productNamePage`}
            onClick={() => onFilterChange(option.value)}
            className="flex items-center justify-between cursor-pointer hover:bg-violet-50 hover:outline-none focus:bg-violet-50"
          >
            <span className="flex items-center gap-2">
              {option.icon} <span>{option.label}</span>
            </span>
            <span className="flex items-center gap-2 text-muted-foreground text-xs">
              {getFilterCount(option.value)}
              {filter === option.value && <Check className="size-4 text-violet-500" />}
            </span>
          </DropdownMenuItem>
        ))}

        {/* Sort section */}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Sort by</span>
          {hasNonDefaultSort && (
            <Button
              variant="ghost"
              size="sm"
              id="resetSortBtn_productNamePage"
              className="h-6 px-2 text-xs hover:bg-violet-100 text-violet-500 hover:text-violet-500"
              onClick={(e) => {
                e.stopPropagation()
                onSortChange?.('name_asc')
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
            id={`sortOption_${option.value}_productNamePage`}
            onClick={() => onSortChange?.(option.value)}
            className="flex items-center justify-between cursor-pointer hover:bg-violet-50 hover:outline-none focus:bg-violet-50"
          >
            <span>{option.label}</span>
            {sortOrder === option.value && <Check className="size-4 text-violet-500" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
