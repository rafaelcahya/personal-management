'use client'

export default function MetricRow({ label, value, format = 'text', icon, highlight = false }) {
  const formatValue = () => {
    if (format === 'currency') {
      const num = Number(value) || 0
      return `Rp ${Math.floor(num).toLocaleString('id-ID')}`
    }
    if (format === 'number') {
      return Math.floor(value || 0).toLocaleString('id-ID')
    }
    return value || '-'
  }

  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-slate-400 flex items-center gap-1">
        {icon}
        {label}
      </span>
      <span
        className={`text-sm tabular-nums ${highlight ? 'font-semibold text-slate-800' : 'font-medium text-slate-800'}`}
      >
        {formatValue()}
      </span>
    </div>
  )
}
