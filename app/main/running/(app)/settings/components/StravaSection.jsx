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
import Button from '@/components/base/Button/Button'
import Card, {
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/base/Card/Card'
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalDescription,
} from '@/components/base/Modal/Modal.jsx'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import {
  getStravaStatus,
  redirectToStravaConnect,
  disconnectStrava,
  syncStrava,
} from '@/lib/api/running'
import SectionLoadError from './SectionLoadError'

// No Strava brand token exists; orange-700 keeps white text at AA contrast
const STRAVA_BTN_CLASS = 'bg-orange-700 hover:bg-orange-800 text-white shrink-0 h-11 md:h-8'

const OAUTH_ERROR_MESSAGES = {
  strava_auth: 'Strava connection failed. Please try again.',
  strava_state: 'Link expired, please try again.',
}

export default function StravaSection({ refreshKey = 0 }) {
  const [stravaStatus, setStravaStatus] = useState(null)
  const [statusLoading, setStatusLoading] = useState(true)
  const [statusError, setStatusError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [disconnectOpen, setDisconnectOpen] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [disconnectError, setDisconnectError] = useState(null)

  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState(null)
  const [syncError, setSyncError] = useState(null)
  const [syncNotice, setSyncNotice] = useState(null)
  const [oauthError, setOauthError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function loadStatus() {
      setStatusLoading(true)
      setStatusError(null)
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
  }, [reloadKey])

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('error')
    if (code && OAUTH_ERROR_MESSAGES[code]) setOauthError(OAUTH_ERROR_MESSAGES[code])
  }, [])

  // Bumped by the page after "Delete all activities" resets last_sync_at server-side
  useEffect(() => {
    if (refreshKey === 0) return
    setSyncResult(null)
    setSyncNotice(null)
    setSyncError(null)
    refreshStatusQuietly()
  }, [refreshKey])

  // The action already succeeded when this runs, so a failed re-fetch must
  // not surface as an action error; callers keep their local state instead.
  async function refreshStatusQuietly() {
    try {
      const data = await getStravaStatus()
      setStravaStatus(data)
      return data
    } catch {
      return null
    }
  }

  function openDisconnectDialog() {
    setDisconnectError(null)
    setDisconnectOpen(true)
  }

  function closeDisconnectDialog() {
    if (disconnecting) return
    setDisconnectOpen(false)
    setDisconnectError(null)
  }

  async function handleDisconnect() {
    setDisconnecting(true)
    setDisconnectError(null)
    try {
      await disconnectStrava()
    } catch (err) {
      setDisconnectError(err.message || 'Failed to disconnect Strava')
      setDisconnecting(false)
      return
    }
    setStravaStatus({ connected: false, needs_reconnect: false })
    setSyncResult(null)
    setSyncError(null)
    setDisconnectOpen(false)
    setDisconnecting(false)
    refreshStatusQuietly()
  }

  async function handleSync() {
    setSyncing(true)
    setSyncResult(null)
    setSyncNotice(null)
    setSyncError(null)
    try {
      const result = await syncStrava()
      // A first sync (no last_sync_at) is handed to a background backfill
      if (result.backfill_started) {
        setSyncNotice(result.message || 'Sync started, activities will appear shortly.')
      } else {
        setSyncResult(result.synced ?? 0)
      }
      const fresh = await refreshStatusQuietly()
      if (!fresh) {
        setStravaStatus((prev) =>
          prev ? { ...prev, last_sync_at: new Date().toISOString() } : prev
        )
      }
    } catch (err) {
      if (err.needsReconnect) {
        setStravaStatus((prev) => ({ ...(prev ?? {}), connected: true, needs_reconnect: true }))
        setSyncError('Your Strava connection was revoked. Reconnect to resume syncing.')
      } else if (err.status === 400) {
        setStravaStatus({ connected: false, needs_reconnect: false })
        setSyncError('Strava is not connected. Connect your account first.')
      } else {
        setSyncError(err.message || 'Sync failed. Please try again.')
      }
    } finally {
      setSyncing(false)
    }
  }

  const isHealthy = stravaStatus?.connected && !stravaStatus?.needs_reconnect

  return (
    <Card as="section" aria-label="Strava" id="stravaConnectionSection_settings">
      <CardHeader>
        <CardIcon icon={Activity} />
        <CardHeaderContent>
          <CardTitle>Strava</CardTitle>
          <CardDescription>
            Connect and sync your Strava account to import activities
          </CardDescription>
        </CardHeaderContent>
      </CardHeader>

      <CardContent className="p-0">
        {oauthError && (
          <div className="px-5 pt-4">
            <div
              id="stravaOauthError_settings"
              className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              {oauthError}
            </div>
          </div>
        )}
        {statusLoading ? (
          <div id="stravaConnectionLoading_settings" className="px-5 py-4 flex flex-col gap-3">
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-3 w-full max-w-64 rounded" />
          </div>
        ) : statusError ? (
          <SectionLoadError
            id="stravaConnectionError_settings"
            retryId="stravaRetryBtn_settings"
            message={statusError}
            onRetry={() => setReloadKey((k) => k + 1)}
          />
        ) : (
          <div className="flex flex-col divide-y divide-slate-100">
            <div className="px-5 py-4">
              {stravaStatus && !stravaStatus.connected && (
                <div
                  id="stravaDisconnectedState_settings"
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">Not connected</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Connect your Strava account to sync activities automatically.
                    </p>
                  </div>
                  <Button
                    id="stravaConnectBtn_settings"
                    onClick={redirectToStravaConnect}
                    className={`${STRAVA_BTN_CLASS} focus-visible:ring-2 focus-visible:ring-orange-300`}
                  >
                    <Link2 className="w-4 h-4 mr-2" aria-hidden="true" />
                    Connect Strava
                  </Button>
                </div>
              )}

              {stravaStatus?.connected && stravaStatus?.needs_reconnect && (
                <div
                  id="stravaBrokenState_settings"
                  role="status"
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"
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
                    className="bg-amber-600 hover:bg-amber-700 text-white shrink-0 h-11 md:h-8 focus-visible:ring-2 focus-visible:ring-amber-300"
                  >
                    <Unplug className="mr-2" aria-hidden="true" />
                    Reconnect
                  </Button>
                </div>
              )}

              {isHealthy && (
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
                        <p
                          id="stravaLastSyncedText_settings"
                          className="text-xs text-slate-400 mt-0.5"
                        >
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
                      onClick={openDisconnectDialog}
                      variant="outline"
                      className="shrink-0 h-11 md:h-8 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 focus-visible:ring-2 focus-visible:ring-red-200"
                    >
                      <LogOut className="mr-2 w-4" aria-hidden="true" />
                      Disconnect
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {isHealthy && (
              <div id="stravaSyncBlock_settings" className="px-5 py-4 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Sync Strava Activities</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Pull your latest runs from Strava into the dashboard. Only new activities
                      since the last sync are imported.
                    </p>
                  </div>
                  <Button
                    id="syncStravaBtn_settings"
                    onClick={handleSync}
                    disabled={syncing}
                    className={STRAVA_BTN_CLASS}
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`}
                      aria-hidden="true"
                    />
                    {syncing ? 'Syncing…' : 'Sync Now'}
                  </Button>
                </div>

                {syncNotice && (
                  <div
                    id="syncNoticeMsg_settings"
                    className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-sm text-blue-700"
                    role="status"
                  >
                    <RefreshCw className="w-4 h-4 shrink-0" aria-hidden="true" />
                    {syncNotice}
                  </div>
                )}

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
              </div>
            )}

            {syncError && (
              <div className="px-5 py-4">
                <div
                  id="syncErrorMsg_settings"
                  className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {syncError}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <Modal open={disconnectOpen} onOpenChange={(open) => !open && closeDisconnectDialog()}>
        <ModalContent
          id="stravaDisconnectDialog_settings"
          className="w-full max-w-md"
          aria-describedby="strava-disconnect-description"
        >
          <ModalHeader>
            <ModalTitle>Disconnect Strava?</ModalTitle>
            <ModalDescription id="strava-disconnect-description" className="text-sm">
              The connection will be removed from this app and syncing will stop. Activities already
              imported stay. To also revoke access on Strava, go to Strava Settings {'>'} My Apps.
              You can reconnect at any time.
            </ModalDescription>
          </ModalHeader>

          {disconnectError && (
            <ModalBody padding={{ x: 0 }}>
              <div
                id="stravaDisconnectError_settings"
                className="flex items-center gap-1.5 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                {disconnectError}
              </div>
            </ModalBody>
          )}

          <ModalFooter>
            <Button
              id="stravaDisconnectCancelBtn_settings"
              variant="ghost"
              onClick={closeDisconnectDialog}
              disabled={disconnecting}
              className="h-11 md:h-8"
            >
              Cancel
            </Button>
            <Button
              id="stravaDisconnectConfirmBtn_settings"
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="h-11 md:h-8 bg-red-600 hover:bg-red-700 text-white focus-visible:ring-2 focus-visible:ring-red-300"
            >
              {disconnecting ? 'Disconnecting…' : 'Disconnect'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  )
}
