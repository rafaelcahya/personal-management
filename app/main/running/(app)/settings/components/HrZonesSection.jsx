'use client'

import { FieldContent, FieldLabel, FieldDescription } from '@/components/base/Field/Field'
import { useState, useEffect } from 'react'
import { CheckCircle2, AlertCircle, Zap, Info, Heart } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import Card, {
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/base/Card/Card'
import Input from '@/components/base/Input/Input'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/Select/Select'
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
  const [isThresholdAutoCalc, setIsThresholdAutoCalc] = useState(true)
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
          const savedMax = data.max_hr
          const savedThreshold = data.threshold_hr
          const isAuto =
            !savedThreshold || (savedMax != null && savedThreshold === Math.round(savedMax * 0.85))
          setIsThresholdAutoCalc(isAuto)
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

  function handleMaxHrChange(e) {
    const val = e.target.value
    setMaxHr(val)
    if (isThresholdAutoCalc) {
      const num = Number(val)
      if (val !== '' && !isNaN(num) && num >= 60) {
        setThresholdHr(String(Math.round(num * 0.85)))
      } else {
        setThresholdHr('')
      }
    }
  }

  function handleThresholdHrChange(e) {
    const val = e.target.value
    setThresholdHr(val)
    setIsThresholdAutoCalc(val === '')
  }

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
        if (isThresholdAutoCalc) {
          setThresholdHr(String(Math.round(result * 0.85)))
        }
      }
    } catch {
      setDetectError(true)
    } finally {
      setDetecting(false)
    }
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

  return (
    <Card as="section" aria-label="HR zones">
      <CardHeader>
        <CardIcon icon={Heart} />
        <CardHeaderContent>
          <CardTitle>HR Zones</CardTitle>
          <CardDescription>Heart rate boundaries for training intensity</CardDescription>
        </CardHeaderContent>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div id="hrZonesLoading_settingsPage" className="px-5 py-4 flex flex-col gap-3">
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-9 w-full rounded" />
            <Skeleton className="h-9 w-full rounded" />
          </div>
        ) : loadError ? (
          <div className="px-5 py-4">
            <p className="text-sm text-red-700">{loadError}</p>
          </div>
        ) : (
          <div className="px-5 py-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Max HR */}
              <FieldContent>
                <FieldLabel htmlFor="maxHrInput_settingsPage">Max HR (bpm)</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    id="maxHrInput_settingsPage"
                    type="number"
                    min={60}
                    max={250}
                    value={maxHr}
                    onChange={handleMaxHrChange}
                    placeholder="e.g. 190"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                  />
                  <Button
                    id="detectMaxHrBtn_settingsPage"
                    type="button"
                    variant="outline"
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
                <FieldDescription className="leading-relaxed">
                  The highest heart rate your heart can reach during maximum effort. Used to
                  calculate HR training zones.
                </FieldDescription>
              </FieldContent>

              {/* Resting HR */}
              <FieldContent>
                <FieldLabel htmlFor="restingHrInput_settingsPage">Resting HR (bpm)</FieldLabel>
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
                <FieldDescription>
                  Your heart rate first thing in the morning — required for Karvonen method.
                </FieldDescription>
              </FieldContent>

              {/* Threshold HR */}
              <FieldContent>
                <FieldLabel htmlFor="thresholdHrInput_settingsPage">Threshold HR (bpm)</FieldLabel>
                <Input
                  id="thresholdHrInput_settingsPage"
                  type="number"
                  min={100}
                  max={220}
                  value={thresholdHr}
                  onChange={handleThresholdHrChange}
                  placeholder="e.g. 165"
                  className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                />
                {isThresholdAutoCalc && thresholdHr !== '' && (
                  <p
                    id="thresholdHrAutoCalcHint_settingsPage"
                    className="text-xs text-violet-600 flex items-center gap-1"
                  >
                    <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
                    Auto-calculated from Max HR (85%)
                  </p>
                )}
                <FieldDescription>
                  Your heart rate at lactate threshold — the hardest effort you can sustain for ~60
                  min. A common estimate is 85% of Max HR.
                </FieldDescription>
              </FieldContent>

              {/* Calculation Method */}
              <FieldContent>
                <FieldLabel htmlFor="hrZonesMethodSelect_settingsPage">
                  Calculation Method
                </FieldLabel>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger id="hrZonesMethodSelect_settingsPage">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {METHOD_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>
                  {METHOD_OPTIONS.find((o) => o.value === method)?.description}
                </FieldDescription>
              </FieldContent>
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
              <Button id="hrZonesSaveBtn_settingsPage" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
