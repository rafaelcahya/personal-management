'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, AlertCircle, Zap, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip as UITooltip,
  TooltipContent as UITooltipContent,
  TooltipProvider as UITooltipProvider,
  TooltipTrigger as UITooltipTrigger,
} from '@/components/ui/tooltip'
import { getHrZones, updateHrZones, detectMaxHr } from '@/lib/api/running'

const METHOD_OPTIONS = [
  {
    value: 'max_hr',
    label: 'Max HR',
    description: 'Zones based on % of your maximum heart rate. Simple and widely used.',
  },
  {
    value: 'karvonen',
    label: 'Karvonen (Heart Rate Reserve)',
    description: 'Uses the gap between resting and max HR. More personalised than Max HR.',
  },
  {
    value: 'threshold',
    label: 'Lactate Threshold',
    description: 'Zones anchored to your threshold HR. Best for structured training.',
  },
]

export default function HrZonesSection() {
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [detecting, setDetecting] = useState(false)
  const [detectSuccess, setDetectSuccess] = useState(null)
  const [detectError, setDetectError] = useState(false)

  const [maxHr, setMaxHr] = useState('')
  const [restingHr, setRestingHr] = useState('')
  const [thresholdHr, setThresholdHr] = useState('')
  const [method, setMethod] = useState('max_hr')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getHrZones()
        if (!cancelled && data) {
          setMaxHr(data.max_hr ?? '')
          setRestingHr(data.resting_hr_baseline ?? '')
          setThresholdHr(data.threshold_hr ?? '')
          setMethod(data.hr_zones_method ?? 'max_hr')
        }
      } catch (err) {
        if (!cancelled) setLoadError(err.message || 'Failed to load HR zones settings')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleDetectMaxHr() {
    setDetecting(true)
    setDetectSuccess(null)
    setDetectError(false)
    try {
      const result = await detectMaxHr()
      if (result == null) {
        setDetectSuccess('no_data')
      } else {
        setMaxHr(String(result))
        setDetectSuccess(result)
      }
    } catch {
      setDetectError(true)
    } finally {
      setDetecting(false)
    }
  }

  function handleAutoFillThresholdHr() {
    const max = Number(maxHr)
    if (!maxHr || isNaN(max) || max <= 0) return
    setThresholdHr(String(Math.round(max * 0.85)))
  }

  async function handleSave() {
    const payload = { hr_zones_method: method }

    const maxHrNum = Number(maxHr)
    if (maxHr !== '' && maxHr != null) {
      if (isNaN(maxHrNum) || maxHrNum < 60 || maxHrNum > 250) {
        setSaveError('Max HR must be between 60 and 250 bpm')
        return
      }
      payload.max_hr = maxHrNum
    } else {
      payload.max_hr = null
    }

    const restingNum = Number(restingHr)
    if (restingHr !== '' && restingHr != null) {
      if (isNaN(restingNum) || restingNum < 30 || restingNum > 120) {
        setSaveError('Resting HR must be between 30 and 120 bpm')
        return
      }
      payload.resting_hr_baseline = restingNum
    } else {
      payload.resting_hr_baseline = null
    }

    const thresholdNum = Number(thresholdHr)
    if (thresholdHr !== '' && thresholdHr != null) {
      if (isNaN(thresholdNum) || thresholdNum < 100 || thresholdNum > 220) {
        setSaveError('Threshold HR must be between 100 and 220 bpm')
        return
      }
      payload.threshold_hr = thresholdNum
    } else {
      payload.threshold_hr = null
    }

    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)
    try {
      await updateHrZones(payload)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setSaveError(err.message || 'Failed to save HR zones settings')
    } finally {
      setSaving(false)
    }
  }

  const maxHrNum = Number(maxHr)
  const hasValidMaxHr = maxHr !== '' && !isNaN(maxHrNum) && maxHrNum >= 60

  return (
    <section aria-label="HR zones">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        HR Zones
      </h2>

      {loading ? (
        <Card className="border border-slate-200/70 py-0">
          <CardContent id="hrZonesLoading_settingsPage" className="px-5 py-4 flex flex-col gap-3">
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-9 w-full rounded" />
            <Skeleton className="h-9 w-full rounded" />
          </CardContent>
        </Card>
      ) : loadError ? (
        <Card className="border border-red-200 bg-red-50">
          <CardContent className="px-5 py-4">
            <p className="text-sm text-red-700">{loadError}</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-slate-200/70 py-0">
          <CardContent className="px-5 py-4 flex flex-col gap-4">
            {/* Max HR */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="maxHrInput_settingsPage" className="text-sm font-medium">
                Max HR (bpm)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="maxHrInput_settingsPage"
                  type="number"
                  min={60}
                  max={250}
                  value={maxHr}
                  onChange={(e) => setMaxHr(e.target.value)}
                  placeholder="e.g. 190"
                  className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                />
                <Button
                  id="detectMaxHrBtn_settingsPage"
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={detecting}
                  onClick={handleDetectMaxHr}
                  className="shrink-0 gap-1.5 text-xs text-violet-600 border-violet-200 hover:bg-violet-50"
                >
                  <Zap className="size-3.5" aria-hidden="true" />
                  {detecting ? 'Detecting…' : 'Detect'}
                </Button>
              </div>
              {typeof detectSuccess === 'number' && (
                <p
                  id="maxHrDetectedHint_settingsPage"
                  className="text-xs text-green-700 flex items-center gap-1"
                >
                  <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
                  Detected: {detectSuccess} bpm — from your highest recorded activity
                </p>
              )}
              {detectSuccess === 'no_data' && (
                <p id="maxHrNoDataHint_settingsPage" className="text-xs text-slate-500">
                  No heart rate data found in your activities
                </p>
              )}
              {detectError && (
                <p id="maxHrDetectError_settingsPage" className="text-xs text-red-600">
                  Could not detect Max HR — please try again
                </p>
              )}
              <p className="text-xs text-slate-400 leading-relaxed">
                The highest heart rate your heart can reach during maximum effort. Used to calculate
                HR training zones.
              </p>
            </div>

            {/* Resting HR */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="restingHrInput_settingsPage" className="text-sm font-medium">
                Resting HR (bpm)
              </Label>
              <Input
                id="restingHrInput_settingsPage"
                type="number"
                min={30}
                max={120}
                value={restingHr}
                onChange={(e) => setRestingHr(e.target.value)}
                placeholder="e.g. 55"
                className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
              />
              <p className="text-xs text-slate-400">
                Your heart rate first thing in the morning — required for Karvonen method.
              </p>
            </div>

            {/* Threshold HR */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="thresholdHrInput_settingsPage" className="text-sm font-medium">
                  Threshold HR (bpm)
                </Label>
                <UITooltipProvider delayDuration={0}>
                  <UITooltip>
                    <UITooltipTrigger asChild>
                      <button
                        type="button"
                        className="text-slate-300 hover:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
                        aria-label="What is Threshold HR?"
                      >
                        <Info className="size-3.5" aria-hidden="true" />
                      </button>
                    </UITooltipTrigger>
                    <UITooltipContent side="top" className="max-w-64 text-xs leading-relaxed">
                      <p className="font-semibold mb-1">Threshold HR (LTHR)</p>
                      <p>
                        Your heart rate at lactate threshold — the hardest effort you can sustain
                        for ~60 minutes. Used by the Lactate Threshold zone method.
                      </p>
                      <p className="mt-1">
                        A common estimate is <span className="font-medium">85% of Max HR</span>, but
                        a 30-min all-out time trial gives more accurate results.
                      </p>
                    </UITooltipContent>
                  </UITooltip>
                </UITooltipProvider>
              </div>
              <div className="flex gap-2">
                <Input
                  id="thresholdHrInput_settingsPage"
                  type="number"
                  min={100}
                  max={220}
                  value={thresholdHr}
                  onChange={(e) => setThresholdHr(e.target.value)}
                  placeholder="e.g. 165"
                  className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                />
                <Button
                  id="thresholdHrAutoFillBtn_settingsPage"
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!hasValidMaxHr}
                  onClick={handleAutoFillThresholdHr}
                  className="shrink-0 text-xs text-violet-600 border-violet-200 hover:bg-violet-50 disabled:opacity-50"
                >
                  85% of Max HR
                </Button>
              </div>
              {!hasValidMaxHr && (
                <p id="thresholdHrNoMaxHr_settingsPage" className="text-xs text-red-500">
                  Set Max HR first to use the auto-fill
                </p>
              )}
            </div>

            {/* Calculation Method */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="hrZonesMethodSelect_settingsPage" className="text-sm font-medium">
                Calculation Method
              </Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger
                  id="hrZonesMethodSelect_settingsPage"
                  className="w-full text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600"
                >
                  <SelectValue>{METHOD_OPTIONS.find((o) => o.value === method)?.label}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {METHOD_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="items-start py-2.5 focus:ring-0 focus:outline-none cursor-pointer"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">{opt.label}</span>
                        <span className="text-xs text-slate-400 font-normal leading-snug whitespace-normal">
                          {opt.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              {saveSuccess && (
                <div
                  id="hrZonesSaveSuccess_settingsPage"
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
                  id="hrZonesSaveError_settingsPage"
                  className="flex items-center gap-1.5 text-sm text-red-600"
                  role="alert"
                  aria-live="assertive"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {saveError}
                </div>
              )}
              <Button
                id="hrZonesSaveBtn_settingsPage"
                onClick={handleSave}
                disabled={saving}
                size="sm"
              >
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
