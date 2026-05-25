'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft,
  Trophy,
  Footprints,
  Bike,
  Waves,
  Mountain,
  Dumbbell,
  Zap,
  Timer,
  Map as MapIcon,
  Heart,
  Activity,
  PersonStanding,
  Wind,
  Flame,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { fetchActivity } from '@/lib/api/running'
import { fmtDistance, fmtPace, fmtDuration, fmtDate } from '../../dashboard/utils/format'

const RouteMap = dynamic(() => import('../components/RouteMap'), { ssr: false })

// ─── activity config ──────────────────────────────────────────────────────────

const ACTIVITY_CONFIG = {
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
  easy: { icon: Footprints, color: 'text-green-600', bg: 'bg-green-50', label: 'Easy' },
  tempo: { icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Tempo' },
  interval: { icon: Timer, color: 'text-red-600', bg: 'bg-red-50', label: 'Interval' },
  long: { icon: MapIcon, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Long Run' },
  race: { icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Race' },
  recovery: { icon: Heart, color: 'text-slate-500', bg: 'bg-slate-100', label: 'Recovery' },
}
const DEFAULT_CONFIG = { icon: Activity, color: 'text-slate-500', bg: 'bg-slate-100', label: null }
const WORKOUT_TYPE_KEY = { 1: 'race', 2: 'long', 3: 'interval' }

function getActivityCfg(activity) {
  const wtKey = activity.workout_type != null ? WORKOUT_TYPE_KEY[activity.workout_type] : null
  if (wtKey)
    return ACTIVITY_CONFIG[wtKey] ?? ACTIVITY_CONFIG[activity.activity_type] ?? DEFAULT_CONFIG
  return ACTIVITY_CONFIG[activity.activity_type] ?? DEFAULT_CONFIG
}

// ─── temperature color ────────────────────────────────────────────────────────

function tempColor(c) {
  if (c < 10) return 'text-blue-500'
  if (c < 20) return 'text-green-500'
  if (c < 28) return 'text-amber-500'
  return 'text-red-500'
}

// ─── stat tile ────────────────────────────────────────────────────────────────

function StatTile({ label, value, unit, sub }) {
  return (
    <div className="flex flex-col gap-0.5 p-3 bg-slate-50 rounded-lg">
      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold text-slate-800 leading-tight">{value ?? '—'}</span>
        {unit && <span className="text-xs text-slate-400">{unit}</span>}
      </div>
      {sub && <span className="text-[10px] text-slate-400">{sub}</span>}
    </div>
  )
}

// ─── skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="h-8 bg-slate-100 rounded w-20" />
      <div className="h-72 bg-slate-100 rounded-lg" />
      <div className="h-6 bg-slate-100 rounded w-2/3" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 bg-slate-100 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function ActivityDetailPage() {
  const { id } = useParams()
  const [activity, setActivity] = useState(null)
  const [gear, setGear] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetchActivity(id)
        if (!cancelled) {
          setActivity(res.activity)
          setGear(res.gear ?? null)
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load activity')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <div id="activityDetailPage" className="flex flex-col gap-5 max-w-2xl">
      {/* Back button */}
      <Link
        href="/main/running/activities"
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-violet-600 transition-colors w-fit min-h-[44px]"
        aria-label="Back to activities"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        Back
      </Link>

      {loading && <Skeleton />}

      {!loading && error && (
        <div
          className="flex items-center justify-center py-20 text-sm text-red-400"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        activity &&
        (() => {
          const cfg = getActivityCfg(activity)
          const Icon = cfg.icon
          const cadenceSpm = activity.avg_cadence != null ? activity.avg_cadence * 2 : null
          const wattsVal =
            activity.device_watts === true
              ? (activity.weighted_avg_watts ?? activity.avg_watts)
              : null
          const normWatts = activity.device_watts === true ? activity.weighted_avg_watts : null
          const gearDistKm = gear?.distance_m != null ? (gear.distance_m / 1000).toFixed(0) : null

          return (
            <>
              {/* Route map */}
              {activity.summary_polyline && (
                <RouteMap
                  encodedPolyline={activity.summary_polyline}
                  height={320}
                  className="w-full"
                />
              )}

              {/* Heading */}
              <div className="flex items-start gap-3 flex-wrap">
                <div className={`p-2 rounded-lg shrink-0 ${cfg.bg}`}>
                  <Icon className={`size-5 ${cfg.color}`} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-bold text-slate-800 leading-snug">
                      {activity.name || cfg.label || activity.activity_type}
                    </h1>
                    {activity.pr_count > 0 && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold shrink-0">
                        <Trophy className="size-3.5" aria-hidden="true" />
                        {activity.pr_count} PR
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-sm text-slate-400">{fmtDate(activity.started_at)}</span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}
                    >
                      {cfg.label ?? activity.activity_type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatTile label="Distance" value={fmtDistance(activity.distance_m)} unit="km" />
                <StatTile label="Pace" value={fmtPace(activity.avg_pace_sec_per_km)} unit="/km" />
                <StatTile
                  label="Duration"
                  value={fmtDuration(activity.moving_time_sec ?? activity.duration_sec)}
                />
                {activity.elevation_gain_m != null && activity.elevation_gain_m > 0 && (
                  <StatTile
                    label="Elevation"
                    value={`↑${Math.round(activity.elevation_gain_m)}`}
                    unit="m"
                  />
                )}
                {cadenceSpm != null && <StatTile label="Cadence" value={cadenceSpm} unit="spm" />}
                {activity.avg_hr != null && (
                  <StatTile
                    label="Avg HR"
                    value={activity.avg_hr}
                    unit="bpm"
                    sub={activity.max_hr ? `Max ${activity.max_hr} bpm` : undefined}
                  />
                )}
              </div>

              {/* Secondary stats */}
              {(wattsVal != null || activity.avg_temp_c != null || activity.calories != null) && (
                <div className="flex flex-wrap items-center gap-3">
                  {wattsVal != null && (
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-violet-50 rounded-lg text-sm text-violet-700 font-medium">
                      <Zap className="size-4 text-violet-500" aria-hidden="true" />
                      <span>{wattsVal} W</span>
                      {normWatts != null && normWatts !== wattsVal && (
                        <span className="text-xs text-violet-400">({normWatts} norm)</span>
                      )}
                    </div>
                  )}
                  {activity.avg_temp_c != null && (
                    <div
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-slate-50 ${tempColor(activity.avg_temp_c)}`}
                    >
                      <span>{activity.avg_temp_c}°C</span>
                    </div>
                  )}
                  {activity.calories != null && (
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 rounded-lg text-sm text-orange-600 font-medium">
                      <Flame className="size-4 text-orange-400" aria-hidden="true" />
                      <span>{activity.calories} kcal</span>
                    </div>
                  )}
                </div>
              )}

              {/* Gear */}
              {(gear?.name || activity.gear_name) && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-lg">
                  <Footprints className="size-4 text-slate-400 shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <span className="text-sm text-slate-700 font-medium">
                      {gear?.name ?? activity.gear_name}
                    </span>
                    {gearDistKm && (
                      <span className="text-xs text-slate-400 ml-2">
                        {gearDistKm} km on this pair
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )
        })()}
    </div>
  )
}
