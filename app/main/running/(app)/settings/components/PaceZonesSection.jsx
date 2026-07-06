'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, AlertCircle, Zap, Pencil, Timer } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import Card, {
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
  CardDescription,
} from '@/components/base/Card/Card'
import { Tabs, TabsList, TabsTrigger } from '@/components/base/Tabs/Tabs.jsx'
import Input from '@/components/base/Input/Input'
import FieldContent from '@/components/base/Field/FieldContent'
import FieldLabel from '@/components/base/Field/FieldLabel'
import FieldDescription from '@/components/base/Field/FieldDescription'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import { getUserProfile, updateUserProfile, detectThresholdPace } from '@/lib/api/running'

const INPUT_MODES = [
  { id: 'manual', label: 'Manual', icon: Pencil },
  { id: 'activity', label: 'From Activity', icon: Zap },
]

function secToMmss(totalSec) {
  if (!totalSec || totalSec <= 0) return ''
  const m = Math.floor(totalSec / 60)
  const s = String(totalSec % 60).padStart(2, '0')
  return `${m}:${s}`
}

function mmssToSec(str) {
  if (!str || typeof str !== 'string') return null
  const parts = str.trim().split(':')
  if (parts.length !== 2) return null
  const m = parseInt(parts[0], 10)
  const s = parseInt(parts[1], 10)
  if (isNaN(m) || isNaN(s) || s < 0 || s >= 60 || m < 0) return null
  return m * 60 + s
}

