'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { getUserSettings, updateUserSettings } from '@/lib/api/running'

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
]

export default function NotificationsSection() {
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [values, setValues] = useState({
    notify_post_activity: false,
    notify_weekly_review: false,
    notify_friday_prep: false,
    notify_anomaly: false,
  })

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
          })
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

  async function handleToggle(key, newValue) {
    const prev = values[key]
    setValues((v) => ({ ...v, [key]: newValue }))
    try {
      await updateUserSettings({ [key]: newValue })
    } catch {
      setValues((v) => ({ ...v, [key]: prev }))
    }
  }

  return (
    <section aria-label="Notifications">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Notifications
      </h2>

      {loading ? (
        <Card className="border border-slate-200/70 py-0">
          <CardContent
            id="notificationsLoading_settingsPage"
            className="px-5 py-4 flex flex-col gap-4"
          >
            {TOGGLES.map((t) => (
              <div key={t.key} className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-36 rounded" />
                  <Skeleton className="h-3 w-56 rounded" />
                </div>
                <Skeleton className="h-6 w-11 rounded-full shrink-0" />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : loadError ? (
        <Card className="border border-red-200 py-0 bg-red-50">
          <CardContent className="px-5 py-4">
            <p className="text-sm text-red-700">{loadError}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
            <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-xs text-amber-700">
              Preferences are saved but push delivery isn&apos;t active yet. Enable push
              notifications coming soon.
            </p>
          </div>
          <Card className="border border-slate-200/70 py-0">
            <CardContent className="px-5 py-4 flex flex-col divide-y divide-slate-100">
              {TOGGLES.map((toggle, i) => (
                <div
                  key={toggle.key}
                  className={`flex items-center justify-between gap-4 ${i === 0 ? 'pb-4' : i === TOGGLES.length - 1 ? 'pt-4' : 'py-4'}`}
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
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  )
}
