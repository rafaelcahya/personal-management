'use client'

export default function FeeMetricStrip({ feeCount, totalFee }) {
  if (!feeCount) return null

  return (
    <p id="feeMetricStrip_feePage" className="text-sm text-slate-400 mb-3 block" aria-live="polite">
      <span id="feeMetricStrip_count_feePage">{feeCount} fees</span>
      {' · '}
      <span id="feeMetricStrip_total_feePage">
        Total Rp {Number(totalFee).toLocaleString('id-ID')}
      </span>
    </p>
  )
}
