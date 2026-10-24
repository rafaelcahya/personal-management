import { parseGarminTime } from './matchGarminActivity'

const TYPE_MAP = {
  running: 'Run',
  trail_running: 'TrailRun',
  treadmill_running: 'Run',
  track_running: 'Run',
  virtual_run: 'VirtualRun',
}

const round = (value) =>
  value == null || !Number.isFinite(Number(value)) ? null : Math.round(Number(value))

/**
 * Builds an rt_activities row for a run that only exists in Garmin.
 * `detail` is the response of GET /activity-service/activity/{id}.
 * Returns null when the run has no usable start time, distance or duration.
 */
export function mapGarminActivityRow(userId, detail) {
  const s = detail?.summaryDTO
  if (!s) return null

  const startMs = parseGarminTime(s.startTimeGMT)
  const distanceM = Number(s.distance)
  const durationSec = round(s.elapsedDuration ?? s.duration)
  if (!Number.isFinite(startMs) || !(distanceM > 0) || !(durationSec > 0)) return null

  const typeKey = detail.activityTypeDTO?.typeKey
  const movingSec = round(s.movingDuration) ?? durationSec
  const maxSpeed = Number(s.maxSpeed)

  return {
    user_id: userId,
    source: 'garmin',
    external_id: String(detail.activityId),
    garmin_activity_id: detail.activityId,
    started_at: new Date(startMs).toISOString(),
    duration_sec: durationSec,
    moving_time_sec: movingSec,
    distance_m: Math.round(distanceM * 10) / 10,
    avg_pace_sec_per_km: movingSec > 0 ? Math.round(movingSec / (distanceM / 1000)) : null,
    max_pace_sec_per_km: maxSpeed > 0 ? Math.round(1000 / maxSpeed) : null,
    avg_hr: round(s.averageHR),
    max_hr: round(s.maxHR),
    // Strava stores cadence per leg, Garmin counts both legs
    avg_cadence: s.averageRunCadence != null ? Math.round(Number(s.averageRunCadence) / 2) : null,
    elevation_gain_m: s.elevationGain ?? null,
    elevation_loss_m: s.elevationLoss ?? null,
    elev_high_m: s.maxElevation ?? null,
    elev_low_m: s.minElevation ?? null,
    calories: round(s.calories),
    activity_type: TYPE_MAP[typeKey] ?? 'Run',
    name: detail.activityName ?? null,
    avg_watts: round(s.averagePower),
    weighted_avg_watts: round(s.normalizedPower),
    max_watts: round(s.maxPower),
    avg_temp_c: round(s.averageTemperature),
    has_heartrate: s.averageHR != null,
    trainer: typeKey === 'treadmill_running',
    manual: false,
    raw_data: { garmin: { activityId: detail.activityId, typeKey, summary: s } },
  }
}
