import {
  CardAction,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card'
import { TrendingUp } from 'lucide-react'

export default function TradeTableHeader({ controls }) {
  return (
    <CardHeader
      layout={controls ? 'below' : 'beside'}
      className={controls ? 'sticky top-0 z-10 gap-5' : undefined}
    >
      <div className="flex gap-2">
        <CardIcon icon={TrendingUp} />
        <div className="min-w-0 flex-1">
          <CardTitle>Trade Journal</CardTitle>
          <CardDescription>
            Track every buy and sell — learn from wins, improve from losses
          </CardDescription>
        </div>
      </div>
      {controls && <CardAction>{controls}</CardAction>}
    </CardHeader>
  )
}
