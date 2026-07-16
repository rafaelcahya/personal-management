import { cn } from '@/lib/utils'

const SIGNAL_TEXT_CLASSES = {
  BUY: 'text-success-subtle-foreground',
  HOLD: 'text-warning-subtle-foreground',
  SELL: 'text-destructive-subtle-foreground',
}

export default function RcAssessmentLabel({ label, signal, className }) {
  if (!label) return <span className="text-slate-400 text-sm">—</span>

  return (
    <span className={cn('text-sm', SIGNAL_TEXT_CLASSES[signal] ?? 'text-slate-400', className)}>
      {label}
    </span>
  )
}
