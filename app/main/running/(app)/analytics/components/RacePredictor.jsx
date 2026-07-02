'use client'

import { useState, useMemo } from 'react'
import {
  RUN_TYPES,
  DISTANCE_BRACKETS,
  RIEGEL_TARGETS,
  getBracket,
  riegelPredict,
  fmtDurationShort,
} from './utils'
import { fmtPace } from '@/app/main/running/(app)/dashboard/utils/format'
import EmptyState from './EmptyState'
import Button from '@/components/base/Button/Button'

export default function RacePredictor({ activities }) {
  const [sourceBracket, setSourceBracket] = useState('5K')

  const bracketBests = useMemo(() => {
    const bests = {}
    for (const a of activities) {
      if (!RUN_TYPES.has(a.activity_type) || !a.avg_pace_sec_per_km || !a.distance_m) continue
      const b = getBracket(a.distance_m)
      if (!b) continue
      const timeSec = (a.avg_pace_sec_per_km / 1000) * a.distance_m
      if (!bests[b.key] || timeSec < bests[b.key].timeSec) {
        bests[b.key] = {
          timeSec,
          distance_m: a.distance_m,
          pace: a.avg_pace_sec_per_km,
          label: b.label,
        }
      }
    }
    return bests
  }, [activities])

  const availableBrackets = DISTANCE_BRACKETS.filter((b) => bracketBests[b.key])

  if (availableBrackets.length === 0) {
    return (
      <EmptyState message="Need at least one run in a recognized distance bracket (5K–Marathon)" />
    )
  }

  const activeBracket =
    availableBrackets.find((b) => b.key === sourceBracket) ?? availableBrackets[0]
  const source = bracketBests[activeBracket.key]

  const predictions = RIEGEL_TARGETS.map((t) => {
    const predicted = riegelPredict(source.timeSec, source.distance_m, t.distance_m)
    const paceSec = predicted / (t.distance_m / 1000)
    return {
      label: t.label,
      distance_m: t.distance_m,
      predicted_sec: Math.round(predicted),
      pace_sec: Math.round(paceSec),
    }
  })

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-4">
        <span className="text-xs text-slate-500">Based on your best</span>
        <div className="flex flex-wrap gap-2">
          {availableBrackets.map((b) => (
            <Button
              key={b.key}
              size="xs"
              onClick={() => setSourceBracket(b.key)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                activeBracket.key === b.key
                  ? 'text-white border-transparent'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
              style={
                activeBracket.key === b.key ? { background: b.color, borderColor: b.color } : {}
              }
            >
              {b.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-violet-50 rounded-lg px-4 py-2.5 mb-4 text-xs text-violet-700">
        <span className="font-semibold">Source:</span> Best {activeBracket.label} pace —{' '}
        <span className="font-semibold">{fmtPace(source.pace)} /km</span> (
        {fmtDurationShort(Math.round(source.timeSec))} total)
      </div>

      <div className="overflow-x-auto">
        <table
          id="racePredictorTable_analyticsPage"
          className="min-w-full text-sm"
          aria-label="Race predictor results"
        >
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Distance
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Predicted Time
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Predicted Pace
              </th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((p) => (
              <tr
                key={p.label}
                className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
              >
                <td className="px-5 py-3.5 font-semibold text-slate-900">{p.label}</td>
                <td className="px-5 py-3.5 font-mono font-semibold text-slate-700">
                  {fmtDurationShort(p.predicted_sec)}
                </td>
                <td className="px-5 py-3.5 font-mono text-slate-700">{fmtPace(p.pace_sec)} /km</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 mt-3">
        Predicted using the Riegel formula. Accuracy improves the closer your source distance is to
        the target.
      </p>
    </div>
  )
}
