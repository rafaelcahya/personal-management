import {
  CardAction,
  CardDescription,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card'
import { TrendingUp } from 'lucide-react'

export default function TradeTableHeader({ controls }) {
  return (
    <CardHeader layout="below" className="gap-4">
      <div className="flex gap-4">
        <CardIcon icon={TrendingUp} />
        <CardHeaderContent>
          <CardTitle>Trade Journal</CardTitle>
          <CardDescription>
            Track every buy and sell — learn from wins, improve from losses
          </CardDescription>
        </CardHeaderContent>
      </div>
      {controls && <CardAction>{controls}</CardAction>}
    </CardHeader>
  )
}
