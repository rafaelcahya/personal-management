'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
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
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Search,
  X,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { fetchActivities } from '@/lib/api/running'
import { fmtDistance, fmtPace, fmtDuration } from '../dashboard/utils/format'
import PageHeader from '@/app/main/components/PageHeader'

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

// ─── helpers ──────────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear()

function fmtShortDate(iso) {
  const d = new Date(iso)
  const str = format(d, 'd MMM')
  return d.getFullYear() !== CURRENT_YEAR ? `${str} ${d.getFullYear()}` : str
}

function getRangeFrom(range) {
  if (range === '30d') return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  if (range === '90d') return new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  if (range === 'ytd') return new Date(new Date().getFullYear(), 0, 1).toISOString()
  return null
}

function buildUrl(searchParams, overrides) {
  const p = new URLSearchParams(searchParams.toString())
  Object.entries(overrides).forEach(([k, v]) => {
    if (v == null || v === '' || v === 'all') p.delete(k)
    else p.set(k, String(v))
  })
  p.delete('page')
  if (overrides.page != null) p.set('page', String(overrides.page))
  return `/main/running/activities?${p.toString()}`
}

const NULL_CELL = <span className="text-slate-400">—</span>

// ─── workout badge ─────────────────────────────────────────────────────────────

const WORKOUT_BADGE = {
  1: (
    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-violet-100 text-violet-700 shrink-0">
      Race
    </span>
  ),
  2: (
    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600 shrink-0">
      Long
    </span>
  ),
  3: (
    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-600 shrink-0">
      Interval
    </span>
  ),
}

// ─── skeleton row ──────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <TableRow className="animate-pulse">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-slate-100 shrink-0" />
          <div className="flex flex-col gap-1.5">
            <div className="h-3 w-36 bg-slate-100 rounded" />
            <div className="h-2.5 w-20 bg-slate-100 rounded" />
          </div>
        </div>
      </TableCell>
      {[60, 56, 48, 52, 40, 44].map((w, i) => (
        <TableCell key={i}>
          <div className="h-3 bg-slate-100 rounded ml-auto" style={{ width: w }} />
        </TableCell>
      ))}
    </TableRow>
  )
}

// ─── type chip ────────────────────────────────────────────────────────────────

