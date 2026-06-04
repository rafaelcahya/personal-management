'use client'

import { useState, useEffect } from 'react'
import { Unplug, AlertTriangle, Link2, LogOut, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getStravaStatus, redirectToStravaConnect, disconnectStrava } from '@/lib/api/running'

export default function StravaConnectionSection() {
  const [stravaStatus, setStravaStatus] = useState(null)
  const [statusLoading, setStatusLoading] = useState(true)
  const [statusError, setStatusError] = useState(null)
  const [disconnecting, setDisconnecting] = useState(false)
  const [disconnectError, setDisconnectError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function loadStatus() {
      try {
        const data = await getStravaStatus()
        if (!cancelled) setStravaStatus(data)
      } catch (err) {
        if (!cancelled) setStatusError(err.message || 'Failed to load Strava status')
      } finally {
        if (!cancelled) setStatusLoading(false)
      }
    }
    loadStatus()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleDisconnect() {
    setDisconnecting(true)
    setDisconnectError(null)
    try {
      await disconnectStrava()
      const data = await getStravaStatus()
      setStravaStatus(data)
    } catch (err) {
      setDisconnectError(err.message || 'Failed to disconnect Strava')
    } finally {
      setDisconnecting(false)
    }
  }

  return (
    <section aria-label="Strava connection" id="stravaConnectionSection_settings">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Strava Connection
      </h2>

      {statusLoading && (
        <Card className="border border-slate-200/70 py-0">
          <CardContent
            id="stravaConnectionLoading_settings"
            className="px-5 py-4 flex flex-col gap-3"
          >
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-3 w-64 rounded" />
          </CardContent>
        </Card>
      )}

      {!statusLoading && statusError && (
        <Card className="border border-red-200 py-0 bg-red-50">
          <CardContent className="px-5 py-4">
            <p className="text-sm text-red-700">{statusError}</p>
          </CardContent>
        </Card>
      )}

      {!statusLoading && !statusError && stravaStatus && !stravaStatus.connected && (
        <Card className="border border-slate-200/70 py-0">
          <CardContent
            id="stravaDisconnectedState_settings"
            className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <div>
              <p className="text-sm font-medium text-slate-800">Not connected</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Connect your Strava account to sync activities automatically.
              </p>
            </div>
            <Button
              onClick={redirectToStravaConnect}
              size="sm"
              className="bg-[#FC4C02] hover:bg-[#e04402] text-white shrink-0 min-h-11 min-w-11 focus-visible:ring-2 focus-visible:ring-orange-300"
            >
              <Link2 className="w-4 h-4 mr-2" aria-hidden="true" />
              Connect Strava
            </Button>
          </CardContent>
        </Card>
      )}

      {!statusLoading &&
        !statusError &&
        stravaStatus?.connected &&
        stravaStatus?.needs_reconnect && (
          <Card className="border border-amber-200 py-0 bg-amber-50">
            <CardContent
              id="stravaBrokenState_settings"
              className="px-5 py-4 flex items-start justify-between gap-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 min-w-0">
                <AlertTriangle
                  className="h-4 w-4 text-amber-600 mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-medium text-amber-800">Connection revoked</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Your Strava connection has been revoked. Reconnect to resume syncing.
                  </p>
                </div>
              </div>
              <Button
                id="stravaReconnectBtn_settings"
                onClick={redirectToStravaConnect}
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white shrink-0 min-h-11 min-w-11 focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                <Unplug className="mr-2" aria-hidden="true" />
                Reconnect
              </Button>
            </CardContent>
          </Card>
        )}

      {!statusLoading &&
        !statusError &&
        stravaStatus?.connected &&
        !stravaStatus?.needs_reconnect && (
          <Card className="border border-slate-200/70 py-0">
            <CardContent
              id="stravaConnectedState_settings"
              className="px-5 py-4 flex flex-col gap-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-800">Connected</p>
                  {stravaStatus.athlete_id && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      Athlete ID: {stravaStatus.athlete_id}
                    </p>
                  )}
                  {stravaStatus.last_sync_at && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      Last synced:{' '}
                      {new Date(stravaStatus.last_sync_at).toLocaleString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>
                <Button
                  id="stravaDisconnectBtn_settings"
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  variant="outline"
                  size="sm"
                  className="shrink-0 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 focus-visible:ring-2 focus-visible:ring-red-200"
                >
                  <LogOut className="mr-2" aria-hidden="true" />
                  {disconnecting ? 'Disconnecting…' : 'Disconnect'}
                </Button>
              </div>

              {disconnectError && (
                <div
                  className="flex items-center gap-1.5 text-sm text-red-600"
                  role="alert"
                  aria-live="assertive"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {disconnectError}
                </div>
              )}
            </CardContent>
          </Card>
        )}
    </section>
  )
}
