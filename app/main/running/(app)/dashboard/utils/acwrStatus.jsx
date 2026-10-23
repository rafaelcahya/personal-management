export const ACWR_STATUS = {
  no_data: {
    label: 'No Data',
    badge: 'bg-slate-100 text-slate-500',
    guidance: null,
    tip: (
      <>
        <p className="font-semibold mb-1">No Training Data</p>
        <p>Not enough activity history to calculate your training load ratio yet.</p>
        <p className="mt-1.5 text-slate-400">
          Log at least a few runs over 2–4 weeks to see your ACWR.
        </p>
      </>
    ),
  },
  resting: {
    label: 'Rest Week',
    badge: 'bg-purple-100 text-purple-700',
    guidance: null,
    tip: (
      <>
        <p className="font-semibold mb-1">Rest Week</p>
        <p>You have training history but no activities recorded this week.</p>
        <p className="mt-1.5 text-slate-400">
          Intentional rest is part of the plan — your chronic load is still building fitness.
        </p>
      </>
    ),
  },
  low: {
    label: 'Low Load',
    badge: 'bg-blue-100 text-blue-700',
    guidance: 'Training load is low — safe to gradually increase volume or intensity.',
    tip: (
      <>
        <p className="font-semibold mb-1">Low Load (ACWR ≤ 0.8)</p>
        <p>Your current week load is well below your 28-day baseline.</p>
        <p className="mt-1.5 text-slate-400">
          Safe to gradually add volume or intensity — aim for 5–10% increase per week.
        </p>
      </>
    ),
  },
  optimal: {
    label: 'Optimal',
    badge: 'bg-green-100 text-green-700',
    guidance: null,
    tip: (
      <>
        <p className="font-semibold mb-1">Optimal Load (ACWR 0.8–1.3)</p>
        <p>
          You&apos;re training in the ideal zone — enough stimulus to improve without overloading.
        </p>
        <p className="mt-1.5 text-slate-400">
          Keep this up. This is where fitness gains happen safely.
        </p>
      </>
    ),
  },
  caution: {
    label: 'Caution',
    badge: 'bg-yellow-100 text-yellow-700',
    guidance: 'Approaching high load — avoid adding intensity this week.',
    tip: (
      <>
        <p className="font-semibold mb-1">Caution Zone (ACWR 1.3–1.5)</p>
        <p>Your load is noticeably above your baseline. Injury risk begins to rise here.</p>
        <p className="mt-1.5 text-slate-400">
          Avoid adding intensity. Stick to easy volume or active recovery this week.
        </p>
      </>
    ),
  },
  danger: {
    label: 'High Risk',
    badge: 'bg-red-100 text-red-700',
    guidance: 'High injury risk — schedule an easy day or rest before your next hard session.',
    tip: (
      <>
        <p className="font-semibold mb-1">High Risk (ACWR &gt; 1.5)</p>
        <p>Load is too high relative to your baseline. Injury risk is significantly elevated.</p>
        <p className="mt-1.5 text-slate-400">
          Prioritize rest or very easy sessions before any hard effort.
        </p>
      </>
    ),
  },
}
