'use client'

import { Activity } from 'lucide-react'

const ZONES = [
  { label: 'Z1 Recovery', color: '#6b7280' },
  { label: 'Z2 Aerobic', color: '#3b82f6' },
  { label: 'Z3 Tempo', color: '#f59e0b' },
  { label: 'Z4 Threshold', color: '#f97316' },
  { label: 'Z5 VO2max', color: '#ef4444' },
]

function formatZoneDuration(seconds) {
  if (!seconds || seconds <= 0) return '0s'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
  if (m > 0) return `${m}m ${String(s).padStart(2, '0')}s`
  return `${s}s`
}

function formatHrRange(zone, index, total) {
  if (index === 0) return `< ${zone.max} bpm`
  if (index === total - 1) return `> ${zone.min} bpm`
  return `${zone.min}–${zone.max} bpm`
}

export default function HrZonesChart({ zones }) {
  const hrZones = zones?.heart_rate?.zones

  return (
    <div id="hrZonesSection_activityDetailPage">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-4 w-4 text-slate-400" aria-hidden="true" />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          HR Zones
        </span>
      </div>

      {!hrZones || hrZones.length === 0 ? (
        <p
          id="hrZonesEmpty_activityDetailPage"
          className="text-sm text-muted-foreground text-slate-400"
        >
          Zone data not available
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {(() => {
            const totalTime = hrZones.reduce((sum, z) => sum + (z.time ?? 0), 0)
            return hrZones.map((zone, i) => {
              const pct = totalTime > 0 ? Math.round((zone.time / totalTime) * 100) : 0
              const zoneConfig = ZONES[i] ?? { label: `Z${i + 1}`, color: '#94a3b8' }
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-28 shrink-0">
                    <p className="text-xs font-medium text-slate-600">{zoneConfig.label}</p>
                    <p className="text-[10px] text-slate-400">
                      {formatHrRange(zone, i, hrZones.length)}
                    </p>
                  </div>
                  <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: zoneConfig.color }}
                    />
                  </div>
                  <div className="w-28 shrink-0 text-right">
                    <span className="text-xs text-slate-600 tabular-nums">
                      {pct}% • {formatZoneDuration(zone.time)}
                    </span>
                  </div>
                </div>
              )
            })
          })()}
        </div>
      )}
    </div>
  )
}
