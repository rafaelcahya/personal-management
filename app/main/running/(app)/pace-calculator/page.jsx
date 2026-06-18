'use client'

import { useState, useMemo, useEffect } from 'react'
import { Timer, AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  formatPaceSec,
  formatDuration,
  formatDistance,
  KM_TO_MI,
  MI_TO_KM,
} from '@/lib/running/pace'
import TimeInput from './components/TimeInput'
import DistanceSelect, { DISTANCE_PRESETS } from './components/DistanceSelect'
import SplitsTable from './components/SplitsTable'
import RaceProjectionTable from './components/RaceProjectionTable'

function parseDistanceM(preset, customValue, unit) {
  const found = DISTANCE_PRESETS.find((p) => p.label === preset)
  if (found && found.m != null) return found.m
  if (preset === 'Custom') {
    const n = parseFloat(customValue)
    if (isNaN(n) || n <= 0) return null
    return unit === 'mi' ? n * MI_TO_KM * 1000 : n * 1000
  }
  return null
}

const STEP_LENGTH_M = 0.9
const MAX_STEPS = 200000

function parseTimeSec(h, m, s) {
  const hh = parseInt(h, 10) || 0
  const mm = parseInt(m, 10) || 0
  const ss = parseInt(s, 10) || 0
  const total = hh * 3600 + mm * 60 + ss
  return total > 0 ? total : null
}

function parsePaceSec(min, sec) {
  const mm = parseInt(min, 10) || 0
  const ss = parseInt(sec, 10) || 0
  const total = mm * 60 + ss
  return total > 0 ? total : null
}

function buildSplits(distM, paceSecPerKm, unit) {
  if (!distM || !paceSecPerKm || distM <= 0 || paceSecPerKm <= 0) return []
  const unitDistM = unit === 'mi' ? MI_TO_KM * 1000 : 1000
  const paceSecPerUnit = unit === 'mi' ? paceSecPerKm * MI_TO_KM : paceSecPerKm
  const totalUnits = distM / unitDistM

  // Distance shorter than one unit — single row for the full distance
  if (totalUnits < 1) {
    const totalSec = totalUnits * paceSecPerUnit
    return [{ label: totalUnits.toFixed(2), splitSec: totalSec, cumSec: totalSec }]
  }

  const MAX_ROWS = 50
  const interval = Math.ceil(totalUnits / MAX_ROWS)
  const splits = []
  let cumSec = 0
  for (let i = interval; i <= totalUnits + 0.0001; i += interval) {
    const actual = Math.min(i, totalUnits)
    const prevUnit = i - interval
    const splitSec = (actual - prevUnit) * paceSecPerUnit
    cumSec += splitSec
    const isLast = actual >= totalUnits - 0.0001
    splits.push({
      label: isLast && actual % 1 !== 0 ? actual.toFixed(2) : `${Math.round(actual)}`,
      splitSec,
      cumSec,
    })
    if (isLast) break
  }
  return splits
}

