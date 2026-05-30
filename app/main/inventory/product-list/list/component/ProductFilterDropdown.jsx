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
import { Filter, Check, Loader2 } from 'lucide-react'

const LOW_STOCK_THRESHOLD = 5

const FILTER_OPTIONS = [
  { value: null, label: 'All Products', icon: '📦', group: 'general' },
  { value: 'active', label: 'Active Products', icon: '✅', group: 'status' },
  {
    value: 'inactive',
    label: 'Inactive Products',
    icon: '⏸️',
    group: 'status',
  },
  {
    value: 'favorite',
    label: 'Favorite Products',
    icon: '⭐',
    group: 'status',
  },
  { value: 'low-stock', label: 'Low Stock', icon: '⚠️', group: 'inventory' },
  {
    value: 'out-stock',
    label: 'Out of Stock',
    icon: '❌',
    group: 'inventory',
  },
  { value: 'never-used', label: 'Never Used', icon: '🆕', group: 'usage' },
]

export default function ProductFilterDropdown({
  filter,
  onFilterChange,
  summary,
  summaryLoading,
  products = [],
}) {
  const currentFilter = FILTER_OPTIONS.find((opt) => opt.value === filter)
  const currentFilterLabel = currentFilter?.label || 'All Products'

  const lowStock = products.filter((p) => p.quantity > 0 && p.quantity < LOW_STOCK_THRESHOLD).length
  const outOfStock = products.filter((p) => p.quantity === 0).length
  const neverUsed = products.filter((p) => !p.usage_date).length

  const getFilterCount = (filterValue) => {
    if (summaryLoading) return <Loader2 className="size-3 animate-spin" />

    const counts = {
      null: summary?.totalProducts ?? 0,
      active: summary?.activeProducts ?? 0,
      inactive: summary?.inactiveProducts ?? 0,
      favorite: summary?.favoriteProducts ?? 0,
      'low-stock': lowStock,
      'out-stock': outOfStock,
      'never-used': neverUsed,
    }

    return counts[filterValue] ?? 0
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 focus-visible:ring-violet-200 focus-visible:border-violet-500"
        >
          <Filter className="size-4" aria-hidden="true" />
          <span>{currentFilterLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Filter Products</span>
          {filter && (
            <Button
              variant="ghost"
              size="sm"
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
        {/* General */}
        <DropdownMenuItem
          onClick={() => onFilterChange(null)}
          className="flex items-center justify-between cursor-pointer hover:bg-violet-50 hover:outline-none focus:bg-violet-50"
        >
          <span className="flex items-center gap-2">
            📦 <span>All Products</span>
          </span>
          <span className="flex items-center gap-2 text-muted-foreground text-xs">
            {getFilterCount(null)}
            {filter === null && <Check className="size-4 text-violet-500" />}
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Status</DropdownMenuLabel>

        {/* Status Group */}
        {FILTER_OPTIONS.filter((opt) => opt.group === 'status').map((option) => (
          <DropdownMenuItem
            key={option.value}
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

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Inventory</DropdownMenuLabel>

        {/* Inventory Group */}
        {FILTER_OPTIONS.filter((opt) => opt.group === 'inventory').map((option) => (
          <DropdownMenuItem
            key={option.value}
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

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Usage</DropdownMenuLabel>

        {/* Usage Group */}
        {FILTER_OPTIONS.filter((opt) => opt.group === 'usage').map((option) => (
          <DropdownMenuItem
            key={option.value}
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
