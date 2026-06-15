'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Trophy,
  Footprints,
  Zap,
  Timer,
  Map as MapIcon,
  Heart,
  Activity,
  Wind,
  Flame,
  Pencil,
  Loader2,
  Calendar,
  NotebookText,
  CloudSun,
  Navigation,
  ChevronLeft,
  Thermometer,
  Gauge,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart2,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  fetchActivity,
  getDashboard,
  updateActivity,
  fetchRaceLog,
  fetchSubjectiveHealthByDate,
  fetchActivityStreams,
  getUserProfile,
} from '@/lib/api/running'
import StreamCharts from '../components/StreamCharts'
import AIInsightCard from '../components/AIInsightCard'
import MediaCarousel from '../components/MediaCarousel'
import EditGoalModal from '../components/EditGoalModal'
import SplitsSection from '../components/SplitsSection'
import LapsTable from '../components/LapsTable'
import BestEffortsTable from '../components/BestEffortsTable'
import PerceivedEffortSection from '../components/PerceivedEffortSection'
import { getActivityCfg, tempStyle } from '../components/activityConfig'
import { StatTile, SectionLabel } from '../components/activityShared'
import { fmtDistance, fmtPace, fmtDuration, fmtDate } from '../../dashboard/utils/format'
import RacingWeightSection from '../../race-log/components/RacingWeightSection'
import PageHeader from '@/app/main/components/PageHeader'

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
  const [streams, setStreams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [nextRaceGoal, setNextRaceGoal] = useState(null)
  const [editGoalOpen, setEditGoalOpen] = useState(false)
  const [linkedRace, setLinkedRace] = useState(null)

  const [healthLog, setHealthLog] = useState(undefined)
  const [profile, setProfile] = useState(null)
  const [profileError, setProfileError] = useState(false)

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
        // getDashboard is fetched eagerly for nextRaceGoal (EditGoalModal).
        // Known: could be lazy-loaded when the modal opens — tracked as WF-2.
        const [actRes, dashRes, raceLogRes, streamsRes, profileRes] = await Promise.allSettled([
          fetchActivity(id),
          getDashboard(),
          fetchRaceLog(),
          fetchActivityStreams(id),
          getUserProfile(),
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
          if (streamsRes.status === 'fulfilled') {
            setStreams(streamsRes.value?.data ?? [])
          }
          if (profileRes.status === 'fulfilled') {
            setProfile(profileRes.value)
          } else {
            setProfileError(true)
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

          return (
            <>
              <div className="border border-slate-200/50 shadow-slate-100 rounded-xl bg-white overflow-hidden pb-6 pt-0 lg:pt-6">
                {/* Carousel: 80% of card, centered */}
                <div className="w-full lg:w-4/5 mx-auto rounded-xl overflow-hidden">
                  <MediaCarousel
                    polyline={activity.summary_polyline}
                    photos={photos}
                    laps={laps}
                    bestEfforts={bestEfforts}
                    activityStartedAt={activity.started_at}
                    totalDistanceM={activity.distance_m}
                    streams={streams}
                  />
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
                        {bestEfforts
                          .filter(
                            (e) =>
                              ['1 mile', '5K', '10K', '15K', 'Half-Marathon'].includes(e.name) &&
                              e.pr_rank != null &&
                              e.pr_rank <= 5 &&
                              e.is_latest_for_rank !== false
                          )
                          .map((e) =>
                            e.pr_rank === 1 ? (
                              <span
                                key={e.name}
                                id={`pbRankChip_${e.name.replace(/\s/g, '')}_activityDetailPage`}
                                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold shrink-0"
                              >
                                <Trophy className="size-3" aria-hidden="true" />
                                #1 {e.name} all-time
                              </span>
                            ) : (
                              <span
                                key={e.name}
                                id={`pbRankChip_${e.name.replace(/\s/g, '')}_activityDetailPage`}
                                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold shrink-0"
                              >
                                #{e.pr_rank} {e.name} all-time
                              </span>
                            )
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
                        <div id="efficiencyFactor_activityDetailPage" className="relative">
                          <StatTile
                            icon={BarChart2}
                            label="Efficiency"
                            value={Number(activity.efficiency_factor).toFixed(4)}
                            unit="m/s/bpm"
                            tooltip={
                              <>
                                <p className="font-semibold mb-1">What is Efficiency Factor?</p>
                                <p>
                                  Speed per heartbeat — a measure of running economy. Higher = more
                                  efficient at the same effort.
                                </p>
                                <p className="mt-1.5 text-slate-300">
                                  Typical:{' '}
                                  <span className="text-amber-400 font-medium">0.012–0.016</span>{' '}
                                  average ·{' '}
                                  <span className="text-green-400 font-medium">&gt; 0.018</span>{' '}
                                  efficient
                                </p>
                              </>
                            }
                          />
                          {activity.efficiency_factor_30d_avg != null &&
                            (() => {
                              const ef = Number(activity.efficiency_factor)
                              const avg = Number(activity.efficiency_factor_30d_avg)
                              if (ef > avg) {
                                return (
                                  <TrendingUp
                                    id="efTrendArrow"
                                    className="size-3.5 text-green-500 absolute top-3 right-3"
                                    title={`Above your 30-day average (${avg.toFixed(4)})`}
                                    aria-hidden="true"
                                  />
                                )
                              }
                              if (ef < avg) {
                                return (
                                  <TrendingDown
                                    id="efTrendArrow"
                                    className="size-3.5 text-red-400 absolute top-3 right-3"
                                    title={`Below your 30-day average (${avg.toFixed(4)})`}
                                    aria-hidden="true"
                                  />
                                )
                              }
                              return (
                                <Minus
                                  id="efTrendArrow"
                                  className="size-3.5 text-slate-400 absolute top-3 right-3"
                                  title="Equal to your 30-day average"
                                  aria-hidden="true"
                                />
                              )
                            })()}
                        </div>
                      )}
                      {activity.elevation_gain_m > 0 && (
                        <div id="climbingIndexTile_activityDetailPage">
                          <StatTile
                            icon={TrendingUp}
                            label="Climbing Index"
                            value={
                              activity.user_weight_kg != null &&
                              activity.moving_time_sec != null &&
                              activity.moving_time_sec > 0
                                ? (
                                    (activity.user_weight_kg * 9.81 * activity.elevation_gain_m) /
                                    activity.moving_time_sec
                                  ).toFixed(2)
                                : '—'
                            }
                            unit="W/kg"
                            tooltip={
                              <>
                                <p className="font-semibold mb-1">Climbing Index (W/kg)</p>
                                <p>
                                  Power-to-weight output against gravity — how hard you worked per
                                  kg of body weight on this climb. Formula: weight × 9.81 ×
                                  elevation gain ÷ moving time.
                                </p>
                              </>
                            }
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
                            tooltip={
                              <>
                                <p className="font-semibold mb-1">Est. VO₂max</p>
                                <p>
                                  Estimated aerobic capacity using the Daniels formula (pace + HR).
                                  Not a lab measurement — best used as a trend over time, not an
                                  absolute benchmark.
                                </p>
                              </>
                            }
                          />
                        </div>
                      )}
                    </div>
                    {(activity.aerobic_decoupling == null || activity.estimated_vo2max == null) && (
                      <div id="derivedMetricsGuide_activityDetailPage" className="mt-2 space-y-1">
                        {activity.aerobic_decoupling == null && (
                          <p className="text-xs text-slate-400">
                            <span className="font-medium text-slate-500">Aerobic Decoupling</span>
                            {' — '}
                            {activity.avg_hr == null
                              ? 'requires heart rate data from a connected HR monitor.'
                              : 'requires stream data (pace + HR recorded over time). Not available for this activity.'}
                          </p>
                        )}
                        {activity.estimated_vo2max == null && (
                          <p className="text-xs text-slate-400">
                            <span className="font-medium text-slate-500">VO₂max estimate</span>
                            {' — '}
                            {!['Run', 'TrailRun', 'VirtualRun'].includes(activity.activity_type)
                              ? 'only calculated for running activities.'
                              : activity.avg_hr == null
                                ? 'requires heart rate data from a connected HR monitor.'
                                : 'could not be estimated (pace may be outside the valid calculation range).'}
                          </p>
                        )}
                      </div>
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
                              <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      id="aeroDrift_activityDetailPage"
                                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium cursor-help ${bg} ${color}`}
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
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    className="max-w-64 text-xs leading-relaxed"
                                  >
                                    <p className="font-semibold mb-1">
                                      What is Aerobic Decoupling?
                                    </p>
                                    <p>
                                      How much your pace-to-HR ratio drifts in the second half vs.
                                      first half — a sign of aerobic fatigue or insufficient base.
                                    </p>
                                    <p className="mt-1.5 text-slate-300">
                                      <span className="text-green-400 font-medium">&lt; 5%</span>{' '}
                                      Good ·{' '}
                                      <span className="text-amber-400 font-medium">5–10%</span>{' '}
                                      Moderate ·{' '}
                                      <span className="text-red-400 font-medium">&gt; 10%</span>{' '}
                                      High drift
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
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
                      <Navigation className="size-4 text-slate-400 shrink-0" aria-hidden="true" />
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
                            size="sm"
                            onClick={() => setNotesEditing(false)}
                            disabled={notesSaving}
                            className="text-violet-600 bg-white dark:bg-transparent hover:bg-violet-100 dark:hover:bg-violet-500/5 font-medium"
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

                  {['Run', 'TrailRun', 'VirtualRun'].includes(activity.activity_type) &&
                    (profileError ? (
                      <p className="text-xs text-slate-400 px-1">
                        Racing weight unavailable — could not load your profile.
                      </p>
                    ) : (
                      <RacingWeightSection
                        entry={{
                          distance_m: activity.distance_m,
                          finish_time_sec:
                            linkedRace?.finish_time_sec ??
                            activity.moving_time_sec ??
                            activity.duration_sec ??
                            null,
                        }}
                        profile={profile}
                        pageId="activityDetailPage"
                      />
                    ))}

                  <div className="border-t border-slate-100" />
                  <PerceivedEffortSection
                    activityId={id}
                    initialRpe={activity.perceived_exertion ?? null}
                    movingTimeSec={activity.moving_time_sec ?? activity.duration_sec ?? null}
                    startedAt={activity.started_at ?? null}
                  />

                  <div className="border-t border-slate-100" />
                  <div className="rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200/60 p-4">
                    <AIInsightCard activityId={id} />
                  </div>

                  <SplitsSection splits={splits} />
                  <BestEffortsTable bestEfforts={bestEfforts} />
                  <LapsTable laps={laps} />
                </div>
                <div className="w-full lg:w-3/5 mx-auto px-4 lg:px-0 flex flex-col gap-5">
                  <div className="border-t border-slate-100" />
                  <StreamCharts
                    activityId={id}
                    zones={activity.zones}
                    avgHr={activity.avg_hr ?? null}
                    historicalAvgHr={activity.historical_avg_hr ?? null}
                    maxHr={activity.max_hr ?? null}
                    userMaxHr={activity.user_max_hr ?? null}
                    restingHr={activity.user_resting_hr ?? null}
                    hrZonesMethod={activity.hr_zones_method ?? 'max_hr'}
                    thresholdHr={activity.threshold_hr ?? null}
                    thresholdPaceSec={activity.threshold_pace_sec ?? null}
                    historicalAvgCadence={activity.historical_avg_cadence ?? null}
                    maxPaceSecPerKm={activity.max_pace_sec_per_km ?? null}
                  />
                </div>
              </div>
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
