'use client'

import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { redirectToStravaConnect } from '@/lib/api/running'

export default function StravaReconnectBanner({ needsReconnect }) {
  if (!needsReconnect) return null

  return (
    <div
      id="stravaDisconnectBanner"
      className="w-full bg-amber-50 border-b border-amber-200 px-4 py-3"
      role="alert"
      aria-live="polite"
    >
      <div className="w-full max-w-5xl xl:max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" aria-hidden="true" />
          <p className="text-sm text-amber-800">
            Your Strava connection has been revoked. Reconnect to resume syncing.
          </p>
        </div>
        <Button
          id="stravaReconnectBtn"
          size="sm"
          onClick={redirectToStravaConnect}
          className="bg-amber-600 hover:bg-amber-700 text-white shrink-0 min-w-11 focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          Reconnect Strava
        </Button>
      </div>
    </div>
  )
}
