'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Footprints, Clock, Mountain, Star } from 'lucide-react'

function formatDistance(m) {
  if (!m) return '—'
  return `${(m / 1000).toFixed(2)} km`
}

function formatDuration(sec) {
  if (!sec) return '—'
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  if (h === 0) return `${m}m`
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function formatElevation(m) {
  if (!m) return '—'
  return `${Math.round(m)} m`
}

function StatItem({ icon: Icon, iconClass, label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Icon className={`size-3.5 shrink-0 ${iconClass}`} aria-hidden="true" />
        {label}
      </div>
      <span className="text-sm font-semibold text-slate-800 tabular-nums">{value}</span>
    </div>
  )
}

export default function YtdStats({ ytd_stats }) {
  if (!ytd_stats || ytd_stats.distance_m === 0) return null

  const { count, distance_m, moving_time_sec, elevation_gain_m, achievement_count } = ytd_stats

  return (
    <section id="ytdStatsCard" aria-label="Year to date stats" className="flex flex-col h-full">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Year to Date
      </h2>
      <Card className="border border-slate-200/70 shadow-sm py-0 flex-1">
        <CardContent className="px-5 py-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4">
            <StatItem
              icon={Footprints}
              iconClass="text-violet-400"
              label="Total runs"
              value={count ?? '—'}
            />
            <StatItem
              icon={Trophy}
              iconClass="text-amber-400"
              label="Total distance"
              value={formatDistance(distance_m)}
            />
            <StatItem
              icon={Clock}
              iconClass="text-blue-400"
              label="Moving time"
              value={formatDuration(moving_time_sec)}
            />
            <StatItem
              icon={Mountain}
              iconClass="text-green-500"
              label="Elevation"
              value={formatElevation(elevation_gain_m)}
            />
          </div>
          {achievement_count > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 border-t border-slate-100 mt-4 pt-3">
              <Star className="size-3.5 text-amber-400 shrink-0" aria-hidden="true" />
              <span>
                <span className="font-medium text-slate-600">{achievement_count}</span>{' '}
                {achievement_count === 1 ? 'achievement' : 'achievements'} earned this year
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
