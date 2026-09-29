'use client'

import { useState } from 'react'
import { AlertTriangle, Clock, Gauge, HeartPulse, Mountain, Sparkles } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import { Spinner } from '@/components/base/Spinner/Spinner'
import ElevationChart from './ElevationChart'
import EnergyBudgetChart from './EnergyBudgetChart'
import PaceTable from './PaceTable'
import { fmtDuration, fmtPace } from '../../dashboard/utils/format'

function Stat({ icon: Icon, label, value, sub }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
      <span className="flex items-center gap-1.5 text-xs text-slate-400">
        <Icon className="size-3.5" />
        {label}
      </span>
      <span className="text-lg font-semibold text-slate-800 tabular-nums">{value}</span>
      {sub && <span className="text-xs text-slate-400">{sub}</span>}
    </div>
  )
}

function SubHeading({ children }) {
  return <h3 className="mb-3 text-sm font-semibold text-slate-700">{children}</h3>
}

function deriveHrBand(result) {
  if (result.hr_band) return result.hr_band
  const first = result.km_splits?.[0]
  if (first?.target_hr_low != null) return { low: first.target_hr_low, high: first.target_hr_high }
  return null
}

export default function SimulationResult({
  result,
  simulationId,
  aiStrategy,
  onSave,
  saving,
  onGenerateStrategy,
  strategyLoading,
  strategyError,
}) {
  const [name, setName] = useState('')
  const hrBand = deriveHrBand(result)

  return (
    <div id="simResultSummary_routeSimulatorPage" className="space-y-6">
      {/* Save bar — only before the simulation is persisted */}
      {!simulationId && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            id="simNameInput_routeSimulatorPage"
            placeholder="Name this simulation to save it"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
          />
          <Button
            id="saveSimulationBtn_routeSimulatorPage"
            onClick={() => onSave(name.trim())}
            disabled={saving || !name.trim()}
            className="shrink-0 bg-violet-600 hover:bg-violet-700"
          >
            {saving ? <Spinner className="size-4" /> : 'Save'}
          </Button>
        </div>
      )}

      {/* Reality-check banner */}
      {!result.is_realistic && (
        <div
          id="realityCheckBanner_routeSimulatorPage"
          className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
        >
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-500" />
          <div>
            <p className="font-medium">This target is likely too aggressive</p>
            <p className="text-amber-700">
              Holding this pace means running above your threshold the whole way. A realistic finish
              on this route is around <strong>{fmtDuration(result.suggested_time_sec)}</strong>.
            </p>
          </div>
        </div>
      )}
      {result.is_realistic && result.has_threshold_pace === false && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
          Set your threshold pace in Settings to unlock a realistic-target check.
        </div>
      )}

      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          icon={Gauge}
          label="Distance"
          value={`${(result.total_distance_m / 1000).toFixed(2)} km`}
        />
        <Stat
          icon={Mountain}
          label="Elevation"
          value={`+${result.total_elevation_gain_m} m`}
          sub={`-${result.total_elevation_loss_m} m`}
        />
        <Stat icon={Clock} label="Planned finish" value={fmtDuration(result.predicted_time_sec)} />
        <Stat
          icon={Gauge}
          label="Effort pace"
          value={`${fmtPace(result.effort_flat_pace_sec_per_km)}/km`}
          sub="flat-equivalent"
        />
      </div>

      {/* Elevation profile + zones */}
      <div>
        <SubHeading>Elevation & effort zones</SubHeading>
        <ElevationChart profile={result.elevation_profile} />
      </div>

      {/* Energy budget */}
      <div>
        <SubHeading>Energy budget</SubHeading>
        <EnergyBudgetChart profile={result.elevation_profile} />
      </div>

      {/* Per-km plan */}
      <div>
        <SubHeading>Per-kilometre plan</SubHeading>
        <PaceTable splits={result.km_splits} />
      </div>

      {/* HR / effort guidance */}
      {hrBand && (
        <div
          id="effortGuidance_routeSimulatorPage"
          className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4"
        >
          <HeartPulse className="mt-0.5 size-5 shrink-0 text-rose-400" />
          <div className="text-sm text-slate-600">
            <p className="font-medium text-slate-700">
              Hold {hrBand.low}–{hrBand.high} bpm{hrBand.label ? ` (${hrBand.label})` : ''}{' '}
              throughout
            </p>
            <p className="text-slate-500">
              Effort stays even — expect your HR to drift up on climbs. Don&apos;t chase pace to
              force it back down; let the pace ease and it will settle on the descents.
            </p>
          </div>
        </div>
      )}

      {/* AI strategy */}
      <div
        id="aiStrategyCard_routeSimulatorPage"
        className="rounded-xl border border-violet-100 bg-violet-50/40 p-4"
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-violet-700">
            <Sparkles className="size-4" />
            AI strategy
          </span>
          {simulationId && (
            <Button
              id="generateStrategyBtn_routeSimulatorPage"
              variant="ghost"
              size="sm"
              onClick={onGenerateStrategy}
              disabled={strategyLoading}
              className="text-violet-600 hover:bg-violet-100"
            >
              {strategyLoading ? (
                <Spinner className="size-4" />
              ) : aiStrategy ? (
                'Regenerate'
              ) : (
                'Generate strategy'
              )}
            </Button>
          )}
        </div>
        {!simulationId && (
          <p className="text-sm text-slate-500">Save this simulation to generate an AI strategy.</p>
        )}
        {simulationId && strategyError && <p className="text-sm text-red-500">{strategyError}</p>}
        {simulationId && !strategyError && aiStrategy && (
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{aiStrategy}</p>
        )}
        {simulationId && !strategyError && !aiStrategy && !strategyLoading && (
          <p className="text-sm text-slate-500">
            Generate a plain-language race plan for this route.
          </p>
        )}
      </div>
    </div>
  )
}
