'use client'

import Link from 'next/link'
import { ArrowRight, Trophy, Footprints, Heart, MapPin, Gauge, Clock } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { fmtDistance, fmtDuration, fmtPace, fmtDate } from '../utils/format'
import { getCfg, getActivityCfg, toLocalDateStr, fmtElevation } from '../utils/activityDisplay'

function tempColor(c) {
  if (c < 10) return 'text-blue-500'
  if (c < 20) return 'text-green-500'
  if (c < 28) return 'text-amber-500'
  return 'text-red-500'
}

const SEP = <span className="text-slate-300">·</span>

export default function RecentColumn({ activities, activityType, selectedDate, onSelectDate }) {
  const shown = (activities ?? []).slice(0, 5)
  const seeAllHref = activityType
    ? `/main/running/activities?type=${encodeURIComponent(activityType)}`
    : '/main/running/activities'

  return (
    <div className="flex flex-col min-w-0 h-full">
      <p className="text-sm font-semibold text-slate-700 mb-3">Recent</p>

      {shown.length === 0 ? (
        <p
          id="recentActivitiesEmpty_dashboardPage"
          className="py-6 text-center text-sm text-slate-400 flex-1"
        >
          {activityType
            ? `No ${getCfg(activityType).label ?? activityType} activities`
            : 'No activities yet'}
        </p>
      ) : (
        <ul className="flex-1 -mx-5 divide-y divide-slate-100">
          {shown.map((a) => {
            const cfg = getActivityCfg(a)
            const Icon = cfg.icon
            const dateStr = toLocalDateStr(a.started_at)
            const isActive = dateStr === selectedDate
            const elevation = fmtElevation(a.elevation_gain_m)
            const hasPR = a.pr_count > 0

            return (
              <li key={a.id}>
                <Button
                  id={`recentActivityBtn_${a.id}_dashboardPage`}
                  variant="ghost"
                  fullWidth
                  onClick={() => onSelectDate(isActive ? null : dateStr)}
                  className={`items-center gap-3 px-5 py-3 h-auto text-left ${isActive ? 'bg-blue-50' : ''}`}
                  aria-pressed={isActive}
                >
                  <div className={`p-1.5 rounded-md shrink-0 ${cfg.bg}`}>
                    <Icon className={`size-3.5 ${cfg.color}`} aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-medium text-slate-700 truncate">
                        {a.name || cfg.label || a.activity_type}
                      </span>
                      {hasPR && (
                        <span className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-amber-50 text-amber-600 text-xs font-semibold shrink-0">
                          <Trophy className="size-2.5" aria-hidden="true" />
                          PR
                        </span>
                      )}
                      {SEP}
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {fmtDate(a.started_at)}
                      </span>
                      {SEP}
                      <span
                        className={`text-xs font-medium px-1.5 py-0.5 rounded-full shrink-0 ${cfg.bg} ${cfg.color}`}
                      >
                        {cfg.label ?? a.activity_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="size-3 text-slate-400 shrink-0" aria-hidden="true" />
                        {fmtDistance(a.distance_m)} km
                      </span>
                      {SEP}
                      <span className="flex items-center gap-1">
                        <Gauge className="size-3 text-slate-400 shrink-0" aria-hidden="true" />
                        {fmtPace(a.avg_pace_sec_per_km)} /km
                      </span>
                      {SEP}
                      <span className="flex items-center gap-1">
                        <Clock className="size-3 text-slate-400 shrink-0" aria-hidden="true" />
                        {fmtDuration(a.duration_sec)}
                      </span>
                      {a.avg_hr != null && (
                        <>
                          {SEP}
                          <span className="flex items-center gap-1">
                            <Heart className="size-3 text-slate-400 shrink-0" aria-hidden="true" />
                            {a.avg_hr} bpm
                          </span>
                        </>
                      )}
                      {elevation && (
                        <>
                          {SEP}
                          <span>{elevation}</span>
                        </>
                      )}
                      {a.device_watts === true &&
                        (a.weighted_avg_watts != null || a.avg_watts != null) && (
                          <>
                            {SEP}
                            <span>{a.weighted_avg_watts ?? a.avg_watts} W</span>
                          </>
                        )}
                      {a.avg_temp_c != null && (
                        <>
                          {SEP}
                          <span className={tempColor(a.avg_temp_c)}>{a.avg_temp_c}°C</span>
                        </>
                      )}
                    </div>
                    {a.gear_name && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Footprints
                          className="size-2.5 text-slate-400 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="text-xs text-slate-400">{a.gear_name}</span>
                      </div>
                    )}
                  </div>
                </Button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="mt-auto pt-3 border-t border-slate-100">
        <Link
          id="seeAllActivitiesLink_dashboardPage"
          href={seeAllHref}
          className="flex items-center justify-between w-full px-1 py-1 max-sm:min-h-11 text-xs text-slate-500 hover:text-violet-600 transition-colors group"
        >
          <span>See all activities</span>
          <ArrowRight
            className="size-3.5 group-hover:translate-x-0.5 transition-transform"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  )
}
