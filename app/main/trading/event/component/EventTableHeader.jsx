import {
  CardAction,
  CardDescription,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card'
import { Zap } from 'lucide-react'

export default function EventTableHeader({ controls }) {
  return (
    <CardHeader layout="below" className="gap-4">
      <div className="flex gap-4">
        <CardIcon icon={Zap} />
        <CardHeaderContent>
          <CardTitle>Market Events</CardTitle>
          <CardDescription>
            Track political decisions, central bank announcements, and global events that impact
            your positions
          </CardDescription>
        </CardHeaderContent>
      </div>
      {controls && <CardAction>{controls}</CardAction>}
    </CardHeader>
  )
}
