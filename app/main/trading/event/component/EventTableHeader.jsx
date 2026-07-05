import {
  CardAction,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card'
import { Zap } from 'lucide-react'

export default function EventTableHeader({ controls }) {
  return (
    <CardHeader
      layout={controls ? 'below' : 'beside'}
      className={controls ? 'sticky top-0 z-10 gap-5' : undefined}
    >
      <div className="flex gap-2">
        <CardIcon icon={Zap} />
        <div className="min-w-0 flex-1">
          <CardTitle>Market Events</CardTitle>
          <CardDescription>
            Track political decisions, central bank announcements, and global events that impact
            your positions
          </CardDescription>
        </div>
      </div>
      {controls && <CardAction>{controls}</CardAction>}
    </CardHeader>
  )
}
