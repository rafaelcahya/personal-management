'use client'

const OPTIMAL_BMI = {
  '5K': { min: 19, max: 23 },
  '10K': { min: 19, max: 22 },
  HM: { min: 19, max: 21 },
  FM: { min: 18.5, max: 21 },
}

function getRaceCategory(distanceM) {
  if (!distanceM) return null
  const km = distanceM / 1000
  if (km < 8) return '5K'
  if (km < 15) return '10K'
  if (km < 30) return 'HM'
  return 'FM'
}

function bmiToKg(bmi, heightM) {
  return bmi * heightM * heightM
}

export default function RacingWeightSection({ entry, profile }) {
  const { weight_kg, height_cm } = profile ?? {}

  if (!weight_kg || !height_cm) return null

  const heightM = height_cm / 100
  const currentBmi = weight_kg / (heightM * heightM)
  const category = getRaceCategory(entry?.distance_m)

  if (!category) return null

  const optimal = OPTIMAL_BMI[category]
  const optimalMinKg = bmiToKg(optimal.min, heightM)
  const optimalMaxKg = bmiToKg(optimal.max, heightM)
  const optimalMidKg = (optimalMinKg + optimalMaxKg) / 2

  const RANGE_HALF = 10
  const rangeMin = optimalMidKg - RANGE_HALF
  const rangeMax = optimalMidKg + RANGE_HALF
  const totalRange = rangeMax - rangeMin

  const clamp = (val) => Math.min(Math.max((val - rangeMin) / totalRange, 0), 1)

  const optBandLeft = clamp(optimalMinKg)
  const optBandWidth = clamp(optimalMaxKg) - optBandLeft
  const dotPos = clamp(weight_kg)

  const isInOptimalRange = weight_kg >= optimalMinKg && weight_kg <= optimalMaxKg
  const weightDelta = weight_kg - optimalMidKg

  const finishTimeSec = entry?.finish_time_sec ?? null
  const finishTimeMin = finishTimeSec ? finishTimeSec / 60 : null
  const improvementMin =
    finishTimeMin && Math.abs(weightDelta) > 0.5
      ? Math.abs(finishTimeMin * (Math.abs(weightDelta) / weight_kg))
      : null

  const CATEGORY_LABEL = { '5K': '5K', '10K': '10K', HM: 'Half Marathon', FM: 'Marathon' }

  return (
    <div
      id="racingWeightSection_raceDetailPage"
      className="flex flex-col gap-3 px-3 py-3 bg-slate-50 rounded-lg"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Racing Weight — {CATEGORY_LABEL[category]}
        </p>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            isInOptimalRange ? 'bg-violet-50 text-violet-700' : 'bg-amber-50 text-amber-700'
          }`}
        >
          {isInOptimalRange
            ? 'In optimal range'
            : weightDelta > 0
              ? 'Above optimal'
              : 'Below optimal'}
        </span>
      </div>

      {/* Range bar */}
      <div id="racingWeightBar_raceDetailPage" className="flex flex-col gap-1">
        <div className="relative h-4 rounded-full bg-slate-200 overflow-hidden">
          {/* Optimal band */}
          <div
            className="absolute h-full bg-violet-300 rounded-full"
            style={{
              left: `${optBandLeft * 100}%`,
              width: `${optBandWidth * 100}%`,
            }}
            aria-hidden="true"
          />
          {/* Current weight dot */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-4 rounded-full bg-slate-700 border-2 border-white shadow"
            style={{ left: `${dotPos * 100}%` }}
            aria-label={`Current weight ${weight_kg} kg`}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>{Math.round(rangeMin)} kg</span>
          <span>
            Optimal: {Math.round(optimalMinKg)}–{Math.round(optimalMaxKg)} kg (BMI {optimal.min}–
            {optimal.max})
          </span>
          <span>{Math.round(rangeMax)} kg</span>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Current: <span className="font-medium text-slate-700">{weight_kg} kg</span>
        {' · '}
        BMI <span className="font-medium text-slate-700">{currentBmi.toFixed(1)}</span>
      </p>

      {improvementMin != null && (
        <p
          id="racingWeightWhatIf_raceDetailPage"
          className="text-xs text-slate-400 italic border-t border-slate-200 pt-2"
        >
          Estimate: reaching optimal weight could improve your {CATEGORY_LABEL[category]} time by ~
          <span className="font-medium text-slate-600 not-italic">
            {improvementMin < 1
              ? `${Math.round(improvementMin * 60)}s`
              : `${improvementMin.toFixed(1)} min`}
          </span>{' '}
          based on your finish time. This is a rough estimate — actual results vary.
        </p>
      )}
    </div>
  )
}
