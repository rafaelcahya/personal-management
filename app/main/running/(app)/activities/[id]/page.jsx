'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
  Flame,
  Flag,
  Pencil,
  Loader2,
  Calendar,
  NotebookText,
  CloudSun,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { fetchActivity, getDashboard, updateGoal } from '@/lib/api/running'
import { updateGoalSchema } from '@/schemas/raceLog'
import { fmtDistance, fmtPace, fmtDuration, fmtDate } from '../../dashboard/utils/format'
import PageHeader from '@/app/main/components/PageHeader'

const RouteMap = dynamic(() => import('../components/RouteMap'), { ssr: false })

// ─── distance presets ─────────────────────────────────────────────────────────

const DISTANCE_PRESETS = [
  { label: '5K', value: 5000 },
  { label: '10K', value: 10000 },
  { label: 'Half Marathon (21.1K)', value: 21097.5 },
  { label: 'Marathon (42.2K)', value: 42195 },
  { label: 'Custom', value: 'custom' },
]

function getDistanceLabel(m) {
  if (!m) return null
  const km = Number(m) / 1000
  if (km === 42.195) return 'Marathon'
  if (km === 21.0975) return 'Half Marathon'
  if (km === 10) return '10K'
  if (km === 5) return '5K'
  return `${km % 1 === 0 ? km : km.toFixed(1)} km`
}

// ─── edit goal modal ──────────────────────────────────────────────────────────

