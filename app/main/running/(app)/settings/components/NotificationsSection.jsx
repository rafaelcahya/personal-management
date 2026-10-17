'use client'

import { useState, useEffect, useCallback } from 'react'
import { Info, Bell } from 'lucide-react'
import Card, {
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/base/Card/Card'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import { Switch } from '@/components/base/Switch/Switch'
import { getUserSettings, updateUserSettings, getPushStatus, sendTestPush } from '@/lib/api/running'
import {
  isPushSupported,
  getPermission,
  getCurrentSubscription,
  subscribeThisDevice,
  unsubscribeThisDevice,
} from '@/lib/running/pushClient'
import PushStatusPanel, { errorText } from './PushStatusPanel'

const TOGGLES = [
  {
    key: 'notify_post_activity',
    id: 'notifyPostActivityToggle_settingsPage',
    label: 'Post-activity insight',
    description: 'Get an AI insight after each completed run',
  },
  {
    key: 'notify_weekly_review',
    id: 'notifyWeeklyReviewToggle_settingsPage',
    label: 'Weekly review',
    description: 'Receive a weekly training summary every Monday',
  },
  {
    key: 'notify_friday_prep',
    id: 'notifyFridayPrepToggle_settingsPage',
    label: 'Friday race prep',
    description: 'Get a pre-race briefing the Friday before your race',
  },
  {
    key: 'notify_anomaly',
    id: 'notifyAnomalyToggle_settingsPage',
    label: 'Anomaly alerts',
    description: 'Be notified when unusual patterns are detected in your training',
  },
  {
    key: 'notify_race_reminder',
    id: 'notifyRaceReminderToggle_settingsPage',
    label: 'Race reminders',
    description: 'Get reminders 14, 7, 3, and 1 day before your upcoming races',
  },
]

export default function NotificationsSection() {
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [values, setValues] = useState({
    notify_post_activity: false,
    notify_weekly_review: false,
    notify_friday_prep: false,
    notify_anomaly: false,
    notify_race_reminder: false,
  })
  const [pushEnabled, setPushEnabled] = useState(false)
  const [pushPending, setPushPending] = useState(false)
  const [pushError, setPushError] = useState(null)
  const [toggleError, setToggleError] = useState(null)
  const [swSupported, setSwSupported] = useState(false)
  const [permission, setPermission] = useState('default')
  const [pushStatus, setPushStatus] = useState(null)
  const [deviceEndpoint, setDeviceEndpoint] = useState(null)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [statusLoading, setStatusLoading] = useState(true)
  const [statusError, setStatusError] = useState(false)

  const refreshPushStatus = useCallback(async () => {
    setPermission(getPermission())
    setStatusError(false)
    try {
      const [status, current] = await Promise.all([getPushStatus(), getCurrentSubscription()])
      setPushStatus(status)
      setPushEnabled(status.enabled)
      setDeviceEndpoint(current?.endpoint ?? null)
    } catch {
      setPushStatus(null)
      setStatusError(true)
    } finally {
      setStatusLoading(false)
    }
  }, [])

  useEffect(() => {
    setSwSupported(isPushSupported())
    refreshPushStatus()
  }, [refreshPushStatus])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getUserSettings()
        if (!cancelled && data) {
          setValues({
            notify_post_activity: data.notify_post_activity ?? false,
            notify_weekly_review: data.notify_weekly_review ?? false,
            notify_friday_prep: data.notify_friday_prep ?? false,
            notify_anomaly: data.notify_anomaly ?? false,
            notify_race_reminder: data.notify_race_reminder ?? false,
          })
          setPushEnabled(data.push_notifications_enabled ?? false)
        }
      } catch (err) {
        if (!cancelled) setLoadError(err.message || 'Failed to load notification settings')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  async function handlePushToggle(newValue) {
    setPushPending(true)
    setPushError(null)
    setTestResult(null)

    try {
      if (newValue) {
        const result = await Notification.requestPermission()
        if (result !== 'granted') {
          setPushError('Permission denied. Please allow notifications in your browser settings.')
          return
        }
        await subscribeThisDevice({ fresh: true })
        setPushEnabled(true)
      } else {
        await unsubscribeThisDevice()
        setPushEnabled(false)
      }
    } catch (err) {
      setPushError(err.message || 'Failed to update push notification setting.')
    } finally {
      setPushPending(false)
      refreshPushStatus()
    }
  }

  async function handleTestPush() {
    setTesting(true)
    setTestResult(null)
    try {
      const current = await getCurrentSubscription()
      if (!current) throw new Error('This browser has no push subscription. Turn push on again.')
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
      setTestResult({ ok: false, message: err.message || 'Failed to send test notification' })
    } finally {
      setTesting(false)
      refreshPushStatus()
    }
  }

  async function handleToggle(key, newValue) {
    const prev = values[key]
    setToggleError(null)
    setValues((v) => ({ ...v, [key]: newValue }))
    try {
      await updateUserSettings({ [key]: newValue })
    } catch (err) {
      setValues((v) => ({ ...v, [key]: prev }))
      setToggleError(err.message || 'Failed to save notification setting.')
    }
  }

  return (
    <Card as="section" aria-label="Notifications">
      <CardHeader>
        <CardIcon icon={Bell} />
        <CardHeaderContent>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure push alerts for your training insights</CardDescription>
        </CardHeaderContent>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div id="notificationsLoading_settingsPage" className="px-5 py-4 flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-36 rounded" />
                  <Skeleton className="h-3 w-56 rounded" />
                </div>
                <Skeleton className="h-6 w-11 rounded-full shrink-0" />
              </div>
            ))}
          </div>
        ) : loadError ? (
          <div className="px-5 py-4">
            <p className="text-sm text-red-700">{loadError}</p>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mx-5 my-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" aria-hidden="true" />
              <p className="text-xs text-amber-700">
                Push notifications are in beta. Some browsers or devices may behave differently.
              </p>
            </div>

            <div className="px-5 flex flex-col divide-y divide-slate-100">
              {/* Push notifications master toggle */}
              <div className="flex items-start justify-between gap-4 pb-4">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <p className="text-sm font-medium text-slate-800">Enable push notifications</p>
                  <p className="text-xs text-slate-400">
                    {swSupported
                      ? 'Allow this app to send browser push notifications'
                      : 'Not supported in this browser'}
                  </p>
                  {pushError && (
                    <p
                      id="pushNotificationsError_settingsPage"
                      className="text-xs text-red-600 mt-1"
                      role="alert"
                      aria-live="polite"
                    >
                      {pushError}
                    </p>
                  )}
                </div>
                <Switch
                  id="pushNotificationsToggle_settingsPage"
                  checked={pushEnabled}
                  onCheckedChange={handlePushToggle}
                  disabled={!swSupported || pushPending}
                  aria-label="Enable push notifications"
                  className="shrink-0 mt-0.5"
                />
              </div>
            </div>

            <PushStatusPanel
              permission={permission}
              status={pushStatus}
              loading={statusLoading}
              error={statusError}
              onRetry={refreshPushStatus}
              deviceEndpoint={deviceEndpoint}
              onTest={handleTestPush}
              testing={testing}
              testResult={testResult}
            />

            <div className="px-5 flex flex-col divide-y divide-slate-100">
              {/* Per-notification toggles */}
              {TOGGLES.map((toggle, i) => (
                <div
                  key={toggle.key}
                  className={`flex items-center justify-between gap-4 ${i === TOGGLES.length - 1 ? 'pt-4 pb-5' : 'py-4'}`}
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{toggle.label}</p>
                    <p className="text-xs text-slate-400">{toggle.description}</p>
                  </div>
                  <Switch
                    id={toggle.id}
                    checked={values[toggle.key]}
                    onCheckedChange={(checked) => handleToggle(toggle.key, checked)}
                    aria-label={toggle.label}
                    className="shrink-0"
                  />
                </div>
              ))}
            </div>

            {toggleError && (
              <p
                id="notifyToggleError_settingsPage"
                className="text-xs text-red-600 px-5 pb-4"
                role="alert"
                aria-live="polite"
              >
                {toggleError}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
