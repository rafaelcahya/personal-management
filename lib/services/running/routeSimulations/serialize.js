// numeric(...) columns come back from PostgREST as strings; the API contract
// (web page and mobile Run Mode) is numbers, so every response goes through here.

export const SIMULATION_COLUMNS =
  'id, name, source, source_activity_id, target_mode, target_pace_sec_per_km, target_time_sec, total_distance_m, total_elevation_gain_m, total_elevation_loss_m, effort_flat_pace_sec_per_km, predicted_time_sec, is_realistic, suggested_time_sec, elevation_profile, km_splits, ai_strategy, created_at'

export const SIMULATION_SUMMARY_COLUMNS =
  'id, name, source, target_mode, target_pace_sec_per_km, target_time_sec, total_distance_m, total_elevation_gain_m, predicted_time_sec, is_realistic, created_at'

function num(value) {
  return value == null ? null : Number(value)
}

// A pace-mode simulation stores no target time; its planned finish is the
// time the runner is aiming for, so clients always get one.
function resolveTargetTime(targetMode, targetTimeSec, predictedTimeSec) {
  if (targetMode === 'pace') return num(predictedTimeSec)
  return num(targetTimeSec)
}

export function serializeSimulationSummary(row) {
  return {
    id: row.id,
    name: row.name,
    source: row.source,
    target_mode: row.target_mode,
    target_pace_sec_per_km: num(row.target_pace_sec_per_km),
    target_time_sec: resolveTargetTime(
      row.target_mode,
      row.target_time_sec,
      row.predicted_time_sec
    ),
    total_distance_m: num(row.total_distance_m),
    total_elevation_gain_m: num(row.total_elevation_gain_m),
    predicted_time_sec: num(row.predicted_time_sec),
    is_realistic: row.is_realistic,
    created_at: row.created_at,
  }
}

/**
 * Full simulation shape shared by detail, create and preview. Preview has no
 * stored row, so id/name/created_at come back null there.
 */
export function serializeSimulation(row, extras = {}) {
  return {
    ...serializeSimulationSummary(row),
    source_activity_id: row.source_activity_id ?? null,
    total_elevation_loss_m: num(row.total_elevation_loss_m),
    effort_flat_pace_sec_per_km: num(row.effort_flat_pace_sec_per_km),
    suggested_time_sec: num(row.suggested_time_sec),
    elevation_profile: row.elevation_profile ?? [],
    km_splits: row.km_splits ?? [],
    ai_strategy: row.ai_strategy ?? null,
    hr_band: row.hr_band ?? null,
    ...extras,
  }
}
