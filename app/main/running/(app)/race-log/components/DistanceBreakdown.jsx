'use client'

import { fmtDistance, fmtPace, fmtDuration } from '../../dashboard/utils/format'

function computeFromSegments(excessDistM, activityMovingTimeSec, segments, timeKey) {
  const sorted = [...segments].sort((a, b) => {
    const aKey = a.lap_index ?? a.split_number ?? 0
    const bKey = b.lap_index ?? b.split_number ?? 0
    return aKey - bKey
  })

  let remainingExcessM = excessDistM
  let excessTimeSec = 0
  let excessDistFromSegs = 0
  const excessIndices = new Set()

  for (let i = sorted.length - 1; i >= 0; i--) {
    if (remainingExcessM <= 0) break
    const segDist = sorted[i].distance_m || 0
    const segTime = sorted[i][timeKey] || 0

    if (segDist <= remainingExcessM) {
      excessTimeSec += segTime
      excessDistFromSegs += segDist
      remainingExcessM -= segDist
      excessIndices.add(i)
    } else {
      const fraction = remainingExcessM / segDist
      excessTimeSec += Math.round(segTime * fraction)
      excessDistFromSegs += remainingExcessM
      remainingExcessM = 0
      excessIndices.add(i)
    }
  }

  return {
    officialTimeSec: activityMovingTimeSec - excessTimeSec,
    excessDistM: excessDistFromSegs,
    excessTimeSec,
    sortedSegments: sorted,
    excessIndices,
  }
}

export default function DistanceBreakdown({
  entryDistanceM,
  entryFinishTimeSec,
  activityDistanceM,
  activityMovingTimeSec,
  splits,
  laps,
}) {
  if (!entryDistanceM || !activityDistanceM || !activityMovingTimeSec) return null

  const rawExcessDistM = activityDistanceM - entryDistanceM
  if (rawExcessDistM < 10) return null

  const hasSplits = Array.isArray(splits) && splits.length > 0
  const hasLaps = Array.isArray(laps) && laps.length > 0

  let officialDistM, officialTimeSec, excessDistM, excessTimeSec
  let splitPills = null

  if (hasSplits) {
    const result = computeFromSegments(
      rawExcessDistM,
      activityMovingTimeSec,
      splits,
      'duration_sec'
    )
    officialDistM = activityDistanceM - result.excessDistM
    officialTimeSec = result.officialTimeSec
    excessDistM = result.excessDistM
    excessTimeSec = result.excessTimeSec

    splitPills = result.sortedSegments.map((s, i) => ({
      label: `km ${s.split_number}`,
      pace: s.pace_sec_per_km,
      isExcess: result.excessIndices.has(i),
    }))
  } else if (hasLaps) {
    const result = computeFromSegments(
      rawExcessDistM,
      activityMovingTimeSec,
      laps,
      'moving_time_sec'
    )
    officialDistM = activityDistanceM - result.excessDistM
    officialTimeSec = result.officialTimeSec
    excessDistM = result.excessDistM
    excessTimeSec = result.excessTimeSec
  } else {
    if (!entryFinishTimeSec) return null
    officialDistM = entryDistanceM
    officialTimeSec = entryFinishTimeSec
    excessDistM = rawExcessDistM
    excessTimeSec = activityMovingTimeSec - entryFinishTimeSec
  }

  if (excessTimeSec < 0 || officialTimeSec <= 0) return null

  const officialPaceSec = Math.round(officialTimeSec / (officialDistM / 1000))
  const excessPaceSec = excessDistM > 0 ? Math.round(excessTimeSec / (excessDistM / 1000)) : null
  const paceDiffSec = excessPaceSec != null ? excessPaceSec - officialPaceSec : null
  const overPct = ((rawExcessDistM / entryDistanceM) * 100).toFixed(1)

  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
        Distance Breakdown
      </p>

      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Official segment */}
        <div className="flex flex-col gap-3 p-3 bg-violet-50 rounded-lg border border-violet-100/60">
          <span className="text-[10px] font-semibold text-violet-500 uppercase tracking-wide">
            Official · {fmtDistance(officialDistM)} km
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="font-mono tabular-nums text-sm font-bold text-slate-800">
              {fmtDuration(officialTimeSec)}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wide">Total time</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-mono tabular-nums text-sm font-bold text-slate-800">
              {fmtPace(officialPaceSec)}
              <span className="text-xs font-normal text-slate-400">/km</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wide">Avg pace</span>
          </div>
        </div>

        {/* Excess segment */}
        <div className="flex flex-col gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100/60">
          <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide">
            Excess · +{fmtDistance(excessDistM)} km
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="font-mono tabular-nums text-sm font-bold text-slate-800">
              {excessTimeSec > 0 ? fmtDuration(excessTimeSec) : '—'}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wide">Total time</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-mono tabular-nums text-sm font-bold text-slate-800">
              {excessPaceSec != null ? (
                <>
                  {fmtPace(excessPaceSec)}
                  <span className="text-xs font-normal text-slate-400">/km</span>
                </>
              ) : (
                '—'
              )}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wide">Avg pace</span>
          </div>
        </div>
      </div>

      {/* Per-km pace from splits */}
      {splitPills && splitPills.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Pace per km
          </p>
          <div className="flex flex-wrap gap-1.5">
            {splitPills.map((pill) => (
              <span
                key={pill.label}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono font-medium border ${
                  pill.isExcess
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-violet-50 text-violet-700 border-violet-100'
                }`}
              >
                <span className="text-[10px] font-sans font-semibold opacity-60">{pill.label}</span>
                {pill.pace != null ? `${fmtPace(pill.pace)}/km` : '—'}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Difference row */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 px-3 py-3 bg-slate-50 rounded-lg">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide w-full">
          Difference
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="font-mono tabular-nums text-sm font-bold text-slate-800">
            +{fmtDistance(rawExcessDistM)} km
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wide">
            Extra dist (+{overPct}%)
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-mono tabular-nums text-sm font-bold text-slate-800">
            {excessTimeSec > 0 ? `+${fmtDuration(excessTimeSec)}` : '—'}
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wide">Extra time</span>
        </div>
        {paceDiffSec != null && (
          <div className="flex flex-col gap-0.5">
            {paceDiffSec === 0 ? (
              <span className="font-mono tabular-nums text-sm font-bold text-slate-400">—</span>
            ) : (
              <span
                className={`font-mono tabular-nums text-sm font-bold ${paceDiffSec > 0 ? 'text-amber-600' : 'text-green-600'}`}
              >
                {paceDiffSec > 0 ? '+' : '-'}
                {fmtPace(Math.abs(paceDiffSec))}/km
              </span>
            )}
            <span className="text-[10px] text-slate-400 uppercase tracking-wide">
              {paceDiffSec > 0 ? 'Slower pace' : paceDiffSec < 0 ? 'Faster pace' : 'Same pace'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