function EditGoalModal({ open, goal, onClose, onSaved }) {
  const [distanceMode, setDistanceMode] = useState('preset')
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateGoalSchema),
    defaultValues: {
      title: '',
      target_distance_m: null,
      target_date: '',
      description: '',
    },
  })

  useEffect(() => {
    if (open && goal) {
      const presetMatch = DISTANCE_PRESETS.find(
        (p) => p.value !== 'custom' && p.value === Number(goal.distance_m)
      )
      setDistanceMode(presetMatch ? 'preset' : 'custom')
      reset({
        title: goal.title ?? '',
        target_distance_m: goal.distance_m ? Number(goal.distance_m) : null,
        target_date: goal.target_date ? goal.target_date.slice(0, 10) : '',
        description: goal.description ?? '',
      })
    }
    setServerError(null)
  }, [open, goal, reset])

  async function onSubmit(data) {
    if (!goal?.id) return
    setSaving(true)
    setServerError(null)
    try {
      const result = await updateGoal(goal.id, data)
      toast.success('Race goal updated')
      onSaved(result.data)
      onClose()
    } catch (err) {
      setServerError(err.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent id="editGoalModal" className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit race goal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 py-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="goalTitle">Race title</Label>
            <Input id="goalTitle" placeholder="e.g. Bali Marathon 2026" {...register('title')} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Target distance</Label>
            <Controller
              name="target_distance_m"
              control={control}
              render={({ field }) => (
                <Select
                  value={
                    distanceMode === 'custom'
                      ? 'custom'
                      : field.value != null
                        ? String(field.value)
                        : ''
                  }
                  onValueChange={(v) => {
                    if (v === 'custom') {
                      setDistanceMode('custom')
                      field.onChange(null)
                    } else {
                      setDistanceMode('preset')
                      field.onChange(Number(v))
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select distance…" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISTANCE_PRESETS.map((p) => (
                      <SelectItem key={String(p.value)} value={String(p.value)}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {distanceMode === 'custom' && (
              <Controller
                name="target_distance_m"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder="Distance in meters"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                )}
              />
            )}
            {errors.target_distance_m && (
              <p className="text-xs text-red-600" role="alert">
                {errors.target_distance_m.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="goalDate">Target date</Label>
            <Input id="goalDate" type="date" {...register('target_date')} />
            {errors.target_date && (
              <p className="text-xs text-red-600" role="alert">
                {errors.target_date.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="goalDescription">Notes / description</Label>
            <Textarea
              id="goalDescription"
              placeholder="Training goals, race context…"
              rows={3}
              {...register('description')}
            />
          </div>

          {serverError && (
            <p className="text-xs text-red-600" role="alert">
              {serverError}
            </p>
          )}
        </form>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" type="button" disabled={saving}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            id="editGoalSaveBtn"
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            className="min-w-[80px]"
          >
            {saving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

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

// ─── section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{children}</p>
  )
}

// ─── skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="flex flex-col gap-3 sm:gap-5 animate-pulse">
      <div className="h-8 bg-slate-100 rounded w-2/3" />
      <div className="border border-slate-200/50 rounded-xl bg-white overflow-hidden">
        <div className="h-64 bg-slate-100" />
        <div className="p-4 sm:p-5 flex flex-col gap-4">
          <div className="h-6 bg-slate-100 rounded w-48" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function ActivityDetailPage() {
  const { id } = useParams()
  const [activity, setActivity] = useState(null)
  const [splits, setSplits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [nextRaceGoal, setNextRaceGoal] = useState(null)
  const [editGoalOpen, setEditGoalOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [actRes, dashRes] = await Promise.allSettled([fetchActivity(id), getDashboard()])
        if (!cancelled) {
          if (actRes.status === 'fulfilled') {
            setActivity(actRes.value.activity)
            setSplits(actRes.value.splits ?? [])
          } else {
            throw actRes.reason
          }
          if (dashRes.status === 'fulfilled') {
            setNextRaceGoal(dashRes.value?.training_load?.next_race_goal ?? null)
          }
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

  const activityName =
    activity?.name || (activity ? (getActivityCfg(activity).label ?? activity.activity_type) : null)

  return (
    <div id="activityDetailPage" className="flex flex-col gap-3 sm:gap-5 max-w-2xl">
      <PageHeader
        title={activityName ?? 'Activity'}
        breadcrumbs={[
          { label: 'Running', href: '/main/running/dashboard' },
          { label: 'Activities', href: '/main/running/activities' },
          { label: activityName ?? 'Detail' },
        ]}
      />

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
          const wattsVal = activity.device_watts
            ? (activity.weighted_avg_watts ?? activity.avg_watts)
            : null
          const normWatts = activity.device_watts ? activity.weighted_avg_watts : null
          const gear = activity.gear
          const gearDistKm = gear?.distance_m != null ? Math.round(gear.distance_m / 1000) : null
          const elapsedDiffSec = (activity.duration_sec ?? 0) - (activity.moving_time_sec ?? 0)
          const hasSplitsHr = splits.some((s) => s.avg_hr != null)

          return (
            <>
              <div className="border border-slate-200/50 shadow-slate-100 rounded-xl bg-white overflow-hidden">
                {/* Route map — full width, no padding */}
                {activity.summary_polyline && (
                  <RouteMap
                    encodedPolyline={activity.summary_polyline}
                    height={280}
                    className="w-full"
                  />
                )}

                {/* Content */}
                <div className="p-4 sm:p-5 flex flex-col gap-5">
                  {/* Activity header */}
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg shrink-0 ${cfg.bg}`}>
                      <Icon className={`size-5 ${cfg.color}`} aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg font-bold text-slate-800 leading-snug">
                          {activity.name || cfg.label || activity.activity_type}
                        </h2>
                        {activity.pr_count > 0 && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold shrink-0">
                            <Trophy className="size-3" aria-hidden="true" />
                            {activity.pr_count} PR
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-sm text-slate-400">
                          {fmtDate(activity.started_at)}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}
                        >
                          {cfg.label ?? activity.activity_type}
                        </span>
                        {activity.source && (
                          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full capitalize">
                            {activity.source}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Stats grid */}
                  <div>
                    <SectionLabel>Stats</SectionLabel>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {activity.distance_m > 0 && (
                        <StatTile
                          label="Distance"
                          value={fmtDistance(activity.distance_m)}
                          unit="km"
                        />
                      )}
                      {activity.avg_pace_sec_per_km && (
                        <StatTile
                          label="Avg Pace"
                          value={fmtPace(activity.avg_pace_sec_per_km)}
                          unit="/km"
                          sub={
                            activity.max_pace_sec_per_km
                              ? `Best ${fmtPace(activity.max_pace_sec_per_km)}/km`
                              : undefined
                          }
                        />
                      )}
                      <StatTile
                        label="Moving Time"
                        value={fmtDuration(activity.moving_time_sec ?? activity.duration_sec)}
                        sub={
                          elapsedDiffSec > 60
                            ? `Elapsed ${fmtDuration(activity.duration_sec)}`
                            : undefined
                        }
                      />
                      {activity.avg_hr != null && (
                        <StatTile
                          label="Avg HR"
                          value={activity.avg_hr}
                          unit="bpm"
                          sub={activity.max_hr ? `Max ${activity.max_hr} bpm` : undefined}
                        />
                      )}
                      {cadenceSpm != null && (
                        <StatTile label="Cadence" value={cadenceSpm} unit="spm" />
                      )}
                      {activity.elevation_gain_m != null && activity.elevation_gain_m > 0 && (
                        <StatTile
                          label="Elevation"
                          value={`↑ ${Math.round(activity.elevation_gain_m)}`}
                          unit="m"
                          sub={
                            activity.elevation_loss_m > 0
                              ? `↓ ${Math.round(activity.elevation_loss_m)} m`
                              : undefined
                          }
                        />
                      )}
                      {activity.calories != null && (
                        <StatTile
                          label="Calories"
                          value={Math.round(activity.calories)}
                          unit="kcal"
                        />
                      )}
                      {activity.relative_effort != null && (
                        <StatTile
                          label="Relative Effort"
                          value={Math.round(activity.relative_effort)}
                        />
                      )}
                      {activity.perceived_exertion != null && (
                        <StatTile label="RPE" value={activity.perceived_exertion} unit="/ 10" />
                      )}
                    </div>
                  </div>

                  {/* Power + environment pills */}
                  {(wattsVal != null || activity.avg_temp_c != null) && (
                    <div className="flex flex-wrap items-center gap-2">
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
                    </div>
                  )}

                  {/* Gear */}
                  {gear?.name && (
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-lg">
                      <Footprints className="size-4 text-slate-400 shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <span className="text-sm text-slate-700 font-medium">{gear.name}</span>
                        {gearDistKm != null && (
                          <span className="text-xs text-slate-400 ml-2">{gearDistKm} km total</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notes + weather */}
                  {(activity.notes || activity.weather_summary) && (
                    <div className="flex flex-col gap-2">
                      {activity.notes && (
                        <div className="flex items-start gap-2 px-3 py-2.5 bg-slate-50 rounded-lg">
                          <NotebookText
                            className="size-4 text-slate-400 shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <p className="text-sm text-slate-600">{activity.notes}</p>
                        </div>
                      )}
                      {activity.weather_summary && (
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-lg">
                          <CloudSun className="size-4 text-slate-400 shrink-0" aria-hidden="true" />
                          <p className="text-sm text-slate-600">{activity.weather_summary}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Splits table */}
                  {splits.length > 0 && (
                    <div>
                      <SectionLabel>Splits (per km)</SectionLabel>
                      <div className="overflow-x-auto">
                        <Table className="w-full table-auto">
                          <TableHeader className="bg-slate-100">
                            <TableRow className="border-none uppercase text-xs">
                              <TableHead className="py-2 text-slate-foreground rounded-l-lg w-10">
                                #
                              </TableHead>
                              <TableHead className="py-2 text-slate-foreground text-right">
                                Dist
                              </TableHead>
                              <TableHead className="py-2 text-slate-foreground text-right">
                                Pace
                              </TableHead>
                              <TableHead className="py-2 text-slate-foreground text-right">
                                Time
                              </TableHead>
                              {hasSplitsHr && (
                                <TableHead className="py-2 text-slate-foreground text-right">
                                  HR
                                </TableHead>
                              )}
                              <TableHead className="py-2 text-slate-foreground text-right rounded-r-lg">
                                Elev
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {splits.map((s) => (
                              <TableRow key={s.id ?? s.split_number} className="hover:bg-slate-50">
                                <TableCell className="text-xs text-slate-400 font-medium">
                                  {s.split_number}
                                </TableCell>
                                <TableCell className="text-right">
                                  <span className="font-mono tabular-nums text-sm text-slate-700">
                                    {s.distance_m ? `${(s.distance_m / 1000).toFixed(2)} km` : '—'}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <span className="font-mono tabular-nums text-sm text-slate-700">
                                    {s.pace_sec_per_km ? `${fmtPace(s.pace_sec_per_km)}/km` : '—'}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <span className="font-mono tabular-nums text-sm text-slate-700">
                                    {s.duration_sec ? fmtDuration(s.duration_sec) : '—'}
                                  </span>
                                </TableCell>
                                {hasSplitsHr && (
                                  <TableCell className="text-right">
                                    <span className="font-mono tabular-nums text-sm text-slate-700">
                                      {s.avg_hr ? `${s.avg_hr}` : '—'}
                                    </span>
                                  </TableCell>
                                )}
                                <TableCell className="text-right">
                                  <span className="font-mono tabular-nums text-sm text-slate-700">
                                    {s.elevation_gain_m != null
                                      ? `${s.elevation_gain_m > 0 ? '+' : ''}${Math.round(s.elevation_gain_m)} m`
                                      : '—'}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Next race goal */}
              <Card className="border border-slate-200/70 shadow-sm">
                <CardContent className="px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center size-8 rounded-full bg-violet-50 shrink-0">
                        <Flag className="size-4 text-violet-500" aria-hidden="true" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Your Next Race
                        </span>
                        {nextRaceGoal ? (
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="font-medium text-slate-800">
                              {nextRaceGoal.title ||
                                getDistanceLabel(nextRaceGoal.distance_m) ||
                                'Race goal'}
                            </span>
                            {nextRaceGoal.target_date && (
                              <span className="flex items-center gap-1 text-xs text-slate-400">
                                <Calendar className="size-3 shrink-0" aria-hidden="true" />
                                {new Date(nextRaceGoal.target_date).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">No race goal set</span>
                        )}
                      </div>
                    </div>
                    <button
                      id="editGoalBtn"
                      onClick={() => setEditGoalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-violet-600 hover:bg-violet-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 min-h-[44px]"
                      aria-label="Edit race goal"
                    >
                      <Pencil className="size-3.5" aria-hidden="true" />
                      Edit goal
                    </button>
                  </div>
                </CardContent>
              </Card>
            </>
          )
        })()}

      <EditGoalModal
        open={editGoalOpen}
        goal={nextRaceGoal}
        onClose={() => setEditGoalOpen(false)}
        onSaved={(updated) => setNextRaceGoal((prev) => ({ ...prev, ...updated }))}
      />
    </div>
  )
}
