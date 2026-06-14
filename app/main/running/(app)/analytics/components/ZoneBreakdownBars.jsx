'use client'

function fmtZoneTime(sec) {
  if (!sec || sec <= 0) return '—'
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m`
  return `${sec}s`
}

function fmtDistKm(m) {
  if (!m || m <= 0) return '—'
  return `${(m / 1000).toFixed(1)} km`
}

export default function ZoneBreakdownBars({ zones, colors }) {
  if (!zones?.length) return null

  const hasAnyData = zones.some((z) => z.time_sec > 0)

  return (
    <div className="flex flex-col gap-2">
      {zones.map((zone, i) => {
        const color = Array.isArray(colors) ? colors[i] : colors
        const pct = zone.pct_time ?? 0
        const hasData = zone.time_sec > 0

        return (
          <div key={zone.label} className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600 w-28 shrink-0 truncate">
                {zone.label}
              </span>
              {hasData ? (
                <span className="text-slate-400 tabular-nums">
                  {fmtZoneTime(zone.time_sec)} · {fmtDistKm(zone.distance_m)} · {pct}%
                </span>
              ) : (
                <span className="text-slate-300 text-xs">no data</span>
              )}
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              {hasAnyData && pct > 0 && (
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
