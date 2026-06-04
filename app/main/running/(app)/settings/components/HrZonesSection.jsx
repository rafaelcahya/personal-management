'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
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
import { getUserSettings, updateUserSettings } from '@/lib/api/running'

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
  const [method, setMethod] = useState('max_hr')
  const [thresholdHr, setThresholdHr] = useState('')
  const [saveError, setSaveError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getUserSettings()
        if (!cancelled && data) {
          setMethod(data.hr_zones_method ?? 'max_hr')
          setThresholdHr(data.threshold_hr ?? '')
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

  function handleMethodChange(value) {
    setMethod(value)
    if (value !== 'threshold') setThresholdHr('')
    setSaveError(null)
    setSaveSuccess(false)
  }

  async function handleSave() {
    if (method === 'threshold') {
      const hr = Number(thresholdHr)
      if (!thresholdHr || isNaN(hr) || hr < 100 || hr > 220) {
        setSaveError('Threshold HR must be between 100 and 220 bpm')
        return
      }
    }
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)
    try {
      await updateUserSettings({
        hr_zones_method: method,
        threshold_hr: method === 'threshold' ? Number(thresholdHr) : null,
      })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setSaveError(err.message || 'Failed to save HR zones settings')
    } finally {
      setSaving(false)
    }
  }

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
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="hrZonesMethodSelect_settingsPage" className="text-sm font-medium">
                Calculation Method
              </Label>
              <Select value={method} onValueChange={handleMethodChange}>
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

            {method === 'threshold' && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="thresholdHrInput_settingsPage" className="text-sm font-medium">
                  Threshold HR (bpm)
                </Label>
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
              </div>
            )}

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
