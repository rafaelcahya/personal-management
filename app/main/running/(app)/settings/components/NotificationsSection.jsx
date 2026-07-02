'use client'

import { useState, useEffect, useCallback } from 'react'
import { Info, Bell } from 'lucide-react'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import { Switch } from '@/components/ui/switch'
import { getUserSettings, updateUserSettings, savePushSubscription } from '@/lib/api/running'

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

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

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

  useEffect(() => {
    setSwSupported(
      typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window
    )
  }, [])

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

  const registerServiceWorker = useCallback(async () => {
    if (!swSupported) return null
    const registration = await navigator.serviceWorker.register('/sw.js')
    await navigator.serviceWorker.ready
    return registration
  }, [swSupported])

  async function handlePushToggle(newValue) {
    setPushPending(true)
    setPushError(null)

    try {
      if (newValue) {
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') {
          setPushError('Permission denied. Please allow notifications in your browser settings.')
          setPushPending(false)
          return
        }

        const registration = await registerServiceWorker()
        if (!registration) {
          setPushError('Push notifications are not supported in this browser.')
          setPushPending(false)
          return
        }

        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (!vapidKey) {
          setPushError('Push notifications are not configured.')
          setPushPending(false)
          return
        }

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        })

        await savePushSubscription(subscription.toJSON())
        setPushEnabled(true)
      } else {
        // Unsubscribe from PushManager if subscribed
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready
          const existing = await registration.pushManager.getSubscription()
          if (existing) await existing.unsubscribe()
        }
        await savePushSubscription(null)
        setPushEnabled(false)
      }
    } catch (err) {
      setPushError(err.message || 'Failed to update push notification setting.')
    } finally {
      setPushPending(false)
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
    <section
      aria-label="Notifications"
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
          <Bell className="size-4 text-violet-600" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">Notifications</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure push alerts for your training insights
          </p>
        </div>
      </div>

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
    </section>
  )
}
