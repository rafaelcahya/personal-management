'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/base/DropdownMenu/DropdownMenu'
import Button from '@/components/base/Button/Button'
import {
  SlidersHorizontal,
  Filter,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Check,
} from 'lucide-react'

export default function EventFilterDropdown({ filter, onFilterChange, events }) {
  const filterOptions = [
    {
      value: null,
      label: 'All Events',
      icon: Filter,
      count: events.length,
    },
    {
      value: 'bullish',
      label: 'Bullish',
      icon: TrendingUp,
      count: events.filter((e) => e.impact_direction === 'UP').length,
    },
    {
      value: 'bearish',
      label: 'Bearish',
      icon: TrendingDown,
      count: events.filter((e) => e.impact_direction === 'DOWN').length,
    },
    {
      value: 'upcoming',
      label: 'Upcoming',
      icon: Calendar,
      count: events.filter((e) => new Date(e.event_date) >= new Date()).length,
    },
    {
      value: 'past',
      label: 'Past Events',
      icon: Clock,
      count: events.filter((e) => new Date(e.event_date) < new Date()).length,
    },
  ]

  const hasActiveFilter = filter !== null
  const activeCount = hasActiveFilter ? 1 : 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="base"
          id="filterBtn_eventPage"
          className="gap-2 focus-visible:ring-0 focus-visible:ring-offset-0 relative"
        >
          <SlidersHorizontal className="size-4" />
          <span className="hidden sm:inline">Filter</span>
          <span className="sm:hidden">Filter</span>
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-violet-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <div className="px-3 py-1.5 text-sm font-semibold flex items-center justify-between">
          <span>Filter by type</span>
          {hasActiveFilter && (
            <Button
              variant="ghost"
              size="base"
              className="h-6 px-2 text-xs hover:bg-violet-100 text-violet-500 hover:text-violet-500"
              onClick={(e) => {
                e.stopPropagation()
                onFilterChange(null)
              }}
            >
              Clear
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {filterOptions.map((option, index) => {
          const Icon = option.icon
          return (
            <div key={option.value ?? 'all'}>
              {index === 3 && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onSelect={() => onFilterChange(option.value)}
                className="flex items-center justify-between cursor-pointer hover:bg-violet-50 hover:outline-none focus:bg-violet-50"
              >
                <span className="flex items-center gap-2">
                  <Icon className="size-4" />
                  <span>{option.label}</span>
                </span>
                <span className="flex items-center gap-2 text-muted-foreground text-xs">
                  {option.count}
                  {filter === option.value && <Check className="size-4 text-violet-500" />}
                </span>
              </DropdownMenuItem>
            </div>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
