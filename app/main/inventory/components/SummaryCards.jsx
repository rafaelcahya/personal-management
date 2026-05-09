'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import {
  PackageIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  BoxesIcon,
  StarIcon,
  TrendingUpIcon,
} from 'lucide-react'

export default function SummaryCards({ summary, lowStockCount, loading }) {
  const router = useRouter()

  function handleCardClick(filter, href) {
    if (filter) {
      localStorage.setItem('product-list-filter', filter)
    }
    router.push(href)
  }

  const stats = [
    {
      title: 'Total Products',
      value: summary.totalProducts,
      icon: PackageIcon,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
      href: '/main/inventory/product-list',
      filter: null,
    },
    {
      title: 'Active',
      value: summary.activeProducts,
      icon: CheckCircle2Icon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/main/inventory/product-list',
      filter: 'active',
      subLabel: `of ${summary.totalProducts ?? 0} products`,
    },
    {
      title: 'Low Stock',
      value: lowStockCount ?? 0,
      icon: AlertTriangleIcon,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
      href: '/main/inventory/product-list',
      filter: 'low-stock',
    },
    {
      title: 'Total Stock',
      value: summary.totalQuantity,
      icon: BoxesIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/main/inventory/product-list',
      filter: null,
    },
    {
      title: 'In Use',
      value: summary.totalUsageQuantity,
      icon: TrendingUpIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      href: '/main/inventory/product-list',
      filter: null,
    },
    {
      title: 'Favorites',
      value: summary.favoriteProducts,
      icon: StarIcon,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      href: '/main/inventory/product-list',
      filter: 'favorite',
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse border-slate-200">
            <CardContent className="px-4 py-3">
              <div className="h-3 bg-slate-200 rounded w-20 mb-3"></div>
              <div className="h-7 bg-slate-200 rounded w-10"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={index}
            className="border border-slate-200/70 shadow-sm hover:shadow-md hover:border-slate-300 transition-[box-shadow,border-color] duration-150"
          >
            <button
              onClick={() => handleCardClick(stat.filter, stat.href)}
              className="w-full h-full text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 rounded-xl"
            >
              <CardContent className="px-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500">{stat.title}</p>
                  <div className={`p-1.5 rounded-lg ${stat.bgColor}`}>
                    <Icon aria-hidden="true" className={`size-3.5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-semibold text-slate-800 tabular-nums">
                  {stat.value ?? 0}
                </p>
                {stat.subLabel && <p className="text-xs text-slate-400 mt-0.5">{stat.subLabel}</p>}
              </CardContent>
            </button>
          </Card>
        )
      })}
    </div>
  )
}
