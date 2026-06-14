'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, AlertCircle, Timer, Zap, Pencil } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { getUserProfile, updateUserProfile, detectThresholdPace } from '@/lib/api/running'

const INPUT_MODES = [
  { id: 'manual', label: 'Manual', icon: Pencil },
  { id: 'race', label: 'Race Result', icon: Timer },
  { id: 'activity', label: 'From Activity', icon: Zap },
]

const RIEGEL_EXPONENT = 1.06

// Riegel: t2 = t1 × (d2/d1)^1.06
// Threshold pace ≈ predicted 10K pace from a recent race result
function riegelPredictPaceSec(raceSec, raceDistM, targetDistM = 10000) {
  if (!raceSec || !raceDistM || raceDistM <= 0) return null
  const t2 = raceSec * Math.pow(targetDistM / raceDistM, RIEGEL_EXPONENT)
  return Math.round(t2 / (targetDistM / 1000))
}

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

function hhmmssTotalSec(hh, mm, ss) {
  const h = parseInt(hh || '0', 10)
  const m = parseInt(mm || '0', 10)
  const s = parseInt(ss || '0', 10)
  if (isNaN(h) || isNaN(m) || isNaN(s)) return null
  return h * 3600 + m * 60 + s
}

export default function PaceZonesSection() {
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [mode, setMode] = useState('manual')
  const [paceMmss, setPaceMmss] = useState('')

  // Race result inputs
  const [raceDist, setRaceDist] = useState('5')
  const [raceHh, setRaceHh] = useState('')
  const [raceMm, setRaceMm] = useState('')
  const [raceSs, setRaceSs] = useState('')
  const [riegelResult, setRiegelResult] = useState(null)

  // Activity detect
  const [detecting, setDetecting] = useState(false)
  const [detectResult, setDetectResult] = useState(null)
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

  function handleComputeRiegel() {
    const distM = parseFloat(raceDist) * 1000
    const raceTotalSec = hhmmssTotalSec(raceHh, raceMm, raceSs)
    if (!raceTotalSec || raceTotalSec <= 0 || !distM) {
      setRiegelResult(null)
      return
    }
    // Predict threshold pace as 10K Riegel estimate (threshold ≈ 10K pace)
    const paceSec = riegelPredictPaceSec(raceTotalSec, distM, 10000)
    setRiegelResult(paceSec)
    if (paceSec) setPaceMmss(secToMmss(paceSec))
  }

  async function handleDetect() {
    setDetecting(true)
    setDetectResult(null)
    setDetectError(null)
    try {
      const result = await detectThresholdPace()
      setDetectResult(result.threshold_pace_sec)
      setPaceMmss(secToMmss(result.threshold_pace_sec))
    } catch (err) {
      setDetectError(err.message || 'Could not detect threshold pace')
    } finally {
      setDetecting(false)
    }
  }

  async function handleSave() {
    const paceSec = mmssToSec(paceMmss)
    if (!paceMmss) {
      await saveThresholdPace(null)
      return
    }
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
    <section aria-label="Pace zones">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Pace Zones
      </h2>

      {loading ? (
        <Card className="border border-slate-200/70 py-0">
          <CardContent id="paceZonesLoading_settingsPage" className="px-5 py-4 flex flex-col gap-3">
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
            {/* Mode tabs */}
            <div
              id="paceZonesModeToggle_settingsPage"
              className="flex rounded-lg overflow-hidden border border-slate-200 text-[11px] font-semibold w-fit"
            >
              {INPUT_MODES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  id={`paceZonesMode_${id}_settingsPage`}
                  onClick={() => setMode(id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${mode === id ? 'bg-violet-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                >
                  <Icon className="size-3" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>

            {/* Manual mode */}
            {mode === 'manual' && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="thresholdPaceInput_settingsPage" className="text-sm font-medium">
                  Threshold Pace (min:sec /km)
                </Label>
                <Input
                  id="thresholdPaceInput_settingsPage"
                  type="text"
                  value={paceMmss}
                  onChange={(e) => setPaceMmss(e.target.value)}
                  placeholder="e.g. 5:20"
                  className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 max-w-[120px]"
                />
                <p className="text-xs text-slate-400">
                  Your sustainable pace for ~60 min — the anchor for all 5 pace zones.
                </p>
              </div>
            )}

            {/* Race Result mode */}
            {mode === 'race' && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter a recent race result — threshold pace is estimated as the equivalent 10K
                  pace using the Riegel formula.
                </p>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium">Race Distance (km)</Label>
                  <div className="flex rounded-lg overflow-hidden border border-slate-200 text-[11px] font-semibold w-fit">
                    {['5', '10', '21.1'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        id={`paceZonesRaceDist_${d}_settingsPage`}
                        onClick={() => setRaceDist(d)}
                        className={`px-3 py-1.5 transition-colors ${raceDist === d ? 'bg-violet-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                      >
                        {d === '21.1' ? 'Half Marathon' : `${d}K`}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium">Finish Time</Label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      id="raceTimeHh_settingsPage"
                      type="number"
                      min={0}
                      max={9}
                      value={raceHh}
                      onChange={(e) => setRaceHh(e.target.value)}
                      placeholder="0"
                      className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 w-16 text-center"
                    />
                    <span className="text-slate-400 text-sm">h</span>
                    <Input
                      id="raceTimeMm_settingsPage"
                      type="number"
                      min={0}
                      max={59}
                      value={raceMm}
                      onChange={(e) => setRaceMm(e.target.value)}
                      placeholder="25"
                      className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 w-16 text-center"
                    />
                    <span className="text-slate-400 text-sm">m</span>
                    <Input
                      id="raceTimeSs_settingsPage"
                      type="number"
                      min={0}
                      max={59}
                      value={raceSs}
                      onChange={(e) => setRaceSs(e.target.value)}
                      placeholder="00"
                      className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 w-16 text-center"
                    />
                    <span className="text-slate-400 text-sm">s</span>
                    <Button
                      id="riegelComputeBtn_settingsPage"
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleComputeRiegel}
                      className="ml-1 text-xs text-violet-600 border-violet-200 hover:bg-violet-50"
                    >
                      Estimate
                    </Button>
                  </div>
                </div>
                {riegelResult && (
                  <div
                    id="riegelResult_settingsPage"
                    className="flex items-center gap-1.5 text-xs text-green-700"
                  >
                    <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
                    Estimated threshold pace:{' '}
                    <span className="font-semibold">{secToMmss(riegelResult)} /km</span>
                    <span className="text-slate-400">(applied above)</span>
                  </div>
                )}
                {/* show current pace */}
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="thresholdPaceRaceInput_settingsPage"
                    className="text-sm font-medium"
                  >
                    Threshold Pace (min:sec /km)
                  </Label>
                  <Input
                    id="thresholdPaceRaceInput_settingsPage"
                    type="text"
                    value={paceMmss}
                    onChange={(e) => setPaceMmss(e.target.value)}
                    placeholder="e.g. 5:20"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 max-w-[120px]"
                  />
                </div>
              </div>
            )}

            {/* From Activity mode */}
            {mode === 'activity' && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Analyses your recent run stream data to find your average pace when your heart
                  rate is in the threshold zone (±6% of Threshold HR). Requires Threshold HR to be
                  set in HR Zones.
                </p>
                <Button
                  id="detectThresholdPaceBtn_settingsPage"
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={detecting}
                  onClick={handleDetect}
                  className="gap-1.5 text-xs text-violet-600 border-violet-200 hover:bg-violet-50 w-fit"
                >
                  <Zap className="size-3.5" aria-hidden="true" />
                  {detecting ? 'Analysing…' : 'Detect from activities'}
                </Button>
                {detectResult && (
                  <div
                    id="detectThresholdPaceResult_settingsPage"
                    className="flex items-center gap-1.5 text-xs text-green-700"
                  >
                    <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
                    Detected: <span className="font-semibold">{secToMmss(detectResult)} /km</span>
                    <span className="text-slate-400">(applied below)</span>
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
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="thresholdPaceActivityInput_settingsPage"
                    className="text-sm font-medium"
                  >
                    Threshold Pace (min:sec /km)
                  </Label>
                  <Input
                    id="thresholdPaceActivityInput_settingsPage"
                    type="text"
                    value={paceMmss}
                    onChange={(e) => setPaceMmss(e.target.value)}
                    placeholder="e.g. 5:20"
                    className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 max-w-[120px]"
                  />
                </div>
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
