'use client'

import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

const BRIGHTNESS = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
]

export default function ThemeToggle({ collapsed }) {
  const { theme, setTheme } = useTheme()

  if (collapsed) return null

  return (
    <div className="flex items-center gap-0.5 p-1 rounded-lg bg-muted w-full">
      {BRIGHTNESS.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          title={label}
          aria-label={`Switch to ${label} theme`}
          onClick={() => setTheme(value)}
          className={cn(
            'flex-1 flex items-center justify-center rounded-md py-1.5 transition-colors',
            theme === value
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Icon className="size-3.5" />
        </button>
      ))}
    </div>
  )
}
