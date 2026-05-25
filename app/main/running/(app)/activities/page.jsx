'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
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
  Thermometer,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { fetchActivities } from '@/lib/api/running'
import { fmtDistance, fmtPace, fmtDuration, fmtDate } from '../dashboard/utils/format'

const RouteMap = dynamic(() => import('./components/RouteMap'), { ssr: false })

// ─── activity config (matches dashboard) ─────────────────────────────────────

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

// ─── skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <Card className="border border-slate-200/70 shadow-sm">
      <CardContent className="p-4">
        <div className="flex gap-4 animate-pulse">
          <div className="w-40 shrink-0 rounded-lg bg-slate-100" style={{ height: 160 }} />
          <div className="flex-1 min-w-0 flex flex-col gap-2 py-1">
            <div className="h-4 bg-slate-100 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-1/3" />
            <div className="h-3 bg-slate-100 rounded w-2/3 mt-1" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── activity card ────────────────────────────────────────────────────────────

function ActivityCard({ activity: a }) {
  const cfg = getActivityCfg(a)
  const Icon = cfg.icon
  const wattsVal = a.device_watts === true ? (a.weighted_avg_watts ?? a.avg_watts) : null
  const cadenceSpm = a.avg_cadence != null ? a.avg_cadence * 2 : null
  const elevationM =
    a.elevation_gain_m && a.elevation_gain_m > 0 ? Math.round(a.elevation_gain_m) : null

  return (
    <Card className="border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <Link
          href={`/main/running/activities/${a.id}`}
          className="flex gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg"
        >
          {/* Map thumbnail */}
          <div className="w-40 shrink-0">
            {a.summary_polyline ? (
              <RouteMap encodedPolyline={a.summary_polyline} height={160} className="w-full" />
            ) : (
              <div
                className="w-full rounded-lg bg-slate-50 flex items-center justify-center text-xs text-slate-300"
                style={{ height: 160 }}
              >
                No GPS
              </div>
            )}
          </div>

          {/* Activity details */}
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
            {/* Name + PR badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-slate-800 truncate">
                {a.name || cfg.label || a.activity_type}
              </span>
              {a.pr_count > 0 && (
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 text-[10px] font-semibold shrink-0">
                  <Trophy className="size-3" aria-hidden="true" />
                  {a.pr_count} PR
                </span>
              )}
            </div>

            {/* Date + type chip */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400">{fmtDate(a.started_at)}</span>
              <span
                className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}
              >
                <Icon className="size-3" aria-hidden="true" />
                {cfg.label ?? a.activity_type}
              </span>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap mt-0.5">
              <span className="font-medium text-slate-700">{fmtDistance(a.distance_m)} km</span>
              <span className="text-slate-300">·</span>
              <span>{fmtPace(a.avg_pace_sec_per_km)}/km</span>
              <span className="text-slate-300">·</span>
              <span>{fmtDuration(a.moving_time_sec ?? a.duration_sec)}</span>
              {elevationM != null && (
                <>
                  <span className="text-slate-300">·</span>
                  <span>↑{elevationM}m</span>
                </>
              )}
              {a.avg_hr != null && (
                <>
                  <span className="text-slate-300">·</span>
                  <span>{a.avg_hr} bpm</span>
                </>
              )}
              {wattsVal != null && (
                <>
                  <span className="text-slate-300">·</span>
                  <span>{wattsVal} W</span>
                </>
              )}
              {a.avg_temp_c != null && (
                <>
                  <span className="text-slate-300">·</span>
                  <span className={tempColor(a.avg_temp_c)}>{a.avg_temp_c}°C</span>
                </>
              )}
            </div>

            {/* Gear */}
            {a.gear_name && (
              <div className="flex items-center gap-1 mt-0.5">
                <Footprints className="size-3 text-slate-400 shrink-0" aria-hidden="true" />
                <span className="text-xs text-slate-400">{a.gear_name}</span>
              </div>
            )}
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}

// ─── inner page (uses useSearchParams — must be inside Suspense) ──────────────

function ActivitiesInner() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || null

  const [activities, setActivities] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const LIMIT = 20
  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

  useEffect(() => {
    setPage(1)
  }, [type])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetchActivities({ page, limit: LIMIT, type })
        if (!cancelled) {
          setActivities(res.data ?? [])
          setTotal(res.total ?? 0)
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load activities')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [page, type])

  return (
    <div id="activitiesPage" className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Activities</h1>
          {!loading && total > 0 && (
            <p className="text-sm text-slate-400 mt-0.5" aria-live="polite">
              {total} {type ? `${type} ` : ''}activities
            </p>
          )}
        </div>
        {type && (
          <Link
            href="/main/running/activities"
            className="text-xs text-slate-500 hover:text-violet-600 transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="size-3.5" aria-hidden="true" />
            All types
          </Link>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div
          id="activitiesLoadingSkeleton"
          className="flex flex-col gap-4"
          aria-busy="true"
          aria-label="Loading activities"
        >
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          id="activitiesError"
          className="flex items-center justify-center py-16 text-sm text-red-400"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {/* Activity list */}
      {!loading && !error && activities.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-2 text-center">
          <p className="text-sm text-slate-400">No activities yet</p>
          <p className="text-xs text-slate-300">
            Sync with Strava or log a manual activity to get started
          </p>
        </div>
      )}

      {!loading && !error && activities.length > 0 && (
        <div id="activitiesList" className="grid grid-cols-1 gap-4">
          {activities.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between pt-2" aria-label="Pagination">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-violet-600 disabled:opacity-40 disabled:pointer-events-none transition-colors min-h-[44px] min-w-[44px]"
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            Prev
          </button>
          <span className="text-xs text-slate-400" aria-live="polite">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-violet-600 disabled:opacity-40 disabled:pointer-events-none transition-colors min-h-[44px] min-w-[44px]"
            aria-label="Next page"
          >
            Next
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}

// ─── page export ──────────────────────────────────────────────────────────────

export default function ActivitiesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-4">
          <div className="h-8 bg-slate-100 rounded w-40 animate-pulse" />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      }
    >
      <ActivitiesInner />
    </Suspense>
  )
}
