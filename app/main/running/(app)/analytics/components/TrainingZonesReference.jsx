'use client'

import { MapPin } from 'lucide-react'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'

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
  if (!maxFmt) return <span>&gt; {minFmt} /km</span>
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
    <section
      id="trainingZonesReference_analyticsPage"
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
          <MapPin className="size-4 text-violet-600" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">Training Zones Reference</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Your target HR and pace ranges per zone, derived from your profile settings.
          </p>
        </div>
      </div>

      <div className="px-5 py-4">
        {loading && (
          <div className="flex flex-col gap-3" aria-label="Loading data">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center gap-3">
            <p className="text-sm text-red-600">{error}</p>
            {onRetry && (
              <Button
                onClick={onRetry}
                className="text-xs text-violet-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded shrink-0"
              >
                Retry
              </Button>
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
                <table
                  id="trainingZonesTable_analyticsPage"
                  className="min-w-full text-sm"
                  aria-label="Training zones reference"
                >
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap w-24">
                        Zone
                      </th>
                      {data.hr_configured && (
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                          HR Range
                        </th>
                      )}
                      {data.pace_configured && (
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                          Pace Range
                        </th>
                      )}
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap hidden sm:table-cell">
                        Guidance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.zones?.map((z, i) => (
                      <tr
                        key={z.zone}
                        className="border-b border-slate-50 hover:bg-slate-50 transition-colors align-top"
                      >
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${ZONE_COLORS[i]}`}
                          >
                            {z.zone}
                            <span className="font-normal">{z.name}</span>
                          </span>
                        </td>
                        {data.hr_configured && (
                          <td className="px-5 py-3.5 font-mono text-slate-700 whitespace-nowrap">
                            {z.hr ? (
                              <HrRange min={z.hr.min} max={z.hr.max} />
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        )}
                        {data.pace_configured && (
                          <td className="px-5 py-3.5 font-mono text-slate-700 whitespace-nowrap">
                            {z.pace ? (
                              <PaceRange min={z.pace.min} max={z.pace.max} />
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        )}
                        <td className="px-5 py-3.5 text-slate-500 text-xs leading-relaxed hidden sm:table-cell">
                          {z.guidance}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {(!data.hr_configured || !data.pace_configured) && (
                  <p className="mt-3 px-5 text-xs text-slate-400">
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
      </div>
    </section>
  )
}
