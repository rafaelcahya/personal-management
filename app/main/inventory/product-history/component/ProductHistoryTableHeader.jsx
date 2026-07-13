import {
  CardAction,
  CardDescription,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card'
import { History } from 'lucide-react'

export default function ProductHistoryTableHeader({ controls }) {
  return (
    <CardHeader layout="below" className="gap-4">
      <div className="flex gap-4">
        <CardIcon icon={History} />
        <CardHeaderContent>
          <CardTitle>Product History</CardTitle>
          <CardDescription>Track product usage and restock movement over time</CardDescription>
        </CardHeaderContent>
      </div>
      {controls && <CardAction>{controls}</CardAction>}
    </CardHeader>
  )
}
