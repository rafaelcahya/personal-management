'use client'

import { useState, useEffect } from 'react'
import {
  Activity,
  Unplug,
  AlertTriangle,
  Link2,
  LogOut,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getStravaStatus,
  redirectToStravaConnect,
  disconnectStrava,
  syncStrava,
} from '@/lib/api/running'

export default function StravaSection() {
  const [stravaStatus, setStravaStatus] = useState(null)
  const [statusLoading, setStatusLoading] = useState(true)
  const [statusError, setStatusError] = useState(null)
  const [disconnecting, setDisconnecting] = useState(false)
  const [disconnectError, setDisconnectError] = useState(null)

  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState(null)
  const [syncError, setSyncError] = useState(null)

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
    <section
      aria-label="Strava"
      id="stravaConnectionSection_settings"
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
          <Activity className="size-4 text-violet-600" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">Strava</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect and sync your Strava account to import activities
          </p>
        </div>
      </div>

      {statusLoading ? (
        <div id="stravaConnectionLoading_settings" className="px-5 py-4 flex flex-col gap-3">
          <Skeleton className="h-4 w-40 rounded" />
          <Skeleton className="h-3 w-64 rounded" />
        </div>
      ) : statusError ? (
        <div className="px-5 py-4">
          <p className="text-sm text-red-700">{statusError}</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-slate-100">
          {/* Connection status */}
          <div className="px-5 py-4">
            {stravaStatus && !stravaStatus.connected && (
              <div
                id="stravaDisconnectedState_settings"
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
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
              </div>
            )}

            {stravaStatus?.connected && stravaStatus?.needs_reconnect && (
              <div
                id="stravaBrokenState_settings"
                className="flex items-start justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"
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
              </div>
            )}

            {stravaStatus?.connected && !stravaStatus?.needs_reconnect && (
              <div id="stravaConnectedState_settings" className="flex flex-col gap-3">
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
              </div>
            )}
          </div>

          {/* Sync section */}
          <div className="px-5 py-4 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                className="bg-[#FC4C02] hover:bg-[#e04402] text-white shrink-0"
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
          </div>
        </div>
      )}
    </section>
  )
}
