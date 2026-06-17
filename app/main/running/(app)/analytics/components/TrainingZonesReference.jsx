'use client'

import { MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const ZONE_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-yellow-100 text-yellow-700',
  'bg-orange-100 text-orange-700',
  'bg-red-100 text-red-700',
]

function formatPaceSec(sec) {
  if (sec == null || sec <= 0 || sec >= 9999) return null
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function PaceRange({ min, max }) {
  const minFmt = formatPaceSec(min)
  const maxFmt = formatPaceSec(max)

  if (!minFmt && !maxFmt) return <span className="text-slate-400">—</span>
  // Z1: min is real, max is 9999 → "slower than X"
  if (!maxFmt) return <span>&gt; {minFmt} /km</span>
  // Z5: min is 0 → "faster than X"
  if (!minFmt || min === 0) return <span>&lt; {maxFmt} /km</span>
  return (
    <span>
      {maxFmt} – {minFmt} /km
    </span>
  )
}

function HrRange({ min, max }) {
  if (min == null && max == null) return <span className="text-slate-400">—</span>
  if (max == null || max >= 9999) return <span>&gt; {min} bpm</span>
  return (
    <span>
      {min} – {max} bpm
    </span>
  )
}

export default function TrainingZonesReference({ data, loading, error, onRetry }) {
  return (
    <Card
      id="trainingZonesReference_analyticsPage"
      className="border border-slate-200/70 shadow-sm py-0 col-span-full"
    >
      <CardContent className="px-5 py-5">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="size-4 text-violet-500 shrink-0" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-slate-700">Training Zones Reference</h3>
        </div>

        {loading && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center gap-3">
            <p className="text-sm text-red-600">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-xs text-violet-600 hover:underline shrink-0"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {!loading && !error && data && (
          <>
            {!data.hr_configured && !data.pace_configured && (
              <p id="zoneReferenceNoConfig_analyticsPage" className="text-sm text-slate-400">
                Configure your HR zones and threshold pace in Settings to see zone targets.
              </p>
            )}

            {(data.hr_configured || data.pace_configured) && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-400 border-b border-slate-100">
                      <th className="text-left pb-2 font-medium w-24">Zone</th>
                      {data.hr_configured && (
                        <th className="text-left pb-2 font-medium">HR Range</th>
                      )}
                      {data.pace_configured && (
                        <th className="text-left pb-2 font-medium">Pace Range</th>
                      )}
                      <th className="text-left pb-2 font-medium hidden sm:table-cell">Guidance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data.zones?.map((z, i) => (
                      <tr key={z.zone} className="align-top">
                        <td className="py-2.5 pr-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${ZONE_COLORS[i]}`}
                          >
                            {z.zone}
                            <span className="font-normal">{z.name}</span>
                          </span>
                        </td>
                        {data.hr_configured && (
                          <td className="py-2.5 pr-4 text-slate-600 tabular-nums whitespace-nowrap">
                            {z.hr ? (
                              <HrRange min={z.hr.min} max={z.hr.max} />
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        )}
                        {data.pace_configured && (
                          <td className="py-2.5 pr-4 text-slate-600 tabular-nums whitespace-nowrap">
                            {z.pace ? (
                              <PaceRange min={z.pace.min} max={z.pace.max} />
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        )}
                        <td className="py-2.5 text-slate-400 text-xs leading-relaxed hidden sm:table-cell">
                          {z.guidance}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {(!data.hr_configured || !data.pace_configured) && (
                  <p className="mt-3 text-xs text-slate-400">
                    {!data.hr_configured && !data.pace_configured
                      ? null
                      : !data.hr_configured
                        ? 'HR range not shown — configure HR zones in Settings.'
                        : 'Pace range not shown — set threshold pace in Settings.'}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
