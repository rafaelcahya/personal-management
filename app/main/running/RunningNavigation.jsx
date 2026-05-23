'use client'

import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboardIcon,
  ActivityIcon,
  BarChart2Icon,
  BrainCircuitIcon,
  SettingsIcon,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    name: 'Dashboard',
    description: 'Training overview',
    value: 'dashboard',
    href: '/main/running/dashboard',
    icon: LayoutDashboardIcon,
  },
  {
    name: 'Activities',
    description: 'All runs',
    value: 'activities',
    href: '/main/running/activities',
    icon: ActivityIcon,
  },
  {
    name: 'Analytics',
    description: 'Trends & metrics',
    value: 'analytics',
    href: '/main/running/analytics',
    icon: BarChart2Icon,
  },
  {
    name: 'AI Coach',
    description: 'Insights & advice',
    value: 'ai',
    href: '/main/running/ai',
    icon: BrainCircuitIcon,
  },
  {
    name: 'Settings',
    description: 'Profile & preferences',
    value: 'settings',
    href: '/main/running/settings',
    icon: SettingsIcon,
  },
]

export default function RunningNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const activeItem = navigationItems.find((item) => pathname.startsWith(item.href))

  return (
    <div className="w-full">
      <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <button
              key={item.value}
              onClick={() => router.push(item.href)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center focus:outline-none',
                isActive
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
              )}
            >
              <Icon className={cn('size-4', isActive ? 'text-violet-600' : 'text-slate-400')} />
              <span>{item.name}</span>
            </button>
          )
        })}
      </div>

      <div className="md:hidden flex gap-1.5 overflow-x-auto py-1 scrollbar-hide">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <button
              key={item.value}
              onClick={() => router.push(item.href)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 focus:outline-none',
                isActive
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700'
              )}
            >
              <Icon className="size-4" />
              <span>{item.name}</span>
            </button>
          )
        })}
      </div>

      {activeItem && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <LayoutDashboardIcon className="size-3.5" />
          <ChevronRight className="size-3" />
          <span className="font-medium text-slate-700">{activeItem.name}</span>
          <span className="text-slate-300">•</span>
          <span>{activeItem.description}</span>
        </div>
      )}
    </div>
  )
}