function TypeChip({ type, label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border whitespace-nowrap transition-colors ${
        active
          ? 'border-violet-300 bg-violet-100 text-violet-700'
          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-400'
      }`}
    >
      {Icon && <Icon className="size-3" aria-hidden="true" />}
      {label}
    </button>
  )
}

// ─── inner page ───────────────────────────────────────────────────────────────

function ActivitiesInner() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const type = searchParams.get('type') || null
  const range = searchParams.get('range') || 'all'
  const sort = searchParams.get('sort') || 'newest'
  const page = parseInt(searchParams.get('page') ?? '1', 10) || 1

  const [activities, setActivities] = useState([])
  const [total, setTotal] = useState(0)
  const [knownTypes, setKnownTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const debounceRef = useRef(null)

  const LIMIT = 20
  const totalPages = Math.max(1, Math.ceil(total / LIMIT))
  const hasFilters = type || range !== 'all' || sort !== 'newest'

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearch(searchInput.trim())
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [searchInput])

  useEffect(() => {
    setKnownTypes([])
  }, [type, range, sort, search])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetchActivities({
          page,
          limit: LIMIT,
          type,
          from: getRangeFrom(range),
          sort,
          search: search || null,
        })
        if (!cancelled) {
          setActivities(res.data ?? [])
          setTotal(res.total ?? 0)
          setKnownTypes((prev) => {
            const all = new Set(prev)
            ;(res.data ?? []).forEach((a) => {
              if (a.activity_type) all.add(a.activity_type)
            })
            return [...all]
          })
        }
      } catch (err) {
        if (!cancelled) {
          if (err.message === 'UNAUTHORIZED') {
            window.location.href = '/login'
            return
          }
          setError(err.message || 'Failed to load activities')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [page, type, range, sort, search])

  function clearFilters() {
    router.push('/main/running/activities')
  }

  return (
    <div id="activitiesPage" className="flex flex-col gap-3 sm:gap-5">
      <PageHeader
        title="Activities"
        description="All your recorded workouts in one place"
        breadcrumbs={[
          { label: 'Running', href: '/main/running/dashboard' },
          { label: 'Activities' },
        ]}
      />

      <div className="border border-slate-200/50 shadow-slate-100 rounded-xl bg-white flex flex-col">
        {/* Filter bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-3 sm:px-5 py-2 sm:py-2.5">
          {/* Search input */}
          <div className="relative mb-2">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none"
              aria-hidden="true"
            />
            <Input
              id="activitiesSearch_activitiesPage"
              type="text"
              placeholder="Search by activity name…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-8 pr-8 h-8 text-sm focus-visible:ring-violet-200 focus-visible:border-violet-600"
            />
            {searchInput && (
              <button
                id="activitiesSearchClear_activitiesPage"
                onClick={() => {
                  setSearchInput('')
                  setSearch('')
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Type chips */}
            <div className="flex items-center gap-2 shrink-0">
              <p className="text-sm font-medium text-slate-500">Filter:</p>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <TypeChip
                  label="All"
                  active={!type}
                  onClick={() => router.push(buildUrl(searchParams, { type: null }))}
                />
                {knownTypes.map((t) => {
                  const cfg = ACTIVITY_CONFIG[t] ?? DEFAULT_CONFIG
                  return (
                    <TypeChip
                      key={t}
                      type={t}
                      label={cfg.label ?? t}
                      icon={cfg.icon}
                      active={type === t}
                      onClick={() => router.push(buildUrl(searchParams, { type: t }))}
                    />
                  )
                })}
              </div>
            </div>

            {/* Date + Sort selects */}
            <div className="flex items-center gap-2 shrink-0">
              <Select
                value={range}
                onValueChange={(v) => router.push(buildUrl(searchParams, { range: v }))}
              >
                <SelectTrigger className="w-36 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="ytd">This year</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sort}
                onValueChange={(v) => router.push(buildUrl(searchParams, { sort: v }))}
              >
                <SelectTrigger className="w-40 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="longest">Longest distance</SelectItem>
                  <SelectItem value="fastest">Fastest pace</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table area */}
        <div className="px-3 sm:px-5 py-3 sm:py-4">
          {/* Total count */}
          {!loading && !error && (
            <p className="text-sm text-slate-400 mb-3" aria-live="polite">
              {total} {type ? `${type} ` : ''}activit{total === 1 ? 'y' : 'ies'}
            </p>
          )}

          {/* Error */}
          {!loading && error && (
            <div
              id="activitiesError"
              role="alert"
              aria-live="assertive"
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-sm text-red-600 border border-red-100 mb-3"
            >
              <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
              <span>
                {error}{' '}
                <button
                  className="underline font-medium"
                  onClick={() => {
                    setError(null)
                    setLoading(true)
                  }}
                >
                  Try again
                </button>
              </span>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <Table className="min-w-[640px] w-full table-auto">
              <TableHeader className="bg-slate-100 sticky top-0 z-20">
                <TableRow className="border-none uppercase text-xs">
                  <TableHead className="py-2 text-slate-foreground rounded-l-lg w-[40%]">
                    Activity
                  </TableHead>
                  <TableHead className="py-2 text-slate-foreground">Date</TableHead>
                  <TableHead className="py-2 text-slate-foreground text-right">Dist</TableHead>
                  <TableHead className="py-2 text-slate-foreground text-right">Pace</TableHead>
                  <TableHead className="py-2 text-slate-foreground text-right">Time</TableHead>
                  <TableHead
                    className="py-2 text-slate-foreground text-right"
                    title="Average heart rate"
                  >
                    HR
                  </TableHead>
                  <TableHead
                    className="py-2 text-slate-foreground text-right rounded-r-lg"
                    title="Elevation gain"
                  >
                    Elev
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody id="activitiesList">
                {/* Loading */}
                {loading && (
                  <TableRow>
                    <TableCell colSpan={7} className="p-0">
                      <div
                        id="activitiesLoadingSkeleton"
                        aria-busy="true"
                        aria-label="Loading activities"
                      >
                        <Table className="min-w-[640px] w-full">
                          <TableBody>
                            {Array.from({ length: 8 }).map((_, i) => (
                              <SkeletonRow key={i} />
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* Empty */}
                {!loading && !error && activities.length === 0 && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={7}>
                      <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <Activity className="size-10 text-slate-200" aria-hidden="true" />
                        <p className="text-sm text-slate-500">
                          {hasFilters ? 'No activities match your filters.' : 'No activities yet.'}
                        </p>
                        {hasFilters && (
                          <Button variant="ghost" size="sm" onClick={clearFilters}>
                            Clear filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* Rows */}
                {!loading &&
                  !error &&
                  activities.map((a) => {
                    const cfg = getActivityCfg(a)
                    const Icon = cfg.icon
                    const dist =
                      a.distance_m && a.distance_m > 0 ? `${fmtDistance(a.distance_m)} km` : null
                    const pace = a.avg_pace_sec_per_km
                      ? `${fmtPace(a.avg_pace_sec_per_km)}/km`
                      : null
                    const dur = a.moving_time_sec ?? a.duration_sec
                    const elev =
                      a.elevation_gain_m && a.elevation_gain_m > 0
                        ? `↑ ${Math.round(a.elevation_gain_m)} m`
                        : null
                    const workoutBadge =
                      a.workout_type != null ? WORKOUT_BADGE[a.workout_type] : null
                    const name = a.name || cfg.label || a.activity_type

                    return (
                      <TableRow
                        key={a.id}
                        className="cursor-pointer hover:bg-slate-100 transition-colors"
                        onClick={() => router.push(`/main/running/activities/${a.id}`)}
                      >
                        {/* Activity */}
                        <TableCell className="w-[40%]">
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex size-8 items-center justify-center rounded-full shrink-0 ${cfg.bg}`}
                            >
                              <Icon className={`size-4 ${cfg.color}`} aria-hidden="true" />
                            </span>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {workoutBadge}
                                <span className="text-sm font-medium text-slate-700 truncate">
                                  {name}
                                </span>
                                {a.pr_count > 0 && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 text-[10px] font-semibold leading-none shrink-0">
                                    <Trophy className="size-3" aria-hidden="true" />
                                    {a.pr_count} PR
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-400">
                                {cfg.label ?? a.activity_type}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Date */}
                        <TableCell className="text-sm text-slate-600 whitespace-nowrap">
                          {fmtShortDate(a.started_at)}
                        </TableCell>

                        {/* Distance */}
                        <TableCell className="text-right">
                          <span className="font-mono tabular-nums text-sm text-slate-700">
                            {dist ?? NULL_CELL}
                          </span>
                        </TableCell>

                        {/* Pace */}
                        <TableCell className="text-right">
                          <span className="font-mono tabular-nums text-sm text-slate-700">
                            {pace ?? NULL_CELL}
                          </span>
                        </TableCell>

                        {/* Duration */}
                        <TableCell className="text-right">
                          <span className="font-mono tabular-nums text-sm text-slate-700">
                            {dur != null ? fmtDuration(dur) : NULL_CELL}
                          </span>
                        </TableCell>

                        {/* HR */}
                        <TableCell className="text-right">
                          <span className="font-mono tabular-nums text-sm text-slate-700">
                            {a.avg_hr ? `${a.avg_hr} bpm` : NULL_CELL}
                          </span>
                        </TableCell>

                        {/* Elev */}
                        <TableCell className="text-right">
                          <span className="font-mono tabular-nums text-sm text-slate-700">
                            {elev ?? NULL_CELL}
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 mt-2" aria-label="Pagination">
              <button
                onClick={() => router.push(buildUrl(searchParams, { page: page - 1 }))}
                disabled={page <= 1}
                className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-violet-600 disabled:opacity-40 disabled:pointer-events-none transition-colors min-h-[44px]"
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
                Prev
              </button>
              <span className="text-xs text-slate-400" aria-live="polite">
                Page {page} of {totalPages} · {total} activities
              </span>
              <button
                onClick={() => router.push(buildUrl(searchParams, { page: page + 1 }))}
                disabled={page >= totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-violet-600 disabled:opacity-40 disabled:pointer-events-none transition-colors min-h-[44px]"
                aria-label="Next page"
              >
                Next
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── page export ──────────────────────────────────────────────────────────────

export default function ActivitiesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="h-8 bg-slate-100 rounded w-40" />
          <div className="h-9 bg-slate-100 rounded w-full" />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 bg-slate-100 rounded w-full" />
          ))}
        </div>
      }
    >
      <ActivitiesInner />
    </Suspense>
  )
}
