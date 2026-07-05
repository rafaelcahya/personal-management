import {
  CardAction,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card'
import { History } from 'lucide-react'

export default function ProductHistoryTableHeader({ controls }) {
  return (
    <CardHeader
      layout={controls ? 'below' : 'beside'}
      className={controls ? 'sticky top-0 z-10 gap-5' : undefined}
    >
      <div className="flex gap-2">
        <CardIcon icon={History} />
        <div className="min-w-0 flex-1">
          <CardTitle>Product History</CardTitle>
          <CardDescription>Track product usage and restock movement over time</CardDescription>
        </div>
      </div>
      {controls && <CardAction>{controls}</CardAction>}
    </CardHeader>
  )
}
