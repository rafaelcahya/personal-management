'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bell } from 'lucide-react'
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
import { getNotificationPreferences, updateNotificationPreference } from '@/lib/api/notifications'
import { cacheSessionEndedPreference } from '@/lib/push/sessionEndedNotice'

export default function PreferencesSection() {
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [preferences, setPreferences] = useState([])
  const [saveError, setSaveError] = useState(null)
  const [savingType, setSavingType] = useState(null)

  const load = useCallback(async () => {
    setLoadError(false)
    try {
      const list = await getNotificationPreferences()
      setPreferences(list)
      const sessionEnded = list.find((p) => p.type === 'session_ended')
      if (sessionEnded) cacheSessionEndedPreference(sessionEnded.push_enabled)
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleToggle(type, value) {
    const previous = preferences.find((p) => p.type === type)?.push_enabled
    setSaveError(null)
    setSavingType(type)
    setPreferences((list) => list.map((p) => (p.type === type ? { ...p, push_enabled: value } : p)))
    try {
      await updateNotificationPreference(type, value)
      if (type === 'session_ended') cacheSessionEndedPreference(value)
    } catch (err) {
      setPreferences((list) =>
        list.map((p) => (p.type === type ? { ...p, push_enabled: previous } : p))
      )
      setSaveError(err.message || 'Failed to save the preference.')
    } finally {
      setSavingType(null)
    }
  }

  const modules = [...new Set(preferences.map((p) => p.module))]

  return (
    <Card as="section" aria-label="What to notify" id="notificationPreferencesSection_settingsPage">
      <CardHeader>
        <CardIcon icon={Bell} />
        <CardHeaderContent>
          <CardTitle>What to notify</CardTitle>
          <CardDescription>
            Pick which alerts are also pushed to your devices. They always show up in the
            notification list.
          </CardDescription>
        </CardHeaderContent>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div id="preferencesLoading_settingsPage" className="px-5 py-4 flex flex-col gap-4">
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
          <div
            id="preferencesError_settingsPage"
            role="alert"
            className="px-5 py-4 flex flex-col items-start gap-3"
          >
            <p className="text-sm text-destructive">Couldn&apos;t load your preferences.</p>
            <Button id="preferencesRetryBtn_settingsPage" variant="secondary" onClick={load}>
              Try again
            </Button>
          </div>
        ) : (
          <div className="flex flex-col">
            {modules.map((module) => (
              <div key={module} className="px-5 pt-4 pb-1">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  {module}
                </h3>
                <div className="flex flex-col divide-y divide-slate-100">
                  {preferences
                    .filter((p) => p.module === module)
                    .map((p) => (
                      <div key={p.type} className="flex items-center justify-between gap-4 py-3">
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <p className="text-sm font-medium text-slate-800">{p.title}</p>
                          <p className="text-xs text-slate-500">{p.description}</p>
                        </div>
                        <Switch
                          id={`pushPref_${p.type}_settingsPage`}
                          checked={p.push_enabled}
                          onCheckedChange={(checked) => handleToggle(p.type, checked)}
                          disabled={savingType === p.type}
                          aria-label={`Push: ${p.title}`}
                          className="shrink-0"
                        />
                      </div>
                    ))}
                </div>
              </div>
            ))}
            {saveError && (
              <p
                id="preferencesSaveError_settingsPage"
                role="alert"
                className="text-xs text-destructive px-5 py-3"
              >
                {saveError}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
