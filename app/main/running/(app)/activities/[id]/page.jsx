'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Thermometer,
  Gauge,
  TrendingUp,
  BarChart2,
  Info,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
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
import {
  fetchActivity,
  getDashboard,
  updateGoal,
  updateActivity,
  fetchRaceLog,
  fetchSubjectiveHealthByDate,
} from '@/lib/api/running'
import StreamCharts from '../components/StreamCharts'
import HrZonesChart from '../components/HrZonesChart'
import AIInsightCard from '../components/AIInsightCard'
import { updateGoalSchema } from '@/schemas/raceLog'
import { fmtDistance, fmtPace, fmtDuration, fmtDate } from '../../dashboard/utils/format'
import PageHeader from '@/app/main/components/PageHeader'

const RouteMap = dynamic(() => import('../components/RouteMap'), { ssr: false })

function MediaCarousel({ polyline, photos }) {
  const [active, setActive] = useState(0)
  const [expandedPhoto, setExpandedPhoto] = useState(null)

  const hasPhotos = photos.length > 0
  const hasMap = !!polyline

  if (!hasMap && !hasPhotos) return null

  if (hasMap && !hasPhotos) {
    return <RouteMap encodedPolyline={polyline} height={420} className="w-full" />
  }

  const slides = []
  if (hasMap) slides.push({ type: 'map' })
  photos.forEach((p) => {
    if (p.url_600) slides.push({ type: 'photo', url: p.url_600, id: p.unique_id })
  })

  if (slides.length === 0) return null

  const prev = () => setActive((a) => (a - 1 + slides.length) % slides.length)
  const next = () => setActive((a) => (a + 1) % slides.length)

  const current = slides[active]

  return (
    <>
      <div className="relative group/carousel">
        <div className="w-full overflow-hidden" style={{ height: 420 }}>
          {current.type === 'map' ? (
            <RouteMap encodedPolyline={polyline} height={420} className="w-full" />
          ) : (
            <img src={current.url} alt="Activity photo" className="w-full h-full object-cover" />
          )}
        </div>

        {current.type === 'photo' && (
          <button
            onClick={() => setExpandedPhoto(current.url)}
            className="absolute top-2 right-2 z-[1001] bg-white/80 hover:bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity"
            aria-label="View full photo"
          >
            <Maximize2 className="size-4 text-slate-600" />
          </button>
        )}

        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-[1001] bg-white/80 hover:bg-white border border-slate-200 rounded-full p-1 shadow-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity"
              aria-label="Previous"
            >
              <ChevronLeft className="size-4 text-slate-600" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-[1001] bg-white/80 hover:bg-white border border-slate-200 rounded-full p-1 shadow-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity"
              aria-label="Next"
            >
              <ChevronRight className="size-4 text-slate-600" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[1001] flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`size-1.5 rounded-full transition-all ${i === active ? 'bg-white shadow' : 'bg-white/50'}`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {expandedPhoto && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setExpandedPhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={expandedPhoto}
              alt="Activity photo"
              className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setExpandedPhoto(null)}
              className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
              aria-label="Close photo"
            >
              <X className="size-5 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

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
      <DialogContent id="editGoalModal_activityDetailPage" className="max-w-md">
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
            id="editGoalSaveBtn_activityDetailPage"
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

function tempStyle(c) {
  if (c < 10) return { text: 'text-blue-700', bg: 'bg-blue-50', label: 'Cold' }
  if (c < 18) return { text: 'text-green-700', bg: 'bg-green-50', label: 'Cool' }
  if (c < 25) return { text: 'text-amber-700', bg: 'bg-amber-50', label: 'Warm' }
  if (c < 32) return { text: 'text-orange-700', bg: 'bg-orange-50', label: 'Hot' }
  return { text: 'text-red-700', bg: 'bg-red-50', label: 'Very Hot' }
}

// ─── stat tile ────────────────────────────────────────────────────────────────

function StatTile({ label, value, unit, sub, icon: Icon }) {
  return (
    <div className="flex flex-col gap-0.5 p-3 bg-slate-50 rounded-lg">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="size-3.5 text-slate-400 shrink-0" aria-hidden="true" />}
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
          {label}
        </span>
      </div>
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
  const router = useRouter()
  const [activity, setActivity] = useState(null)
  const [splits, setSplits] = useState([])
  const [laps, setLaps] = useState([])
  const [bestEfforts, setBestEfforts] = useState([])
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [nextRaceGoal, setNextRaceGoal] = useState(null)
  const [editGoalOpen, setEditGoalOpen] = useState(false)
  const [linkedRace, setLinkedRace] = useState(null)

  const [healthLog, setHealthLog] = useState(undefined)

  const [notesEditing, setNotesEditing] = useState(false)
  const [notesValue, setNotesValue] = useState('')
  const [notesSaving, setNotesSaving] = useState(false)

  async function handleSaveNotes() {
    setNotesSaving(true)
    try {
      const trimmed = notesValue.trim() || null
      await updateActivity(id, { notes: trimmed })
      setActivity((prev) => ({ ...prev, notes: trimmed }))
      setNotesEditing(false)
      toast.success('Notes saved')
    } catch (err) {
      toast.error(err.message || 'Failed to save notes')
    } finally {
      setNotesSaving(false)
    }
  }

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [actRes, dashRes, raceLogRes] = await Promise.allSettled([
          fetchActivity(id),
          getDashboard(),
          fetchRaceLog(),
        ])

        const activityDate =
          actRes.status === 'fulfilled' ? actRes.value.activity?.started_at?.slice(0, 10) : null
        if (activityDate) {
          fetchSubjectiveHealthByDate(activityDate)
            .then((log) => {
              if (!cancelled) setHealthLog(log ?? null)
            })
            .catch(() => {
              if (!cancelled) setHealthLog(null)
            })
        }
        if (!cancelled) {
          if (actRes.status === 'fulfilled') {
            setActivity(actRes.value.activity)
            setSplits(actRes.value.splits ?? [])
            setLaps(actRes.value.laps ?? [])
            setBestEfforts(actRes.value.best_efforts ?? [])
            setPhotos(actRes.value.photos ?? [])
          } else {
            throw actRes.reason
          }
          if (dashRes.status === 'fulfilled') {
            setNextRaceGoal(dashRes.value?.training_load?.next_race_goal ?? null)
          }
          if (raceLogRes.status === 'fulfilled') {
            const entries = raceLogRes.value?.data ?? raceLogRes.value ?? []
            const matched = entries.find((entry) => entry.activity_id === id)
            setLinkedRace(matched ?? null)
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
    <div id="activityDetailPage" className="flex flex-col gap-3 sm:gap-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center size-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors shrink-0"
          aria-label="Go back"
        >
          <ChevronLeft className="size-4" />
        </button>
        <PageHeader
          title={activityName ?? 'Activity'}
          breadcrumbs={[
            { label: 'Running', href: '/main/running/dashboard' },
            { label: 'Activities', href: '/main/running/activities' },
            { label: activityName ?? 'Detail' },
          ]}
        />
      </div>

      {loading && <Skeleton />}

      {!loading && error && (
        <div
          className="flex flex-col items-center justify-center gap-3 py-20 text-sm text-red-400"
          role="alert"
          aria-live="assertive"
        >
          <span>{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-violet-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
          >
            Try again
          </button>
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
          const hasLapsHr = laps.some((l) => l.avg_hr != null)

          return (
            <>
              <div className="border border-slate-200/50 shadow-slate-100 rounded-xl bg-white overflow-hidden pb-6 pt-0 lg:pt-6">
                {/* Carousel: 80% of card, centered */}
                <div className="w-full lg:w-4/5 mx-auto rounded-xl overflow-hidden relative z-0 isolate">
                  <MediaCarousel polyline={activity.summary_polyline} photos={photos} />
                </div>

                {/* Content: 60% of card, centered */}
                <div className="w-full lg:w-3/5 mx-auto px-4 lg:px-0 pt-5 flex flex-col gap-5">
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
                        {activity.achievement_count > 0 && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold shrink-0">
                            <Trophy className="size-3" aria-hidden="true" />
                            {activity.achievement_count} achievements
                          </span>
                        )}
                        {activity.kudos_count > 0 && (
                          <span className="text-xs text-slate-400">♥ {activity.kudos_count}</span>
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
                      {(activity.commute || activity.trainer || activity.manual) && (
                        <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                          {activity.commute && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              Commute
                            </span>
                          )}
                          {activity.trainer && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                              Indoor
                            </span>
                          )}
                          {activity.manual && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                              Manual
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Stats grid */}
                  <div>
                    <SectionLabel>Stats</SectionLabel>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {activity.distance_m > 0 && (
                        <StatTile
                          icon={MapIcon}
                          label="Distance"
                          value={fmtDistance(activity.distance_m)}
                          unit="km"
                        />
                      )}
                      {activity.avg_pace_sec_per_km && (
                        <StatTile
                          icon={Gauge}
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
                        icon={Timer}
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
                          icon={Heart}
                          label="Avg HR"
                          value={activity.avg_hr}
                          unit="bpm"
                          sub={activity.max_hr ? `Max ${activity.max_hr} bpm` : undefined}
                        />
                      )}
                      {cadenceSpm != null && (
                        <StatTile icon={Activity} label="Cadence" value={cadenceSpm} unit="spm" />
                      )}
                      {activity.elevation_gain_m != null && activity.elevation_gain_m > 0 && (
                        <StatTile
                          icon={TrendingUp}
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
                          icon={Flame}
                          label="Calories"
                          value={Math.round(activity.calories)}
                          unit="kcal"
                        />
                      )}
                      {activity.relative_effort != null && (
                        <StatTile
                          icon={Zap}
                          label="Relative Effort"
                          value={Math.round(activity.relative_effort)}
                        />
                      )}
                      {activity.perceived_exertion != null && (
                        <StatTile
                          icon={Activity}
                          label="RPE"
                          value={activity.perceived_exertion}
                          unit="/ 10"
                        />
                      )}
                      {activity.kilojoules != null && (
                        <StatTile
                          icon={Zap}
                          label="Energy"
                          value={Math.round(activity.kilojoules)}
                          unit="kJ"
                        />
                      )}
                      {activity.max_watts != null && (
                        <StatTile
                          icon={Zap}
                          label="Max Power"
                          value={activity.max_watts}
                          unit="W"
                        />
                      )}
                      {(activity.elev_high_m != null || activity.elev_low_m != null) && (
                        <StatTile
                          icon={TrendingUp}
                          label="Elevation Range"
                          value={`↑${Math.round(activity.elev_high_m ?? 0)} ↓${Math.round(activity.elev_low_m ?? 0)}`}
                          unit="m"
                        />
                      )}
                      {activity.efficiency_factor != null && (
                        <div id="efficiencyFactor_activityDetailPage">
                          <StatTile
                            icon={BarChart2}
                            label="Efficiency"
                            value={Number(activity.efficiency_factor).toFixed(4)}
                            unit="m/s/bpm"
                          />
                        </div>
                      )}
                      {activity.estimated_vo2max != null && (
                        <div id="estimatedVo2max_activityDetailPage">
                          <StatTile
                            icon={Wind}
                            label="Est. VO₂max"
                            value={Number(activity.estimated_vo2max).toFixed(1)}
                            unit="mL/kg/min"
                          />
                        </div>
                      )}
                    </div>
                    {activity.efficiency_factor == null &&
                      activity.estimated_vo2max == null &&
                      activity.aerobic_decoupling == null &&
                      ['Run', 'TrailRun', 'VirtualRun'].includes(activity.activity_type) && (
                        <p
                          id="derivedMetricsGuide_activityDetailPage"
                          className="text-xs text-slate-400 mt-2"
                        >
                          Aerobic Decoupling, Efficiency Factor, and VO₂max estimates require heart
                          rate data. Connect a HR monitor to your Strava activities to unlock these
                          metrics.
                        </p>
                      )}
                  </div>

                  {/* Power + environment + aerobic decoupling pills */}
                  {(wattsVal != null ||
                    activity.avg_temp_c != null ||
                    activity.aerobic_decoupling != null) && (
                    <div className="flex flex-col gap-2">
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
                        {activity.avg_temp_c != null &&
                          (() => {
                            const ts = tempStyle(activity.avg_temp_c)
                            return (
                              <div
                                title="Average air temperature recorded during the activity (from Strava weather data or device sensor)"
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium ${ts.bg} ${ts.text}`}
                              >
                                <Thermometer className="size-4 shrink-0" aria-hidden="true" />
                                <span>{activity.avg_temp_c}°C</span>
                                <span
                                  className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${ts.bg}`}
                                >
                                  {ts.label}
                                </span>
                              </div>
                            )
                          })()}
                        {activity.aerobic_decoupling != null &&
                          (() => {
                            const val = Number(activity.aerobic_decoupling)
                            const abs = Math.abs(val)
                            const { color, bg, label } =
                              abs < 5
                                ? { color: 'text-green-700', bg: 'bg-green-50', label: 'Good' }
                                : abs <= 10
                                  ? {
                                      color: 'text-amber-700',
                                      bg: 'bg-amber-50',
                                      label: 'Moderate',
                                    }
                                  : { color: 'text-red-700', bg: 'bg-red-50', label: 'High drift' }
                            return (
                              <div
                                id="aeroDrift_activityDetailPage"
                                title="Aerobic Decoupling (Pa:Hr): <5% = good aerobic base, 5-10% = moderate drift, >10% = high drift"
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium ${bg} ${color}`}
                              >
                                <Heart className="size-4 shrink-0" aria-hidden="true" />
                                <span>
                                  Decouple {val > 0 ? '+' : ''}
                                  {val}%
                                </span>
                                <span
                                  className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${bg}`}
                                >
                                  {label}
                                </span>
                              </div>
                            )
                          })()}
                      </div>
                      {activity.avg_temp_c != null && (
                        <p className="text-xs text-slate-400">
                          Temperature reflects the average air temp recorded during the activity —
                          sourced from Strava weather data or your device sensor.
                        </p>
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

                  {/* Device */}
                  {activity.device_name && (
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-lg">
                      <Smartphone className="size-4 text-slate-400 shrink-0" aria-hidden="true" />
                      <span className="text-sm text-slate-600">{activity.device_name}</span>
                    </div>
                  )}

                  {/* Race log linkage badge */}
                  {linkedRace && (
                    <div
                      id="linkedRaceBadge_activityDetailPage"
                      className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg"
                    >
                      <Trophy className="size-4 text-amber-500 shrink-0" aria-hidden="true" />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-xs font-semibold text-amber-700">Race Entry</span>
                        <span className="text-sm text-amber-800 font-medium truncate">
                          {linkedRace.title}
                        </span>
                      </div>
                      {linkedRace.finish_time_sec && (
                        <span className="ml-auto text-xs text-amber-600 font-mono shrink-0">
                          {fmtDuration(linkedRace.finish_time_sec)}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Description (from Strava) */}
                  {activity.description && (
                    <div className="px-3 py-2.5 bg-slate-50 rounded-lg">
                      <p className="text-xs font-medium text-slate-400 mb-1">Description</p>
                      <p className="text-sm text-slate-600 whitespace-pre-line">
                        {activity.description}
                      </p>
                    </div>
                  )}

                  {/* Notes — inline editable */}
                  <div className="flex flex-col gap-2">
                    {notesEditing ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start gap-2 px-3 py-2.5 bg-slate-50 rounded-lg">
                          <NotebookText
                            className="size-4 text-slate-400 shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <textarea
                            id="notesTextarea_activityDetailPage"
                            rows={3}
                            value={notesValue}
                            onChange={(e) => setNotesValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !notesSaving) {
                                handleSaveNotes()
                              }
                            }}
                            className="w-full text-sm text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
                            placeholder="Add your notes… (Ctrl+Enter to save)"
                            autoFocus
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button
                            id="notesCancelBtn_activityDetailPage"
                            variant="ghost"
                            size="sm"
                            onClick={() => setNotesEditing(false)}
                            disabled={notesSaving}
                          >
                            Cancel
                          </Button>
                          <Button
                            id="notesSaveBtn_activityDetailPage"
                            size="sm"
                            onClick={handleSaveNotes}
                            disabled={notesSaving}
                            className="min-w-[60px]"
                          >
                            {notesSaving ? (
                              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                            ) : (
                              'Save'
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        id="notesEditBtn_activityDetailPage"
                        onClick={() => {
                          setNotesValue(activity.notes ?? '')
                          setNotesEditing(true)
                        }}
                        className="flex items-start gap-2 px-3 py-2.5 bg-slate-50 rounded-lg w-full text-left hover:bg-slate-100 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200"
                        aria-label="Edit notes"
                      >
                        <NotebookText
                          className="size-4 text-slate-400 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        {activity.notes ? (
                          <span className="text-sm text-slate-600 flex-1">{activity.notes}</span>
                        ) : (
                          <span className="text-sm text-slate-400 italic flex-1">Add notes…</span>
                        )}
                        <Pencil
                          className="size-3.5 text-slate-300 group-hover:text-slate-400 shrink-0 mt-0.5 transition-colors"
                          aria-hidden="true"
                        />
                      </button>
                    )}

                    {activity.weather_summary && (
                      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-lg">
                        <CloudSun className="size-4 text-slate-400 shrink-0" aria-hidden="true" />
                        <p className="text-sm text-slate-600">{activity.weather_summary}</p>
                      </div>
                    )}
                  </div>

                  {healthLog !== undefined &&
                    (() => {
                      const ENERGY_LABEL = {
                        1: 'Very Low',
                        2: 'Low',
                        3: 'Moderate',
                        4: 'High',
                        5: 'Very High',
                      }
                      const MOOD_LABEL = { 1: 'Poor', 2: 'Bad', 3: 'Okay', 4: 'Good', 5: 'Great' }
                      const ENERGY_COLOR = {
                        1: 'text-red-500',
                        2: 'text-orange-500',
                        3: 'text-amber-500',
                        4: 'text-green-500',
                        5: 'text-emerald-600',
                      }
                      const MOOD_COLOR = {
                        1: 'text-red-500',
                        2: 'text-orange-500',
                        3: 'text-amber-500',
                        4: 'text-green-500',
                        5: 'text-emerald-600',
                      }
                      return (
                        <div
                          id="preActivityContext_activityDetailPage"
                          className="px-3 py-3 bg-slate-50 rounded-lg"
                        >
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                            Pre-Activity
                          </p>
                          {healthLog === null ? (
                            <p className="text-xs text-slate-400">
                              No health log for this day.{' '}
                              <a
                                href="/main/running/health"
                                className="text-violet-500 hover:underline"
                              >
                                Log sleep, energy &amp; mood
                              </a>{' '}
                              before your next run to see pre-activity context here.
                            </p>
                          ) : (
                            <>
                              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                                {healthLog.sleep_hours != null && (
                                  <span className="text-xs text-slate-600">
                                    <span className="text-slate-400">Sleep </span>
                                    <span className="font-medium">{healthLog.sleep_hours}h</span>
                                    {healthLog.sleep_quality != null && (
                                      <span className="text-slate-400">
                                        {' '}
                                        · {healthLog.sleep_quality}/10
                                      </span>
                                    )}
                                  </span>
                                )}
                                {healthLog.morning_energy != null && (
                                  <span className="text-xs text-slate-600">
                                    <span className="text-slate-400">Energy </span>
                                    <span
                                      className={`font-medium ${ENERGY_COLOR[healthLog.morning_energy] ?? ''}`}
                                    >
                                      {ENERGY_LABEL[healthLog.morning_energy] ??
                                        healthLog.morning_energy}
                                    </span>
                                  </span>
                                )}
                                {healthLog.mood != null && (
                                  <span className="text-xs text-slate-600">
                                    <span className="text-slate-400">Mood </span>
                                    <span
                                      className={`font-medium ${MOOD_COLOR[healthLog.mood] ?? ''}`}
                                    >
                                      {MOOD_LABEL[healthLog.mood] ?? healthLog.mood}
                                    </span>
                                  </span>
                                )}
                                {healthLog.soreness_level != null && (
                                  <span className="text-xs text-slate-600">
                                    <span className="text-slate-400">Soreness </span>
                                    <span className="font-medium">
                                      {healthLog.soreness_level}/10
                                    </span>
                                  </span>
                                )}
                                {healthLog.manual_rhr != null && (
                                  <span className="text-xs text-slate-600">
                                    <span className="text-slate-400">RHR </span>
                                    <span className="font-medium">{healthLog.manual_rhr} bpm</span>
                                  </span>
                                )}
                              </div>
                              {healthLog.notes && (
                                <p className="text-xs text-slate-500 mt-1.5 italic">
                                  {healthLog.notes}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      )
                    })()}

                  <div className="border-t border-slate-100" />
                  <div className="rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200/60 p-4">
                    <AIInsightCard activityId={id} />
                  </div>

                  {/* Splits table */}
                  {splits.length > 0 &&
                    (() => {
                      const splitsWithHr = splits.filter((s) => s.avg_hr != null)
                      const cardiacDrift =
                        hasSplitsHr && splitsWithHr.length >= 2
                          ? splitsWithHr[splitsWithHr.length - 1].avg_hr - splitsWithHr[0].avg_hr
                          : null

                      return (
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
                                  <TableRow
                                    key={s.id ?? s.split_number}
                                    className="hover:bg-slate-50"
                                  >
                                    <TableCell className="text-xs text-slate-400 font-medium">
                                      {s.split_number}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <span className="font-mono tabular-nums text-sm text-slate-700">
                                        {s.distance_m
                                          ? `${(s.distance_m / 1000).toFixed(2)} km`
                                          : '—'}
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <span className="font-mono tabular-nums text-sm text-slate-700">
                                        {s.pace_sec_per_km
                                          ? `${fmtPace(s.pace_sec_per_km)}/km`
                                          : '—'}
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
                          {cardiacDrift !== null && (
                            <div
                              id="cardiacDrift_activityDetailPage"
                              className="flex items-center gap-2 mt-2 px-1"
                            >
                              <Heart
                                className="size-3.5 text-slate-400 shrink-0"
                                aria-hidden="true"
                              />
                              <span className="text-xs text-slate-400">Cardiac drift:</span>
                              <span
                                className={`text-xs font-semibold ${
                                  cardiacDrift > 0 ? 'text-red-500' : 'text-blue-500'
                                }`}
                              >
                                {cardiacDrift > 0 ? '+' : ''}
                                {cardiacDrift} bpm
                              </span>
                              <span className="text-xs text-slate-300">(split 1 → last split)</span>
                              <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      className="flex items-center justify-center text-slate-300 hover:text-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
                                      aria-label="Cardiac drift information"
                                    >
                                      <Info className="size-3.5" aria-hidden="true" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    className="max-w-64 text-xs leading-relaxed"
                                  >
                                    <p className="font-semibold mb-1">What is Cardiac Drift?</p>
                                    <p>
                                      HR increase from your first split to your last split at the
                                      same pace — a sign of fatigue or dehydration.
                                    </p>
                                    <p className="mt-1.5 text-slate-300">
                                      <span className="text-green-400 font-medium">0–5 bpm</span>{' '}
                                      Good ·{' '}
                                      <span className="text-amber-400 font-medium">6–10</span>{' '}
                                      Moderate ·{' '}
                                      <span className="text-red-400 font-medium">&gt;10</span> High
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          )}
                        </div>
                      )
                    })()}
                  {/* Best Efforts */}
                  {bestEfforts.length > 0 && (
                    <div>
                      <SectionLabel>Best Efforts</SectionLabel>
                      <div className="overflow-x-auto">
                        <Table className="w-full table-auto">
                          <TableHeader className="bg-slate-100">
                            <TableRow className="border-none uppercase text-xs">
                              <TableHead className="py-2 text-slate-foreground rounded-l-lg">
                                Distance
                              </TableHead>
                              <TableHead className="py-2 text-slate-foreground text-right">
                                Time
                              </TableHead>
                              <TableHead className="py-2 text-slate-foreground text-right rounded-r-lg">
                                PR
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {bestEfforts.map((e) => (
                              <TableRow key={e.id} className="hover:bg-slate-50">
                                <TableCell className="text-sm text-slate-700 font-medium">
                                  {e.name}
                                </TableCell>
                                <TableCell className="text-right">
                                  <span className="font-mono tabular-nums text-sm text-slate-700">
                                    {e.elapsed_time_sec ? fmtDuration(e.elapsed_time_sec) : '—'}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  {e.pr_rank === 1 ? (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                      <Trophy className="size-3" aria-hidden="true" />
                                      PR
                                    </span>
                                  ) : e.pr_rank != null ? (
                                    <span className="text-xs text-slate-400">#{e.pr_rank}</span>
                                  ) : (
                                    <span className="text-xs text-slate-300">—</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}

                  {/* Laps */}
                  {laps.length > 0 && (
                    <div>
                      <SectionLabel>Laps</SectionLabel>
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
                              {hasLapsHr && (
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
                            {laps.map((l) => {
                              const lapPaceSec =
                                l.moving_time_sec > 0 && l.distance_m > 0
                                  ? Math.round(l.moving_time_sec / (l.distance_m / 1000))
                                  : null
                              return (
                                <TableRow key={l.id} className="hover:bg-slate-50">
                                  <TableCell className="text-xs text-slate-400 font-medium">
                                    {l.lap_index}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <span className="font-mono tabular-nums text-sm text-slate-700">
                                      {l.distance_m
                                        ? `${(l.distance_m / 1000).toFixed(2)} km`
                                        : '—'}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <span className="font-mono tabular-nums text-sm text-slate-700">
                                      {lapPaceSec ? `${fmtPace(lapPaceSec)}/km` : '—'}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <span className="font-mono tabular-nums text-sm text-slate-700">
                                      {l.moving_time_sec ? fmtDuration(l.moving_time_sec) : '—'}
                                    </span>
                                  </TableCell>
                                  {hasLapsHr && (
                                    <TableCell className="text-right">
                                      <span className="font-mono tabular-nums text-sm text-slate-700">
                                        {l.avg_hr ? `${l.avg_hr}` : '—'}
                                      </span>
                                    </TableCell>
                                  )}
                                  <TableCell className="text-right">
                                    <span className="font-mono tabular-nums text-sm text-slate-700">
                                      {l.total_elevation_gain_m != null
                                        ? `${l.total_elevation_gain_m > 0 ? '+' : ''}${Math.round(l.total_elevation_gain_m)} m`
                                        : '—'}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                  <div className="border-t border-slate-100" />
                  <StreamCharts activityId={id} zones={activity.zones} />
                  <div className="border-t border-slate-100" />
                  <HrZonesChart zones={activity.zones} />
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
                      id="editGoalBtn_activityDetailPage"
                      onClick={() => setEditGoalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-violet-600 hover:bg-violet-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 min-h-[44px]"
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
