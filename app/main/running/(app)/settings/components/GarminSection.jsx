'use client'

import { useEffect, useState } from 'react'
import { Watch, AlertTriangle, AlertCircle, LogOut, KeyRound, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import Button from '@/components/base/Button/Button'
import { Badge } from '@/components/base/Badge/Badge'
import Card, {
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/base/Card/Card'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import { fetchGarminConnection } from '@/lib/api/running'
import {
  GARMIN_EXPIRY_WARNING_DAYS,
  daysUntilExpiry,
  expiryPhrase,
  formatDateTime,
  formatExpiryDate,
} from '../../../utils/garmin'
import SectionLoadError from './SectionLoadError'
import GarminKeyForm from './GarminKeyForm'
import GarminSyncBlock from './GarminSyncBlock'
import GarminReplaceDialog from './GarminReplaceDialog'
import GarminRemoveDialog from './GarminRemoveDialog'

const NOT_CONNECTED = {
  status: 'not_connected',
  key_last4: null,
  key_expires_at: null,
  last_synced_at: null,
  last_error: null,
}

const REMOVE_BTN_CLASS =
  'shrink-0 h-11 md:h-8 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 focus-visible:ring-2 focus-visible:ring-red-200'

export default function GarminSection() {
  const [connection, setConnection] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [replaceOpen, setReplaceOpen] = useState(false)
  const [removeOpen, setRemoveOpen] = useState(false)
  const [showCatchUp, setShowCatchUp] = useState(false)
  const [syncError, setSyncError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchGarminConnection()
        if (!cancelled) setConnection(data)
      } catch (err) {
        if (err.message === 'UNAUTHORIZED') {
          window.location.href = '/login'
          return
        }
        if (!cancelled) setError(err.message || 'Failed to load Garmin connection')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  // The action already worked when this runs, so a failed re-read keeps the local state
  async function refreshQuietly() {
    try {
      setConnection(await fetchGarminConnection())
    } catch {
      /* keep what is on screen */
    }
  }

  function handleSaved(saved) {
    // First connect and expired/invalid recovery both start a catch-up sync on the server
    setShowCatchUp(connection?.status !== 'connected')
    setSyncError(null)
    setConnection(saved)
    setReplaceOpen(false)
    toast.success('Garmin connected')
    refreshQuietly()
  }

  function handleRemoved() {
    setConnection(NOT_CONNECTED)
    setShowCatchUp(false)
    setSyncError(null)
    refreshQuietly()
  }

  function handleNotConnected() {
    setShowCatchUp(false)
    refreshQuietly()
  }

  const status = connection?.status
  const days = daysUntilExpiry(connection?.key_expires_at)
  const expiringSoon = days != null && days <= GARMIN_EXPIRY_WARNING_DAYS

  return (
    <Card as="section" aria-label="Garmin" id="garminConnectionSection_settings">
      <CardHeader>
        <CardIcon icon={Watch} />
        <CardHeaderContent>
          <CardTitle>Garmin</CardTitle>
          <CardDescription>
            Add your Garmin API key to enrich runs with extra watch data
          </CardDescription>
        </CardHeaderContent>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div id="garminConnectionLoading_settings" className="px-5 py-4 flex flex-col gap-3">
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-3 w-full max-w-64 rounded" />
          </div>
        ) : error ? (
          <SectionLoadError
            id="garminConnectionError_settings"
            retryId="garminRetryBtn_settings"
            message={error}
            onRetry={() => setReloadKey((k) => k + 1)}
          />
        ) : (
          <div className="flex flex-col divide-y divide-slate-100">
            <div className="px-5 py-4">
              {status === 'not_connected' && (
                <div id="garminNotConnectedState_settings" className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Not connected</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      In Garmin Connect, create a Personal API key, then paste it here. Pick the
                      same expiry date you chose there.
                    </p>
                  </div>
                  <GarminKeyForm
                    formId="garminKeyForm_settings"
                    submitId="garminConnectBtn_settings"
                    submitLabel="Connect"
                    showIcon
                    onSaved={handleSaved}
                  />
                </div>
              )}

              {status === 'connected' && (
                <div id="garminConnectedState_settings" className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          size="sm"
                          className="bg-green-50 text-green-700 border-green-200 font-semibold"
                        >
                          Connected
                        </Badge>
                        <span
                          id="garminKeyLast4Text_settings"
                          className="text-sm text-slate-700 tabular-nums"
                        >
                          Key ending •••• {connection.key_last4}
                        </span>
                      </div>
                      {days != null && (
                        <p id="garminExpiryText_settings" className="text-xs text-slate-400 mt-1">
                          {expiryPhrase(days)}
                          {days > 0 && ` (${formatExpiryDate(connection.key_expires_at)})`}
                        </p>
                      )}
                      <p
                        id="garminLastSyncedText_settings"
                        className="text-xs text-slate-400 mt-0.5"
                      >
                        {connection.last_synced_at
                          ? `Last synced: ${formatDateTime(connection.last_synced_at)}`
                          : 'Never synced'}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button
                        id="garminReplaceKeyBtn_settings"
                        variant="outline"
                        onClick={() => setReplaceOpen(true)}
                        className="shrink-0 h-11 md:h-8 focus-visible:ring-2 focus-visible:ring-violet-200"
                      >
                        <KeyRound className="mr-2 w-4" aria-hidden="true" />
                        Replace key
                      </Button>
                      <Button
                        id="garminRemoveBtn_settings"
                        variant="outline"
                        onClick={() => setRemoveOpen(true)}
                        className={REMOVE_BTN_CLASS}
                      >
                        <LogOut className="mr-2 w-4" aria-hidden="true" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  {expiringSoon && (
                    <div
                      id="garminExpiryWarning_settings"
                      role="status"
                      className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800"
                    >
                      <AlertTriangle
                        className="w-4 h-4 text-amber-600 shrink-0"
                        aria-hidden="true"
                      />
                      {days <= 0 ? 'Expires today.' : `${expiryPhrase(days)}.`} Make a new key in
                      Garmin Connect.
                    </div>
                  )}
                </div>
              )}

              {status === 'expired' && (
                <div id="garminExpiredState_settings" className="flex flex-col gap-4">
                  <div
                    role="status"
                    className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"
                  >
                    <AlertTriangle
                      className="h-4 w-4 text-amber-600 mt-0.5 shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Your key expired</p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        Garmin data stopped coming in. Strava still syncs as normal. Save a new key
                        to catch up on missed runs.
                      </p>
                    </div>
                  </div>
                  <GarminKeyForm
                    formId="garminKeyForm_settings"
                    submitId="garminSaveKeyBtn_settings"
                    submitLabel="Save new key"
                    onSaved={handleSaved}
                  />
                  <RemoveLink onClick={() => setRemoveOpen(true)} />
                </div>
              )}

              {status === 'invalid' && (
                <div id="garminInvalidState_settings" className="flex flex-col gap-4">
                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
                  >
                    <AlertCircle
                      className="h-4 w-4 text-red-600 mt-0.5 shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-medium text-red-700">Garmin rejected your key</p>
                      <p id="garminLastErrorMsg_settings" className="text-xs text-red-700 mt-0.5">
                        {connection.last_error || 'Garmin could not accept this key.'}
                      </p>
                      <p className="text-xs text-red-700 mt-0.5">Strava still syncs as normal.</p>
                    </div>
                  </div>
                  <GarminKeyForm
                    formId="garminKeyForm_settings"
                    submitId="garminSaveKeyBtn_settings"
                    submitLabel="Save new key"
                    onSaved={handleSaved}
                  />
                  <RemoveLink onClick={() => setRemoveOpen(true)} />
                </div>
              )}
            </div>

            {showCatchUp && status === 'connected' && (
              <div className="px-5 py-4">
                <div
                  id="garminCatchUpMsg_settings"
                  role="status"
                  className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-sm text-blue-700"
                >
                  <RefreshCw className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Catching up on missed runs. New data will appear shortly.
                </div>
              </div>
            )}

            {status === 'connected' && (
              <GarminSyncBlock
                onStatusRefresh={refreshQuietly}
                onNotConnected={handleNotConnected}
                onError={setSyncError}
              />
            )}

            {syncError && (
              <div className="px-5 py-4">
                <div
                  id="garminSyncErrorMsg_settings"
                  role="alert"
                  className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {syncError}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <GarminReplaceDialog open={replaceOpen} onOpenChange={setReplaceOpen} onSaved={handleSaved} />
      <GarminRemoveDialog
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        onRemoved={handleRemoved}
      />
    </Card>
  )
}

function RemoveLink({ onClick }) {
  return (
    <Button
      id="garminRemoveBtn_settings"
      variant="ghost"
      onClick={onClick}
      className="self-start h-11 md:h-8 px-2 text-xs text-red-700 hover:bg-red-50 hover:text-red-800 focus-visible:ring-2 focus-visible:ring-red-200"
    >
      Remove connection
    </Button>
  )
}
