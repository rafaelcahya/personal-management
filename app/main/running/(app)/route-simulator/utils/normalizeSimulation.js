// The API returns numbers as numbers; this stays as a guard because the result view does maths on these fields.
export default function normalizeSimulation(row) {
  return {
    ...row,
    total_distance_m: Number(row.total_distance_m),
    total_elevation_gain_m: Number(row.total_elevation_gain_m),
    total_elevation_loss_m: Number(row.total_elevation_loss_m),
    effort_flat_pace_sec_per_km: Number(row.effort_flat_pace_sec_per_km),
    predicted_time_sec: Number(row.predicted_time_sec),
    suggested_time_sec: row.suggested_time_sec == null ? null : Number(row.suggested_time_sec),
  }
}
