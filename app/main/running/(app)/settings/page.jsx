'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, CheckCircle2, AlertCircle, Unplug, AlertTriangle, Link2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { syncStrava, redirectToStravaConnect, getStravaStatus } from '@/lib/api/running'

export default function RunningSettingsPage() {
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState(null)
  const [syncError, setSyncError] = useState(null)

  const [stravaStatus, setStravaStatus] = useState(null)
  const [statusLoading, setStatusLoading] = useState(true)
  const [statusError, setStatusError] = useState(null)

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

  async function handleSync() {
    setSyncing(true)
    setSyncResult(null)
    setSyncError(null)
    try {
      const result = await syncStrava()
      setSyncResult(result.synced)
    } catch (err) {
      if (err.message === 'Strava not connected') {
        setSyncError('Strava is not connected. Connect your account first.')
      } else {
        setSyncError(err.message || 'Sync failed. Please try again.')
      }
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div id="settingsPage" className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Profile & preferences</p>
      </div>

      {/* Strava Connection */}
      <section aria-label="Strava connection" id="stravaConnectionSection_settings">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Strava Connection
        </h2>

        {statusLoading && (
          <Card className="border border-slate-200/70 shadow-sm">
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
          <Card className="border border-red-200 shadow-sm bg-red-50">
            <CardContent className="px-5 py-4">
              <p className="text-sm text-red-700">{statusError}</p>
            </CardContent>
          </Card>
        )}

        {!statusLoading && !statusError && stravaStatus && !stravaStatus.connected && (
          <Card className="border border-slate-200/70 shadow-sm">
            <CardContent
              id="stravaDisconnectedState_settings"
              className="px-5 py-4 flex items-start justify-between gap-4"
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
            <Card className="border border-amber-200 shadow-sm bg-amber-50">
              <CardContent
                id="stravaBrokenState_settings"
                className="px-5 py-4 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-2 min-w-0">
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
                  <Unplug className="w-4 h-4 mr-2" aria-hidden="true" />
                  Reconnect
                </Button>
              </CardContent>
            </Card>
          )}

        {!statusLoading &&
          !statusError &&
          stravaStatus?.connected &&
          !stravaStatus?.needs_reconnect && (
            <Card className="border border-slate-200/70 shadow-sm">
              <CardContent
                id="stravaConnectedState_settings"
                className="px-5 py-4 flex items-start justify-between gap-4"
              >
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
                  onClick={redirectToStravaConnect}
                  variant="outline"
                  size="sm"
                  className="shrink-0 min-h-11 min-w-11 focus-visible:ring-2 focus-visible:ring-violet-200"
                >
                  <Unplug className="w-4 h-4 mr-2" aria-hidden="true" />
                  Reconnect
                </Button>
              </CardContent>
            </Card>
          )}
      </section>

      {/* Strava Sync */}
      <section aria-label="Strava integration">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Strava Integration
        </h2>
        <Card className="border border-slate-200/70 shadow-sm">
          <CardContent className="px-5 py-4 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-800">Sync Strava Activities</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pull your latest runs from Strava into the dashboard. Only new activities since
                  the last sync are imported.
                </p>
              </div>
              <Button
                id="syncStravaBtn_settings"
                onClick={handleSync}
                disabled={syncing}
                size="sm"
                className="bg-[#FC4C02] hover:bg-[#e04402] text-white shrink-0 min-h-11 min-w-11"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                />
                {syncing ? 'Syncing…' : 'Sync Now'}
              </Button>
            </div>

            {syncResult !== null && (
              <div
                id="syncSuccessMsg_settings"
                className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700"
                role="status"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                {syncResult === 0
                  ? 'Already up to date — no new activities found.'
                  : `${syncResult} new ${syncResult === 1 ? 'activity' : 'activities'} imported successfully.`}
              </div>
            )}

            {syncError && (
              <div
                id="syncErrorMsg_settings"
                className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                {syncError}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
