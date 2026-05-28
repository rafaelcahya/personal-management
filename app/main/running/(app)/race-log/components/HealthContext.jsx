const ENERGY_LABEL = { 1: 'Very Low', 2: 'Low', 3: 'Moderate', 4: 'High', 5: 'Very High' }
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

export default function HealthContext({ healthLog }) {
  if (healthLog === undefined) return null
  return (
    <div className="px-3 py-3 bg-slate-50 rounded-lg">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
        Pre-Activity
      </p>
      {healthLog === null ? (
        <p className="text-xs text-slate-400">
          No health log for this day.{' '}
          <a href="/main/running/health" className="text-violet-500 hover:underline">
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
                  <span className="text-slate-400"> · {healthLog.sleep_quality}/10</span>
                )}
              </span>
            )}
            {healthLog.morning_energy != null && (
              <span className="text-xs text-slate-600">
                <span className="text-slate-400">Energy </span>
                <span className={`font-medium ${ENERGY_COLOR[healthLog.morning_energy] ?? ''}`}>
                  {ENERGY_LABEL[healthLog.morning_energy] ?? healthLog.morning_energy}
                </span>
              </span>
            )}
            {healthLog.mood != null && (
              <span className="text-xs text-slate-600">
                <span className="text-slate-400">Mood </span>
                <span className={`font-medium ${MOOD_COLOR[healthLog.mood] ?? ''}`}>
                  {MOOD_LABEL[healthLog.mood] ?? healthLog.mood}
                </span>
              </span>
            )}
            {healthLog.soreness_level != null && (
              <span className="text-xs text-slate-600">
                <span className="text-slate-400">Soreness </span>
                <span className="font-medium">{healthLog.soreness_level}/10</span>
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
            <p className="text-xs text-slate-500 mt-1.5 italic">{healthLog.notes}</p>
          )}
        </>
      )}
    </div>
  )
}
