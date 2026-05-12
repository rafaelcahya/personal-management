'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  PackageIcon,
  CheckCircle2Icon,
  XCircleIcon,
  BoxesIcon,
  StarIcon,
  TrendingUpIcon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

function ProductListSummary({ summary, loading, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false)

  const data = summary ?? {
    totalProducts: 0,
    activeProducts: 0,
    inactiveProducts: 0,
    totalQuantity: 0,
    totalUsageQuantity: 0,
    favoriteProducts: 0,
  }

  const stats = [
    {
      title: 'Total Products',
      value: data.totalProducts,
      icon: PackageIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      filterValue: null,
    },
    {
      title: 'Active',
      value: data.activeProducts,
      icon: CheckCircle2Icon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      filterValue: 'active',
    },
    {
      title: 'Inactive',
      value: data.inactiveProducts,
      icon: XCircleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      filterValue: 'inactive',
    },
    {
      title: 'Total Stock',
      value: data.totalQuantity,
      icon: BoxesIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'In Use',
      value: data.totalUsageQuantity,
      icon: TrendingUpIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Favorites',
      value: data.favoriteProducts,
      icon: StarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      filterValue: 'favorite',
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-slate-200 rounded w-12"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      {/* Desktop View - Always Visible Grid */}
      <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const isClickable = stat.filterValue !== undefined && onFilterChange
          return (
            <Card
              key={index}
              className={`p-0 border border-slate-200/50 shadow-slate-100${isClickable ? ' cursor-pointer hover:shadow-md transition-shadow' : ''}`}
              onClick={isClickable ? () => onFilterChange(stat.filterValue) : undefined}
            >
              <CardContent className="px-4 py-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`size-4 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-xl font-semibold">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Mobile View - Collapsible */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="sm:hidden w-full">
        <Card className="py-2">
          <CardContent className="px-0">
            {/* Header - Always Visible */}
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-50">
                    <PackageIcon className="size-4 text-violet-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Product Summary</p>
                    <p className="text-xs text-slate-500">{data.totalProducts} total products</p>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="size-5 text-slate-400" />
                ) : (
                  <ChevronDown className="size-5 text-slate-400" />
                )}
              </Button>
            </CollapsibleTrigger>

            {/* Collapsible Content */}
            <CollapsibleContent className="px-4 pt-2">
              <div className="pt-2 grid grid-cols-2 gap-3">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  const isClickable = stat.filterValue !== undefined && onFilterChange
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border bg-slate-50/50${isClickable ? ' cursor-pointer hover:shadow-md transition-shadow' : ''}`}
                      onClick={isClickable ? () => onFilterChange(stat.filterValue) : undefined}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-md ${stat.bgColor}`}>
                          <Icon className={`size-3.5 ${stat.color}`} />
                        </div>
                        <p className="text-xs font-medium text-slate-600">{stat.title}</p>
                      </div>
                      <p className="text-xl font-bold ml-0.5">{stat.value}</p>
                    </div>
                  )
                })}
              </div>
            </CollapsibleContent>
          </CardContent>
        </Card>
      </Collapsible>
    </>
  )
}

export default ProductListSummary
