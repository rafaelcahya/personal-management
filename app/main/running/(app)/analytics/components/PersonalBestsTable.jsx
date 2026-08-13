'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Trophy } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import { fetchPersonalBests } from '@/lib/api/running'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/base/Accordion/Accordion'

const DISTANCES = ['1K', '1 mile', '5K', '5 mile', '10K', '15K', 'Half-Marathon']

const DISTANCE_SLUGS = {
  '1K': '1k',
  '1 mile': '1mile',
  '5K': '5k',
  '5 mile': '5mile',
  '10K': '10k',
  '15K': '15k',
  'Half-Marathon': 'halfMarathon',
}

function distanceSlug(distance) {
  return DISTANCE_SLUGS[distance] ?? distance.replace(/\s+/g, '-')
}

function formatTime(sec) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatPace(paceSec) {
  if (paceSec == null) return '—'
  const m = Math.floor(paceSec / 60)
  const s = paceSec % 60
  return `${m}:${String(s).padStart(2, '0')} /km`
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const COLS = 'grid grid-cols-[2fr_1fr_1fr_1fr]'

function DistanceRow({ distance, entries, onRowClick }) {
  const slug = distanceSlug(distance)
  const best = entries?.[0]

  return (
    <div id={`personalBestsAccordionItem_${slug}_analyticsPage`}>
      <AccordionItem value={distance}>
        <AccordionTrigger
          id={`personalBestsAccordionTrigger_${slug}_analyticsPage`}
          className="px-4 py-3"
        >
          <div className={`${COLS} flex-1 pr-2`}>
            <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">
              {distance}
            </span>
            <span className="text-sm text-slate-700 whitespace-nowrap">
              {best ? formatTime(best.elapsed_time_sec) : '—'}
            </span>
            <span className="text-sm text-slate-500 whitespace-nowrap">
              {best ? formatPace(best.pace_sec_per_km) : '—'}
            </span>
            <span className="text-xs text-slate-400 whitespace-nowrap">
              {best ? formatDate(best.date) : '—'}
            </span>
          </div>
        </AccordionTrigger>

        <AccordionContent
          id={`personalBestsAccordionContent_${slug}_analyticsPage`}
          className="pb-0"
        >
          {!entries || entries.length === 0 ? (
            <p className="text-sm text-slate-400 px-4 pb-3">No efforts recorded yet.</p>
          ) : (
            <div className="border-t border-slate-100">
              {entries.map((entry) => {
                const isPR = entry.rank === 1
                return (
                  <button
                    key={entry.rank}
                    id={`personalBestsRow_${slug}_${entry.rank}_analyticsPage`}
                    type="button"
                    onClick={() => entry.activity_id && onRowClick(entry.activity_id)}
                    className={`flex w-full items-center text-left px-4 py-2.5 border-b border-slate-50 last:border-b-0 transition-colors hover:bg-slate-50 ${
                      isPR ? 'bg-amber-50 hover:bg-amber-100' : ''
                    }`}
                  >
                    <div className={`${COLS} flex-1 pr-2`}>
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        {isPR && <Trophy size={12} className="text-amber-500 shrink-0" />}
                        <span
                          className={`text-xs font-medium ${isPR ? 'text-amber-600' : 'text-slate-400'}`}
                        >
                          #{entry.rank}
                        </span>
                      </span>
                      <span
                        className={`text-sm font-semibold whitespace-nowrap ${isPR ? 'text-amber-700' : 'text-slate-700'}`}
                      >
                        {formatTime(entry.elapsed_time_sec)}
                      </span>
                      <span className="text-sm text-slate-500 whitespace-nowrap">
                        {formatPace(entry.pace_sec_per_km)}
                      </span>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {formatDate(entry.date)}
                      </span>
                    </div>
                    <div className="size-4 shrink-0" aria-hidden="true" />
                  </button>
                )
              })}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </div>
  )
}

export default function PersonalBestsTable() {
  const router = useRouter()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    let cancelled = false
    fetchPersonalBests()
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load personal bests')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(load, [load])

  if (loading) {
    return (
      <div
        id="personalBestsLoading_analyticsPage"
        className="flex flex-col gap-2"
        aria-label="Loading personal bests"
      >
        {DISTANCES.map((d) => (
          <Skeleton key={d} className="h-11 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div
        id="personalBestsError_analyticsPage"
        className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-4"
        role="alert"
      >
        <p className="text-sm text-red-700 flex-1">{error}</p>
        <Button
          variant="ghost"
          onClick={load}
          className="text-xs text-violet-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded shrink-0"
        >
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div
      id="personalBestsTable_analyticsPage"
      className="rounded-xl border border-slate-200 bg-white overflow-hidden"
    >
      <div className="overflow-x-auto">
        <div className="min-w-[520px]">
          {/* Column header — mirrors trigger layout (flex-1 grid + chevron spacer) */}
          <div className="flex items-center px-4 py-2 border-b border-slate-100 bg-slate-50">
            <div className={`${COLS} flex-1 pr-2`}>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Distance
              </span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Best Time
              </span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Pace
              </span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Date
              </span>
            </div>
            <div className="size-4 shrink-0" aria-hidden="true" />
          </div>

          <Accordion type="multiple">
            {DISTANCES.map((distance) => (
              <DistanceRow
                key={distance}
                distance={distance}
                entries={data?.[distance] ?? []}
                onRowClick={(activityId) => router.push(`/main/running/activities/${activityId}`)}
              />
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  )
}
