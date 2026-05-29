'use client'

import {
  Trophy,
  Heart,
  Gauge,
  Footprints,
  Zap,
  Timer,
  Map as MapIcon,
  Activity,
  Wind,
  Flame,
  Smartphone,
  Thermometer,
  TrendingUp,
  BarChart2,
  CloudSun,
  Pencil,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import StreamCharts from '../../activities/components/StreamCharts'
import HrZonesChart from '../../activities/components/HrZonesChart'
import AIInsightCard from '../../activities/components/AIInsightCard'
import DistanceBreakdown from './DistanceBreakdown'
import { getActivityCfg, tempStyle } from './activityConfig'
import { StatTile, SectionLabel } from './activityShared'
import MediaCarousel from './MediaCarousel'
import HealthContext from './HealthContext'
import SplitsTable from './SplitsTable'
import BestEffortsTable from './BestEffortsTable'
import LapsTable from './LapsTable'
import { fmtDistance, fmtPace, fmtDuration, fmtDate } from '../../dashboard/utils/format'

export default function ActivitySection({
  activity,
  activityId,
  splits,
  laps,
  bestEfforts,
  photos,
  healthLog,
  onEditClick,
  entryDistanceM,
  entryFinishTimeSec,
}) {
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
      <div className="w-full lg:w-4/5 mx-auto rounded-xl overflow-hidden relative z-0 isolate">
        <MediaCarousel polyline={activity.summary_polyline} photos={photos} />
      </div>

      <div className="w-full lg:w-3/5 mx-auto px-4 lg:px-0 flex flex-col gap-5 pt-5">
        {/* Activity header */}
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${cfg.bg}`}>
            <Icon className={`size-5 ${cfg.color}`} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-slate-800 leading-snug break-words">
                  {activity.name || cfg.label || activity.activity_type}
                </h3>
              </div>
              {onEditClick && (
                <Button
                  id="editRaceBtn_raceDetailPage"
                  size="sm"
                  variant="outline"
                  onClick={onEditClick}
                  className="shrink-0 flex items-center gap-1.5"
                >
                  <Pencil className="size-3.5" aria-hidden="true" />
                  Edit
                </Button>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap mt-1">
              {activity.pr_count > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold">
                  <Trophy className="size-3" aria-hidden="true" />
                  {activity.pr_count} PR
                </span>
              )}
              {activity.achievement_count > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold">
                  <Trophy className="size-3" aria-hidden="true" />
                  {activity.achievement_count} achievements
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
              {activity.source && (
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full capitalize">
                  {activity.source}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {entryDistanceM && (
          <DistanceBreakdown
            entryDistanceM={entryDistanceM}
            entryFinishTimeSec={entryFinishTimeSec}
            activityDistanceM={activity.distance_m}
            activityMovingTimeSec={activity.moving_time_sec ?? activity.duration_sec}
            splits={splits}
            laps={laps}
          />
        )}

        {/* Activity Stats */}
        <div>
          <SectionLabel>Activity Stats</SectionLabel>
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
                elapsedDiffSec > 60 ? `Elapsed ${fmtDuration(activity.duration_sec)}` : undefined
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
            {(activity.elev_high_m != null || activity.elev_low_m != null) && (
              <StatTile
                icon={TrendingUp}
                label="Elevation Range"
                value={`↑${Math.round(activity.elev_high_m ?? 0)} ↓${Math.round(activity.elev_low_m ?? 0)}`}
                unit="m"
              />
            )}
            {activity.efficiency_factor != null && (
              <StatTile
                icon={BarChart2}
                label="Efficiency"
                value={Number(activity.efficiency_factor).toFixed(4)}
                unit="m/s/bpm"
              />
            )}
            {activity.estimated_vo2max != null && (
              <StatTile
                icon={Wind}
                label="Est. VO₂max"
                value={Number(activity.estimated_vo2max).toFixed(1)}
                unit="mL/kg/min"
              />
            )}
          </div>
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
                      title="Average air temperature recorded during the activity"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium ${ts.bg} ${ts.text}`}
                    >
                      <Thermometer className="size-4 shrink-0" aria-hidden="true" />
                      <span>{activity.avg_temp_c}°C</span>
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${ts.bg}`}>
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
                        ? { color: 'text-amber-700', bg: 'bg-amber-50', label: 'Moderate' }
                        : { color: 'text-red-700', bg: 'bg-red-50', label: 'High drift' }
                  return (
                    <div
                      title="Aerobic Decoupling (Pa:Hr): <5% = good aerobic base, 5-10% = moderate drift, >10% = high drift"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium ${bg} ${color}`}
                    >
                      <Heart className="size-4 shrink-0" aria-hidden="true" />
                      <span>
                        Decouple {val > 0 ? '+' : ''}
                        {val}%
                      </span>
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${bg}`}>
                        {label}
                      </span>
                    </div>
                  )
                })()}
            </div>
            {activity.avg_temp_c != null && (
              <p className="text-xs text-slate-400">
                Temperature reflects the average air temp recorded during the activity — sourced
                from Strava weather data or your device sensor.
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

        {/* Description */}
        {activity.description && (
          <div className="px-3 py-2.5 bg-slate-50 rounded-lg">
            <p className="text-xs font-medium text-slate-400 mb-1">Description</p>
            <p className="text-sm text-slate-600 whitespace-pre-line">{activity.description}</p>
          </div>
        )}

        {/* Weather */}
        {activity.weather_summary && (
          <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-lg">
            <CloudSun className="size-4 text-slate-400 shrink-0" aria-hidden="true" />
            <p className="text-sm text-slate-600">{activity.weather_summary}</p>
          </div>
        )}

        <HealthContext healthLog={healthLog} />

        <div className="border-t border-slate-100" />
        <div className="rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200/60 p-4">
          <AIInsightCard activityId={activityId} />
        </div>

        <SplitsTable splits={splits} />
        <BestEffortsTable bestEfforts={bestEfforts} />
        <LapsTable laps={laps} />

        <div className="border-t border-slate-100" />
        <StreamCharts activityId={activityId} zones={activity.zones} />
        <div className="border-t border-slate-100" />
        <HrZonesChart zones={activity.zones} />
      </div>
    </>
  )
}