export default function PaceZonesSection() {
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [mode, setMode] = useState('manual')
  const [paceMmss, setPaceMmss] = useState('')

  const [detecting, setDetecting] = useState(false)
  const [detectResult, setDetectResult] = useState(null)
  const [detectActivities, setDetectActivities] = useState(null)
  const [detectSampleCount, setDetectSampleCount] = useState(null)
  const [detectError, setDetectError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getUserProfile()
        if (!cancelled && data?.threshold_pace_sec) {
          setPaceMmss(secToMmss(data.threshold_pace_sec))
        }
      } catch (err) {
        if (!cancelled) setLoadError(err.message || 'Failed to load pace zones settings')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleDetect() {
    setDetecting(true)
    setDetectResult(null)
    setDetectActivities(null)
    setDetectSampleCount(null)
    setDetectError(null)
    try {
      const result = await detectThresholdPace()
      setDetectResult(result.threshold_pace_sec)
      setDetectActivities(result.activities ?? null)
      setDetectSampleCount(result.sample_count ?? null)
      setPaceMmss(secToMmss(result.threshold_pace_sec))
    } catch (err) {
      setDetectError(err.message || 'Could not detect threshold pace')
    } finally {
      setDetecting(false)
    }
  }

  async function handleSave() {
    if (!paceMmss) {
      await saveThresholdPace(null)
      return
    }
    const paceSec = mmssToSec(paceMmss)
    if (!paceSec || paceSec < 120 || paceSec > 900) {
      setSaveError('Threshold pace must be between 2:00 and 15:00 /km')
      return
    }
    await saveThresholdPace(paceSec)
  }

  async function saveThresholdPace(value) {
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)
    try {
      await updateUserProfile({ threshold_pace_sec: value })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setSaveError(err.message || 'Failed to save pace zones settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card as="section" aria-label="Pace zones">
      <CardHeader>
        <CardIcon icon={Timer} />
        <CardHeaderContent>
          <CardTitle>Pace Zones</CardTitle>
          <CardDescription>Threshold pace used to calculate your 5 training zones</CardDescription>
        </CardHeaderContent>
      </CardHeader>

      {loading ? (
        <div id="paceZonesLoading_settingsPage" className="px-5 py-4 flex flex-col gap-3">
          <Skeleton className="h-4 w-40 rounded" />
          <Skeleton className="h-9 w-full rounded" />
        </div>
      ) : loadError ? (
        <div className="px-5 py-4">
          <p className="text-sm text-red-700">{loadError}</p>
        </div>
      ) : (
        <div className="px-5 py-5 flex flex-col gap-4">
          {/* Mode tabs */}
          <Tabs
            id="paceZonesModeToggle_settingsPage"
            value={mode}
            onValueChange={setMode}
            className="shrink-0 self-start"
          >
            <TabsList variant="pill" size="sm">
              {INPUT_MODES.map(({ id, label, icon: Icon }) => (
                <TabsTrigger
                  key={id}
                  id={`paceZonesMode_${id}_settingsPage`}
                  value={id}
                  icon={Icon}
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Manual mode */}
          {mode === 'manual' && (
            <FieldContent>
              <FieldLabel htmlFor="thresholdPaceInput_settingsPage">
                Threshold Pace (min:sec /km)
              </FieldLabel>
              <Input
                id="thresholdPaceInput_settingsPage"
                type="text"
                value={paceMmss}
                onChange={(e) => setPaceMmss(e.target.value)}
                placeholder="e.g. 5:20"
                className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 max-w-[120px]"
              />
              <FieldDescription>
                Your sustainable pace for ~60 min — the anchor for all 5 pace zones.
              </FieldDescription>
            </FieldContent>
          )}

          {/* From Activity mode */}
          {mode === 'activity' && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-slate-500 leading-relaxed">
                Analyses your recent run stream data to find your average pace when your heart rate
                is in the threshold zone (±6% of Threshold HR). Requires Threshold HR to be set in
                HR Zones.
              </p>
              <Button
                id="detectThresholdPaceBtn_settingsPage"
                type="button"
                variant="outline"
                size="base"
                disabled={detecting}
                onClick={handleDetect}
                className="gap-1.5 text-xs text-violet-600 border-violet-200 hover:bg-violet-50 w-fit"
              >
                <Zap className="size-3.5" aria-hidden="true" />
                {detecting ? 'Analysing…' : 'Detect from activities'}
              </Button>
              {detectResult && (
                <div className="flex flex-col gap-2">
                  <div
                    id="detectThresholdPaceResult_settingsPage"
                    className="flex items-center gap-1.5 text-xs text-green-700"
                  >
                    <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
                    Detected: <span className="font-semibold">{secToMmss(detectResult)} /km</span>
                    {detectSampleCount && (
                      <span className="text-slate-400">from {detectSampleCount} data points</span>
                    )}
                  </div>
                  {detectActivities && detectActivities.length > 0 && (
                    <div className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2 flex flex-col gap-1">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                        Activities analysed ({detectActivities.length})
                      </p>
                      {detectActivities.map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center justify-between gap-2 text-xs text-slate-600"
                        >
                          <span className="truncate max-w-[200px]">{a.name || 'Run'}</span>
                          <div className="flex items-center gap-2 shrink-0 text-slate-400">
                            {a.distance_m && <span>{(a.distance_m / 1000).toFixed(1)} km</span>}
                            <span>
                              {new Date(a.started_at).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {detectError && (
                <div
                  id="detectThresholdPaceError_settingsPage"
                  className="flex items-center gap-1.5 text-xs text-red-600"
                >
                  <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                  {detectError}
                </div>
              )}
              <FieldContent>
                <FieldLabel htmlFor="thresholdPaceActivityInput_settingsPage">
                  Threshold Pace (min:sec /km)
                </FieldLabel>
                <Input
                  id="thresholdPaceActivityInput_settingsPage"
                  type="text"
                  value={paceMmss}
                  onChange={(e) => setPaceMmss(e.target.value)}
                  placeholder="e.g. 5:20"
                  className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 max-w-[120px]"
                />
              </FieldContent>
            </div>
          )}
          <div className="flex items-center justify-end gap-3 pt-1">
            {saveSuccess && (
              <div
                id="paceZonesSaveSuccess_settingsPage"
                className="flex items-center gap-1.5 text-sm text-green-700"
                role="status"
                aria-live="polite"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                Saved
              </div>
            )}
            {saveError && (
              <div
                id="paceZonesSaveError_settingsPage"
                className="flex items-center gap-1.5 text-sm text-red-600"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                {saveError}
              </div>
            )}
            <Button
              id="paceZonesSaveBtn_settingsPage"
              onClick={handleSave}
              disabled={saving}
              size="base"
            >
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
