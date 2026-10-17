'use client'

import { useState, useEffect, useCallback } from 'react'
import { Smartphone, Trash2, Info } from 'lucide-react'
import Card, {
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/base/Card/Card'
import Button from '@/components/base/Button/Button'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import { Switch } from '@/components/base/Switch/Switch'
import {
  EmptyState,
  EmptyStateTitle,
  EmptyStateDescription,
} from '@/components/base/EmptyState/EmptyState'
import { getPushStatus, removePushDevice, sendTestPush } from '@/lib/api/notifications'
import {
  isPushSupported,
  getPermission,
  getCurrentSubscription,
  subscribeThisDevice,
  unsubscribeThisDevice,
} from '@/lib/push/pushClient'
import { describeDevice, errorText, formatWhen } from './pushText'

const PERMISSION_LABEL = {
  granted: 'Allowed',
  denied: 'Blocked',
  default: 'Not asked yet',
  unsupported: 'Not supported in this browser',
}

export default function PushDevicesSection() {
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [status, setStatus] = useState(null)
  const [permission, setPermission] = useState('default')
  const [thisEndpoint, setThisEndpoint] = useState(null)
  const [pending, setPending] = useState(false)
  const [toggleError, setToggleError] = useState(null)
  const [removingId, setRemovingId] = useState(null)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const refresh = useCallback(async () => {
    setPermission(getPermission())
    setLoadError(false)
    try {
      const [next, current] = await Promise.all([getPushStatus(), getCurrentSubscription()])
      setStatus(next)
      setThisEndpoint(current?.endpoint ?? null)
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const supported = isPushSupported()
  const devices = status?.devices ?? []
  const thisDevice = devices.find((d) => d.endpoint === thisEndpoint) ?? null

  async function handleToggle(on) {
    setPending(true)
    setToggleError(null)
    setTestResult(null)
    try {
      if (on) {
        const result = await Notification.requestPermission()
        if (result !== 'granted') {
          setToggleError('Permission denied. Please allow notifications in your browser settings.')
          return
        }
        await subscribeThisDevice({ fresh: true })
      } else {
        await unsubscribeThisDevice()
      }
    } catch (err) {
      setToggleError(err.message || 'Failed to update push notifications.')
    } finally {
      setPending(false)
      refresh()
    }
  }

  async function handleRemove(device) {
    setRemovingId(device.id)
    setToggleError(null)
    try {
      await removePushDevice(device.id)
    } catch (err) {
      setToggleError(err.message || 'Failed to remove the device.')
    } finally {
      setRemovingId(null)
      refresh()
    }
  }

  async function handleTest() {
    setTesting(true)
    setTestResult(null)
    try {
      const current = await getCurrentSubscription()
      if (!current) throw new Error('This browser has no push subscription. Turn push on first.')
      const result = await sendTestPush(current.endpoint)
      setTestResult(
        result.sent
          ? { ok: true, message: 'Sent — it should appear within a few seconds.' }
          : {
              ok: false,
              message: result.expired
                ? 'The subscription expired. Turn push on again.'
                : `The test failed: ${errorText(result.error)}.`,
            }
      )
    } catch (err) {
      setTestResult({ ok: false, message: err.message || 'Failed to send the test notification.' })
    } finally {
      setTesting(false)
      refresh()
    }
  }

  const lastFailure = status?.last_failure
  const lastSuccess = formatWhen(status?.last_success?.created_at)

  return (
    <Card as="section" aria-label="Push on your devices" id="pushDevicesSection_settingsPage">
      <CardHeader>
        <CardIcon icon={Smartphone} />
        <CardHeaderContent>
          <CardTitle>Push on your devices</CardTitle>
          <CardDescription>Choose which devices receive push notifications</CardDescription>
        </CardHeaderContent>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div id="pushDevicesLoading_settingsPage" className="px-5 py-4 flex flex-col gap-3">
            <Skeleton className="h-5 w-56 rounded" />
            <Skeleton className="h-14 w-full rounded-md" />
            <Skeleton className="h-14 w-full rounded-md" />
          </div>
        ) : loadError ? (
          <div
            id="pushDevicesError_settingsPage"
            role="alert"
            className="px-5 py-4 flex flex-col items-start gap-3"
          >
            <p className="text-sm text-destructive">Couldn&apos;t load your devices.</p>
            <Button id="pushDevicesRetryBtn_settingsPage" variant="secondary" onClick={refresh}>
              Try again
            </Button>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-slate-100">
            <div className="px-5 py-4 flex items-start justify-between gap-4">
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-sm font-medium text-slate-800">Push on this device</p>
                <p className="text-xs text-slate-500">
                  Browser permission:{' '}
                  <span id="pushPermission_settingsPage" className="font-medium">
                    {PERMISSION_LABEL[permission] ?? PERMISSION_LABEL.unsupported}
                  </span>
                </p>
                {permission === 'denied' && (
                  <p id="pushBlockedHelp_settingsPage" className="text-xs text-slate-600 mt-1">
                    Notifications are blocked for this site. Open the site settings (the lock or
                    tune icon next to the address bar), allow Notifications, reload, then turn this
                    on.
                  </p>
                )}
                {toggleError && (
                  <p
                    id="pushToggleError_settingsPage"
                    role="alert"
                    className="text-xs text-destructive mt-1"
                  >
                    {toggleError}
                  </p>
                )}
              </div>
              <Switch
                id="pushThisDeviceToggle_settingsPage"
                checked={!!thisDevice}
                onCheckedChange={handleToggle}
                disabled={!supported || pending}
                aria-label="Push on this device"
                className="shrink-0 mt-0.5"
              />
            </div>

            <div className="px-5 py-4 flex flex-col gap-3">
              <p className="text-sm font-medium text-slate-800">Your devices</p>
              {devices.length === 0 ? (
                <EmptyState size="sm" id="pushDevicesEmpty_settingsPage">
                  <EmptyStateTitle>No devices yet</EmptyStateTitle>
                  <EmptyStateDescription>
                    Turn on push on a device to receive notifications there.
                  </EmptyStateDescription>
                </EmptyState>
              ) : (
                <ul id="pushDevicesList_settingsPage" className="flex flex-col gap-2">
                  {devices.map((device) => {
                    const isThis = device.endpoint === thisEndpoint
                    return (
                      <li
                        key={device.id}
                        id={`pushDevice_${device.id.slice(0, 8)}_settingsPage`}
                        className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 flex flex-wrap items-center gap-2">
                            {describeDevice(device.user_agent)}
                            {isThis && (
                              <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">
                                This device
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-500">
                            Added {formatWhen(device.created_at)} · Last opened{' '}
                            {formatWhen(device.last_seen_at)} · Last delivered{' '}
                            {formatWhen(device.last_success_at) ?? 'never'}
                          </p>
                        </div>
                        <Button
                          id={`removePushDeviceBtn_${device.id.slice(0, 8)}_settingsPage`}
                          variant="ghost"
                          aria-label={`Remove ${describeDevice(device.user_agent)}`}
                          onClick={() => handleRemove(device)}
                          disabled={removingId === device.id}
                          className="shrink-0 min-h-11 min-w-11 sm:min-h-9 sm:min-w-9"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </li>
                    )
                  })}
                </ul>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  id="sendTestPushBtn_settingsPage"
                  variant="secondary"
                  onClick={handleTest}
                  disabled={!thisDevice || permission !== 'granted' || testing}
                  className="min-h-11 sm:min-h-9"
                >
                  {testing ? 'Sending…' : 'Send test notification'}
                </Button>
                {testResult && (
                  <p
                    id="sendTestPushResult_settingsPage"
                    role="status"
                    className={`text-xs ${testResult.ok ? 'text-success' : 'text-destructive'}`}
                  >
                    {testResult.message}
                  </p>
                )}
              </div>
            </div>

            <div className="px-5 py-4 flex flex-col gap-1 text-xs">
              <p id="pushLastSuccess_settingsPage" className="text-slate-600">
                Last delivered:{' '}
                {lastSuccess ? `${lastSuccess} (${status.last_success.source})` : 'never'}
              </p>
              {lastFailure && (
                <p id="pushLastFailure_settingsPage" className="text-destructive">
                  Last problem: {formatWhen(lastFailure.created_at)} —{' '}
                  {errorText(lastFailure.error)}
                  {lastFailure.status_code ? ` (${lastFailure.status_code})` : ''} ·{' '}
                  {lastFailure.source}
                </p>
              )}
              <p className="flex items-center gap-1 text-slate-500 mt-1">
                <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Removing a device here doesn&apos;t clear the permission in that browser.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
