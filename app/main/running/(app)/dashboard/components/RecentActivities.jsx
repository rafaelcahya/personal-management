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
  MapPin,
  Gauge,
  Clock,
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
      <Card className="border border-slate-200/70 shadow-sm overflow-hidden">
        <CardContent className="px-5 py-5 pb-0">
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-violet-500 shrink-0" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-slate-700">Recent Activities</h3>
            </div>
            <p className="text-xs text-slate-400">Your 5 most recent logged activities.</p>
          </div>
        </CardContent>
        {shown.length === 0 ? (
          <CardContent className="py-10 text-center">
            <p className="text-slate-400 text-sm">No activities yet</p>
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
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 ${idx !== 0 ? 'border-t border-slate-100' : ''}`}
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
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3 text-slate-400" aria-hidden="true" />
                          {fmtDistance(a.distance_m)} km
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="flex items-center gap-1">
                          <Gauge className="size-3 text-slate-400" aria-hidden="true" />
                          {fmtPace(a.avg_pace_sec_per_km)} /km
                        </span>
                        {a.avg_hr != null && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="flex items-center gap-1">
                              <Heart className="size-3 text-slate-400" aria-hidden="true" />
                              {a.avg_hr} bpm
                            </span>
                          </>
                        )}
                        <span className="text-slate-300">·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3 text-slate-400" aria-hidden="true" />
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
