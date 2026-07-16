import { Badge } from '@/components/base/Badge/Badge'
import { cn } from '@/lib/utils'

const SIGNAL_CLASSES = {
  BUY: 'bg-success-subtle text-success-subtle-foreground border-transparent',
  HOLD: 'bg-warning-subtle text-warning-subtle-foreground border-transparent',
  SELL: 'bg-destructive-subtle text-destructive-subtle-foreground border-transparent',
}

export default function SignalBadge({ signal, className }) {
  if (!signal) return <span className="text-slate-300 text-xs">—</span>

  return (
    <Badge
      size="sm"
      radius="full"
      variant="outline"
      className={cn(SIGNAL_CLASSES[signal], className)}
    >
      {signal}
    </Badge>
  )
}