export default function PaceCalculatorPage() {
  const [unit, setUnit] = useState('km')
  const [unitReady, setUnitReady] = useState(false)

  // Pace mode
  const [paceDistPreset, setPaceDistPreset] = useState('5K')
  const [paceCustomDist, setPaceCustomDist] = useState('')
  const [paceH, setPaceH] = useState('')
  const [paceM, setPaceM] = useState('')
  const [paceS, setPaceS] = useState('')

  // Projection mode
  const [projPaceMin, setProjPaceMin] = useState('')
  const [projPaceSec, setProjPaceSec] = useState('')
  const [projSubMode, setProjSubMode] = useState('distance')
  const [projDistPreset, setProjDistPreset] = useState('5K')
  const [projCustomDist, setProjCustomDist] = useState('')
  const [projH, setProjH] = useState('')
  const [projM, setProjM] = useState('')
  const [projS, setProjS] = useState('')

  // Steps mode
  const [stepsCount, setStepsCount] = useState('')

  const [activeTab, setActiveTab] = useState('pace')

  useEffect(() => {
    const saved = localStorage.getItem('paceCalculatorUnit')
    if (saved === 'km' || saved === 'mi') setUnit(saved)
    setUnitReady(true)
  }, [])

  function handleUnitChange(val) {
    setUnit(val)
    localStorage.setItem('paceCalculatorUnit', val)
  }

  // Pace mode calculations
  const paceCalc = useMemo(() => {
    const distM = parseDistanceM(paceDistPreset, paceCustomDist, unit)
    const totalSec = parseTimeSec(paceH, paceM, paceS)
    if (!distM || !totalSec) return null
    const paceSecPerKm = totalSec / (distM / 1000)
    const paceSecPerMi = paceSecPerKm * MI_TO_KM
    const speedKmh = 3600 / paceSecPerKm
    const speedMph = speedKmh * KM_TO_MI
    const warn = paceSecPerKm < 120 || paceSecPerKm > 1200
    return { paceSecPerKm, paceSecPerMi, speedKmh, speedMph, distM, totalSec, warn }
  }, [paceDistPreset, paceCustomDist, paceH, paceM, paceS, unit])

  // Projection mode calculations
  const projCalc = useMemo(() => {
    const paceSecPerUnit = parsePaceSec(projPaceMin, projPaceSec)
    if (!paceSecPerUnit) return null
    const paceSecPerKm = unit === 'mi' ? paceSecPerUnit / MI_TO_KM : paceSecPerUnit
    const warn = paceSecPerKm < 120 || paceSecPerKm > 1200

    if (projSubMode === 'distance') {
      const distM = parseDistanceM(projDistPreset, projCustomDist, unit)
      if (!distM) return { paceSecPerKm, warn, result: null }
      const totalSec = paceSecPerKm * (distM / 1000)
      return { paceSecPerKm, warn, result: { type: 'time', totalSec, distM } }
    } else {
      const totalSec = parseTimeSec(projH, projM, projS)
      if (!totalSec) return { paceSecPerKm, warn, result: null }
      const distM = (totalSec / paceSecPerKm) * 1000
      return { paceSecPerKm, warn, result: { type: 'distance', totalSec, distM } }
    }
  }, [
    projPaceMin,
    projPaceSec,
    projSubMode,
    projDistPreset,
    projCustomDist,
    projH,
    projM,
    projS,
    unit,
  ])

  // Steps mode calculations
  const stepsCalc = useMemo(() => {
    if (stepsCount === '') return { distanceM: null, invalid: false }
    const steps = parseInt(stepsCount, 10)
    const invalid =
      !Number.isInteger(steps) ||
      steps <= 0 ||
      steps > MAX_STEPS ||
      String(steps) !== stepsCount.trim()
    if (invalid) return { distanceM: null, invalid: true }
    const distanceM = steps * STEP_LENGTH_M
    return { distanceM, invalid: false }
  }, [stepsCount])

  // Splits + race projections based on active tab
  const { activePaceSecPerKm, activeDistM, activeTimeSec } = useMemo(() => {
    if (activeTab === 'pace' && paceCalc) {
      return {
        activePaceSecPerKm: paceCalc.paceSecPerKm,
        activeDistM: paceCalc.distM,
        activeTimeSec: paceCalc.totalSec,
      }
    }
    if (activeTab === 'projection' && projCalc?.result) {
      return {
        activePaceSecPerKm: projCalc.paceSecPerKm,
        activeDistM: projCalc.result.distM,
        activeTimeSec: projCalc.result.totalSec,
      }
    }
    return { activePaceSecPerKm: null, activeDistM: null, activeTimeSec: null }
  }, [activeTab, paceCalc, projCalc])

  const splits = useMemo(
    () => buildSplits(activeDistM, activePaceSecPerKm, unit),
    [activeDistM, activePaceSecPerKm, unit]
  )

  function handleTimeChange(mode, field, val) {
    if (mode === 'pace') {
      if (field === 'hours') setPaceH(val)
      else if (field === 'minutes') setPaceM(val)
      else setPaceS(val)
    } else {
      if (field === 'hours') setProjH(val)
      else if (field === 'minutes') setProjM(val)
      else setProjS(val)
    }
  }

  const inputClass =
    'w-16 text-center text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500'

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-violet-100 shrink-0">
          <Timer className="size-5 text-violet-600" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-slate-800">Pace Calculator</h1>
          <p className="text-sm text-slate-500">
            Calculate pace, project race times, and view splits
          </p>
        </div>
      </div>

      {/* Unit toggle */}
      <Card className="border border-slate-200/70 py-0">
        <CardContent className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Label className="text-sm font-medium text-slate-600 shrink-0">Unit</Label>
            <RadioGroup
              id="unitToggle_paceCalculator"
              value={unit}
              onValueChange={handleUnitChange}
              className="flex gap-4"
            >
              <div className="flex items-center gap-1.5">
                <RadioGroupItem value="km" id="unitKm_paceCalculator" />
                <Label
                  htmlFor="unitKm_paceCalculator"
                  className="text-sm font-medium cursor-pointer"
                >
                  km
                </Label>
              </div>
              <div className="flex items-center gap-1.5">
                <RadioGroupItem value="mi" id="unitMi_paceCalculator" />
                <Label
                  htmlFor="unitMi_paceCalculator"
                  className="text-sm font-medium cursor-pointer"
                >
                  mi
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Calculator */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger id="tabPace_paceCalculator" value="pace" className="flex-1">
            Pace Mode
          </TabsTrigger>
          <TabsTrigger id="tabProjection_paceCalculator" value="projection" className="flex-1">
            Projection Mode
          </TabsTrigger>
          <TabsTrigger id="tabSteps_paceCalculator" value="steps" className="flex-1">
            Steps → Distance
          </TabsTrigger>
        </TabsList>

        {/* Pace Mode */}
        <TabsContent value="pace" className="mt-4">
          <Card className="border border-slate-200/70 py-0">
            <CardContent className="px-4 py-4 flex flex-col gap-4">
              <p className="text-xs text-slate-500">
                Enter a distance and total time to find your average pace.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DistanceSelect
                  preset={paceDistPreset}
                  customValue={paceCustomDist}
                  unit={unit}
                  onPresetChange={setPaceDistPreset}
                  onCustomChange={setPaceCustomDist}
                  selectId="distancePreset_paceCalculator"
                  customId="customDistance_paceCalculator"
                />
                <TimeInput
                  hours={paceH}
                  minutes={paceM}
                  seconds={paceS}
                  onChange={(field, val) => handleTimeChange('pace', field, val)}
                  idPrefix="time_paceCalculator"
                />
              </div>

              {paceCalc?.warn && (
                <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                  <AlertTriangle className="size-3.5 shrink-0" aria-hidden="true" />
                  Pace seems unusual — please check your inputs.
                </div>
              )}

              {paceCalc && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div className="flex flex-col gap-0.5 bg-violet-50 rounded-lg px-3 py-2.5">
                    <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-wide">
                      Pace
                    </span>
                    <span
                      id="paceKm_paceCalculator"
                      className="text-base font-semibold text-violet-700"
                    >
                      {formatPaceSec(paceCalc.paceSecPerKm)} /km
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 bg-slate-50 rounded-lg px-3 py-2.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                      Pace
                    </span>
                    <span
                      id="paceMi_paceCalculator"
                      className="text-base font-semibold text-slate-700"
                    >
                      {formatPaceSec(paceCalc.paceSecPerMi)} /mi
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 bg-slate-50 rounded-lg px-3 py-2.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                      Speed
                    </span>
                    <span
                      id="speedKmh_paceCalculator"
                      className="text-base font-semibold text-slate-700"
                    >
                      {paceCalc.speedKmh.toFixed(1)} km/h
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 bg-slate-50 rounded-lg px-3 py-2.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                      Speed
                    </span>
                    <span
                      id="speedMph_paceCalculator"
                      className="text-base font-semibold text-slate-700"
                    >
                      {paceCalc.speedMph.toFixed(1)} mph
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projection Mode */}
        <TabsContent value="projection" className="mt-4">
          <Card className="border border-slate-200/70 py-0">
            <CardContent className="px-4 py-4 flex flex-col gap-4">
              <p className="text-xs text-slate-500">Enter a pace to estimate time or distance.</p>

              {/* Pace input */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium">Pace (per {unit})</Label>
                <div className="flex items-center gap-1.5">
                  <div className="flex flex-col items-center gap-0.5">
                    <Input
                      id="projPaceMinutes_paceCalculator"
                      type="number"
                      min={0}
                      value={projPaceMin}
                      onChange={(e) => setProjPaceMin(e.target.value)}
                      placeholder="00"
                      className={inputClass}
                    />
                    <span className="text-[10px] text-slate-400">MM</span>
                  </div>
                  <span className="text-slate-400 font-medium pb-3">:</span>
                  <div className="flex flex-col items-center gap-0.5">
                    <Input
                      id="projPaceSeconds_paceCalculator"
                      type="number"
                      min={0}
                      max={59}
                      value={projPaceSec}
                      onChange={(e) => setProjPaceSec(e.target.value)}
                      placeholder="00"
                      className={inputClass}
                    />
                    <span className="text-[10px] text-slate-400">SS</span>
                  </div>
                </div>
                {parseInt(projPaceSec, 10) >= 60 && (
                  <p className="text-xs text-amber-600">
                    {`${projPaceSec}s → +${Math.floor(parseInt(projPaceSec, 10) / 60)}m ${parseInt(projPaceSec, 10) % 60}s will be added to minutes`}
                  </p>
                )}
              </div>

              {/* Sub-mode toggle */}
              <RadioGroup
                id="projSubMode_paceCalculator"
                value={projSubMode}
                onValueChange={setProjSubMode}
                className="flex gap-4"
              >
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="distance" id="projModeDistance_paceCalculator" />
                  <Label
                    htmlFor="projModeDistance_paceCalculator"
                    className="text-sm font-medium cursor-pointer"
                  >
                    I have a distance → find time
                  </Label>
                </div>
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="time" id="projModeTime_paceCalculator" />
                  <Label
                    htmlFor="projModeTime_paceCalculator"
                    className="text-sm font-medium cursor-pointer"
                  >
                    I have a time → find distance
                  </Label>
                </div>
              </RadioGroup>

              {projSubMode === 'distance' ? (
                <DistanceSelect
                  preset={projDistPreset}
                  customValue={projCustomDist}
                  unit={unit}
                  onPresetChange={setProjDistPreset}
                  onCustomChange={setProjCustomDist}
                  selectId="projDistancePreset_paceCalculator"
                  customId="projCustomDistance_paceCalculator"
                />
              ) : (
                <TimeInput
                  hours={projH}
                  minutes={projM}
                  seconds={projS}
                  onChange={(field, val) => handleTimeChange('proj', field, val)}
                  idPrefix="projTime_paceCalculator"
                />
              )}

              {projCalc?.warn && (
                <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                  <AlertTriangle className="size-3.5 shrink-0" aria-hidden="true" />
                  Pace seems unusual — please check your inputs.
                </div>
              )}

              {projCalc?.result && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {projCalc.result.type === 'time' ? (
                    <div className="flex flex-col gap-0.5 bg-violet-50 rounded-lg px-3 py-2.5">
                      <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-wide">
                        Estimated Time
                      </span>
                      <span
                        id="projResultTime_paceCalculator"
                        className="text-base font-semibold text-violet-700"
                      >
                        {formatDuration(projCalc.result.totalSec)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-0.5 bg-violet-50 rounded-lg px-3 py-2.5">
                      <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-wide">
                        Estimated Distance
                      </span>
                      <span
                        id="projResultDistance_paceCalculator"
                        className="text-base font-semibold text-violet-700"
                      >
                        {formatDistance(projCalc.result.distM, unit)}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5 bg-slate-50 rounded-lg px-3 py-2.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                      Avg Pace
                    </span>
                    <span
                      id="projAvgPace_paceCalculator"
                      className="text-base font-semibold text-slate-700"
                    >
                      {unit === 'mi'
                        ? `${formatPaceSec(projCalc.paceSecPerKm * MI_TO_KM)} /mi`
                        : `${formatPaceSec(projCalc.paceSecPerKm)} /km`}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Steps Mode */}
        <TabsContent value="steps" className="mt-4">
          <Card className="border border-slate-200/70 py-0">
            <CardContent className="px-4 py-4 flex flex-col gap-4">
              <p className="text-xs text-slate-500">
                Enter your step count to estimate the distance covered.
              </p>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="stepsCount_paceCalculator" className="text-sm font-medium">
                  Steps
                </Label>
                <Input
                  id="stepsCount_paceCalculator"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={MAX_STEPS}
                  step={1}
                  maxLength={6}
                  value={stepsCount}
                  onChange={(e) => setStepsCount(e.target.value)}
                  placeholder="e.g. 6500"
                  className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                />
              </div>

              {stepsCalc.invalid && (
                <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                  <AlertTriangle className="size-3.5 shrink-0" aria-hidden="true" />
                  Steps must be a positive whole number.
                </div>
              )}

              {stepsCalc.distanceM != null && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div
                    className={`flex flex-col gap-0.5 rounded-lg px-3 py-2.5 ${
                      unit === 'km' ? 'bg-violet-50' : 'bg-slate-50'
                    }`}
                  >
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wide ${
                        unit === 'km' ? 'text-violet-400' : 'text-slate-400'
                      }`}
                    >
                      Distance
                    </span>
                    <span
                      id="stepsDistanceKm_paceCalculator"
                      className={`text-base font-semibold ${
                        unit === 'km' ? 'text-violet-700' : 'text-slate-700'
                      }`}
                    >
                      {formatDistance(stepsCalc.distanceM, 'km')}
                    </span>
                  </div>
                  <div
                    className={`flex flex-col gap-0.5 rounded-lg px-3 py-2.5 ${
                      unit === 'mi' ? 'bg-violet-50' : 'bg-slate-50'
                    }`}
                  >
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wide ${
                        unit === 'mi' ? 'text-violet-400' : 'text-slate-400'
                      }`}
                    >
                      Distance
                    </span>
                    <span
                      id="stepsDistanceMi_paceCalculator"
                      className={`text-base font-semibold ${
                        unit === 'mi' ? 'text-violet-700' : 'text-slate-700'
                      }`}
                    >
                      {formatDistance(stepsCalc.distanceM, 'mi')}
                    </span>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-400">
                Rough estimate based on an average running step length of {STEP_LENGTH_M * 100} cm.
                Actual step length varies with your pace and height.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Splits + Race Projections — suppressed until localStorage unit is resolved */}
      {unitReady && activePaceSecPerKm && activeDistM && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border border-slate-200/70 py-0">
            <CardContent className="px-4 py-4">
              <SplitsTable splits={splits} unit={unit} />
            </CardContent>
          </Card>
          <Card className="border border-slate-200/70 py-0">
            <CardContent className="px-4 py-4">
              <RaceProjectionTable refTimeSec={activeTimeSec} refDistM={activeDistM} unit={unit} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
