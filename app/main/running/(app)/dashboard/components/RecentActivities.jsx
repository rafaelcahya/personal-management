'use client'

import Link from 'next/link'
import {
  Footprints,
  Bike,
  Waves,
  Mountain,
  Dumbbell,
  Zap,
  Timer,
  Map,
  Trophy,
  Heart,
  Activity,
  PersonStanding,
  Wind,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { fmtDistance, fmtDuration, fmtPace, fmtDate } from '../utils/format'

const ACTIVITY_CONFIG = {
  // Strava sport_type values
  Run: { icon: Footprints, color: 'text-violet-600', bg: 'bg-violet-50', label: 'Run' },
  TrailRun: { icon: Mountain, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Trail Run' },
  VirtualRun: {
    icon: Footprints,
    color: 'text-violet-400',
    bg: 'bg-violet-50',
    label: 'Virtual Run',
  },
  Walk: { icon: PersonStanding, color: 'text-green-600', bg: 'bg-green-50', label: 'Walk' },
  Hike: { icon: Mountain, color: 'text-amber-700', bg: 'bg-amber-50', label: 'Hike' },
  Ride: { icon: Bike, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Ride' },
  VirtualRide: { icon: Bike, color: 'text-blue-400', bg: 'bg-blue-50', label: 'Virtual Ride' },
  MountainBikeRide: { icon: Bike, color: 'text-orange-600', bg: 'bg-orange-50', label: 'MTB' },
  GravelRide: { icon: Bike, color: 'text-stone-600', bg: 'bg-stone-50', label: 'Gravel' },
  Swim: { icon: Waves, color: 'text-cyan-600', bg: 'bg-cyan-50', label: 'Swim' },
  WeightTraining: { icon: Dumbbell, color: 'text-slate-600', bg: 'bg-slate-100', label: 'Weights' },
  Yoga: { icon: Wind, color: 'text-teal-600', bg: 'bg-teal-50', label: 'Yoga' },
  // Manual types
  easy: { icon: Footprints, color: 'text-green-600', bg: 'bg-green-50', label: 'Easy' },
  tempo: { icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Tempo' },
  interval: { icon: Timer, color: 'text-red-600', bg: 'bg-red-50', label: 'Interval' },
  long: { icon: Map, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Long' },
  race: { icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Race' },
  recovery: { icon: Heart, color: 'text-slate-500', bg: 'bg-slate-100', label: 'Recovery' },
}

const DEFAULT_CONFIG = { icon: Activity, color: 'text-slate-500', bg: 'bg-slate-100', label: null }

function getConfig(type) {
  return ACTIVITY_CONFIG[type] ?? DEFAULT_CONFIG
}

export default function RecentActivities({ activities }) {
  const shown = activities.slice(0, 5)

  return (
    <section id="recentActivitiesCard" aria-label="Recent activities">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Recent Activities
      </h2>

      <Card className="border border-slate-200/70 shadow-sm overflow-hidden">
        {shown.length === 0 ? (
          <CardContent className="py-10 text-center">
            <p className="text-slate-400 text-sm">
              {activeType
                ? `No ${getConfig(activeType).label ?? activeType} activities`
                : 'No activities yet'}
            </p>
          </CardContent>
        ) : (
          <ul>
            {shown.map((a, idx) => {
              const cfg = getConfig(a.activity_type)
              const Icon = cfg.icon
              return (
                <li key={a.id}>
                  <Link
                    href="/main/running/activities"
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${idx !== 0 ? 'border-t border-slate-100' : ''}`}
                    aria-label={`${cfg.label ?? a.activity_type} on ${fmtDate(a.started_at)}, ${fmtDistance(a.distance_m)} km`}
                  >
                    <div className={`p-1.5 rounded-md shrink-0 ${cfg.bg}`}>
                      <Icon className={`size-3.5 ${cfg.color}`} aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <span className="text-xs text-slate-400 shrink-0">
                        {fmtDate(a.started_at)}
                      </span>
                      <span className={`text-xs font-medium shrink-0 ${cfg.color}`}>
                        {cfg.label ?? a.activity_type}
                      </span>
                      <div className="flex items-center gap-3 text-sm text-slate-800">
                        <span>{fmtDistance(a.distance_m)} km</span>
                        <span className="text-slate-300">·</span>
                        <span>{fmtPace(a.avg_pace_sec_per_km)} /km</span>
                        {a.avg_hr != null && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span>{a.avg_hr} bpm</span>
                          </>
                        )}
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-500 text-xs">
                          {fmtDuration(a.duration_sec)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </Card>
    </section>
  )
}
