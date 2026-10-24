export const GARMIN_METRICS_COLUMNS =
  'garmin_activity_id, matched_at, training_effect_aerobic, training_effect_anaerobic, training_effect_label, aerobic_te_message, anaerobic_te_message, avg_ground_contact_time_ms, avg_vertical_oscillation_cm, avg_vertical_ratio_pct, avg_stride_length_cm, avg_run_cadence_spm, max_run_cadence_spm, grade_adjusted_pace_sec_per_km, normalized_power_w, rpe, feel, body_battery_delta, sweat_loss_ml, avg_respiration_rate, moderate_intensity_min, vigorous_intensity_min, steps, training_load, recovery_hr, lactate_threshold_hr'

function num(value, decimals = null) {
  if (value == null || value === '') return null
  const n = Number(value)
  if (!Number.isFinite(n)) return null
  if (decimals == null) return Math.round(n)
  const factor = 10 ** decimals
  return Math.round(n * factor) / factor
}

const text = (value) => (typeof value === 'string' && value.length > 0 ? value : null)

// The watch stores RPE on a 0-100 scale (80 means 8 out of 10). 0 means "not entered".
function toRpe(directWorkoutRpe) {
  const raw = num(directWorkoutRpe)
  if (raw == null || raw <= 0) return null
  return Math.min(10, Math.max(1, Math.round(raw / 10)))
}

function toFeel(directWorkoutFeel) {
  const raw = num(directWorkoutFeel)
  return raw == null ? null : Math.min(100, Math.max(0, raw))
}

function toGapPace(avgGradeAdjustedSpeed) {
  const speed = Number(avgGradeAdjustedSpeed)
  return Number.isFinite(speed) && speed > 0 ? Math.round(1000 / speed) : null
}

/**
 * Maps the summaryDTO of GET /activity-service/activity/{id} to rt_activity_garmin_metrics columns.
 * Fields this watch does not fill stay null.
 */
export function mapGarminMetrics(summary) {
  const s = summary ?? {}
  return {
    training_effect_aerobic: num(s.trainingEffect, 1),
    training_effect_anaerobic: num(s.anaerobicTrainingEffect, 1),
    training_effect_label: text(s.trainingEffectLabel),
    aerobic_te_message: text(s.aerobicTrainingEffectMessage),
    anaerobic_te_message: text(s.anaerobicTrainingEffectMessage),
    avg_ground_contact_time_ms: num(s.groundContactTime, 1),
    avg_vertical_oscillation_cm: num(s.verticalOscillation, 2),
    avg_vertical_ratio_pct: num(s.verticalRatio, 2),
    avg_stride_length_cm: num(s.strideLength, 1),
    avg_run_cadence_spm: num(s.averageRunCadence, 1),
    max_run_cadence_spm: num(s.maxRunCadence, 1),
    grade_adjusted_pace_sec_per_km: toGapPace(s.avgGradeAdjustedSpeed),
    normalized_power_w: num(s.normalizedPower),
    rpe: toRpe(s.directWorkoutRpe),
    feel: toFeel(s.directWorkoutFeel),
    body_battery_delta: num(s.differenceBodyBattery),
    sweat_loss_ml: num(s.waterEstimated),
    avg_respiration_rate: num(s.avgRespirationRate, 1),
    moderate_intensity_min: num(s.moderateIntensityMinutes),
    vigorous_intensity_min: num(s.vigorousIntensityMinutes),
    steps: num(s.steps),
    training_load: null,
    recovery_hr: null,
    lactate_threshold_hr: null,
  }
}
