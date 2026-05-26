'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Flag, Calendar, Timer } from 'lucide-react'

function formatRaceDistance(m) {
  if (!m) return '?'
  const km = m / 1000
  if (km === 42.195) return 'Marathon'
  if (km === 21.0975) return 'Half Marathon'
  if (km === 10) return '10K'
  if (km === 5) return '5K'
  return `${km % 1 === 0 ? km : km.toFixed(1)} km`
}

function formatTargetDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function UrgencyBadge({ days_until }) {
  if (days_until == null) return null
  if (days_until <= 7) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
        Race week!
      </span>
    )
  }
  if (days_until <= 30) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
        {days_until} days
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
      {days_until} days
    </span>
  )
}

export default function NextRace({ next_race_goal }) {
  if (!next_race_goal) {
    return (
      <section id="nextRaceCard" aria-label="Next race goal" className="flex flex-col h-full">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Next Race
        </h2>
        <Card className="border border-slate-200/70 shadow-sm py-0 flex-1">
          <CardContent className="px-5 py-8 flex flex-col items-center gap-3 text-center">
            <div className="flex items-center justify-center size-10 rounded-full bg-violet-50">
              <Flag className="size-5 text-violet-400" aria-hidden="true" />
            </div>
            <p className="text-sm text-slate-500">No race goal set</p>
            <Link
              href="/main/running/race-log"
              className="text-xs font-medium text-violet-600 hover:text-violet-700 hover:underline transition-colors"
            >
              Add your first race →
            </Link>
          </CardContent>
        </Card>
      </section>
    )
  }

  const { distance_m, target_date, days_until, title, description } = next_race_goal

  return (
    <section id="nextRaceCard" aria-label="Next race goal" className="flex flex-col h-full">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Next Race
      </h2>
      <Card className="border border-slate-200/70 shadow-sm py-0 flex-1">
        <CardContent className="px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-9 rounded-full bg-violet-50 shrink-0">
                <Flag className="size-4 text-violet-500" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-base font-semibold text-slate-800">
                  {title || formatRaceDistance(distance_m)}
                </span>
                {title && (
                  <span className="text-xs font-medium text-violet-600">
                    {formatRaceDistance(distance_m)}
                  </span>
                )}
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="size-3 shrink-0" aria-hidden="true" />
                  <span>{formatTargetDate(target_date)}</span>
                </div>
                {description && (
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{description}</p>
                )}
              </div>
            </div>
            <UrgencyBadge days_until={days_until} />
          </div>

          {days_until != null && days_until <= 90 && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Timer className="size-3 shrink-0" aria-hidden="true" />
                <span>
                  {days_until <= 0
                    ? 'Race day is today — good luck!'
                    : `${days_until} ${days_until === 1 ? 'day' : 'days'} to prepare`}
                </span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-violet-400 transition-all"
                  style={{ width: `${Math.max(0, Math.min(100, 100 - (days_until / 90) * 100))}%` }}
                  aria-hidden="true"
                />
              </div>
            </div>
          )}
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
            <Link
              href="/main/running/race-log"
              className="text-xs font-medium text-violet-600 hover:text-violet-700 hover:underline transition-colors"
            >
              View all races →
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
