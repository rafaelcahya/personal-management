'use client'

import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardError({ message, onRetry }) {
  return (
    <div
      id="dashboardError"
      className="flex flex-col items-center justify-center py-20 gap-4"
      role="alert"
      aria-live="assertive"
    >
      <p className="text-slate-500 text-sm">{message || 'Failed to load dashboard'}</p>
      <Button onClick={onRetry} variant="outline" size="sm">
        <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
        Retry
      </Button>
    </div>
  )
}
