'use client'

function acwrColor(acwr) {
  if (acwr == null) return 'text-slate-400'
  if (acwr < 1.3) return 'text-emerald-600'
  if (acwr <= 1.5) return 'text-amber-500'
  return 'text-red-500'
}

function acwrBg(acwr) {
  if (acwr == null) return 'bg-slate-50 border-slate-200'
  if (acwr < 1.3) return 'bg-emerald-50 border-emerald-200'
  if (acwr <= 1.5) return 'bg-amber-50 border-amber-200'
  return 'bg-red-50 border-red-200'
}

function acwrLabel(acwr) {
  if (acwr == null) return 'No data'
  if (acwr < 0.8) return 'Detraining'
  if (acwr < 1.3) return 'Optimal'
  if (acwr <= 1.5) return 'Caution'
  return 'Danger zone'
}

export default function TrainingLoadTiles({ trainingLoad }) {
  const acwr = trainingLoad?.acwr ?? null
  const atl = trainingLoad?.acute_load_7d ?? null
  const ctl = trainingLoad?.chronic_load_28d ?? null

  return (
    <div
      id="trainingLoadTiles_aiCoachPage"
      className="grid grid-cols-3 gap-3"
      aria-label="Training load overview"
    >
      <div
        className={`rounded-xl border p-4 flex flex-col gap-1 ${acwrBg(acwr)}`}
        aria-label={`ACWR: ${acwr != null ? acwr.toFixed(2) : 'No data'}, ${acwrLabel(acwr)}`}
      >
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">ACWR</p>
        <p className={`text-2xl font-bold leading-none ${acwrColor(acwr)}`}>
          {acwr != null ? acwr.toFixed(2) : '—'}
        </p>
        <p className={`text-xs font-medium ${acwrColor(acwr)}`}>{acwrLabel(acwr)}</p>
      </div>

      <div
        className="rounded-xl border bg-blue-50 border-blue-200 p-4 flex flex-col gap-1"
        aria-label={`ATL (Acute Training Load, 7-day): ${atl != null ? Math.round(atl) : 'No data'}`}
      >
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">ATL · 7d</p>
        <p className="text-2xl font-bold leading-none text-blue-600">
          {atl != null ? Math.round(atl) : '—'}
        </p>
        <p className="text-xs text-blue-500 font-medium">Acute load</p>
      </div>

      <div
        className="rounded-xl border bg-violet-50 border-violet-200 p-4 flex flex-col gap-1"
        aria-label={`CTL (Chronic Training Load, 28-day): ${ctl != null ? Math.round(ctl) : 'No data'}`}
      >
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">CTL · 28d</p>
        <p className="text-2xl font-bold leading-none text-violet-600">
          {ctl != null ? Math.round(ctl) : '—'}
        </p>
        <p className="text-xs text-violet-500 font-medium">Chronic load</p>
      </div>
    </div>
  )
}
