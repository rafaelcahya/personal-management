'use client'

export default function RiskGauge({ comment, timesToZero }) {
  return (
    <div className="space-y-4">
      {/* Risk Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg border border-slate-200 bg-white">
          <p className="text-xs text-slate-500 mb-1">Volatility</p>
          <p className="text-lg font-bold text-slate-700">{comment}</p>
        </div>
        <div className="p-3 rounded-lg border border-slate-200 bg-white">
          <p className="text-xs text-slate-500 mb-1">Buffer</p>
          <p className="text-lg font-bold text-violet-600">{timesToZero}x</p>
        </div>
      </div>

      {/* Info Text */}
      <div className="p-4 bg-white rounded-lg border border-slate-200">
        <p className="text-xs text-slate-600">
          💡 <span className="font-semibold">Risk Assessment:</span> Your portfolio can sustain
          approximately <span className="font-bold text-violet-600">{timesToZero}</span> consecutive
          losing trades before depleting capital, assuming average loss with margin of error.
        </p>
      </div>
    </div>
  )
}
