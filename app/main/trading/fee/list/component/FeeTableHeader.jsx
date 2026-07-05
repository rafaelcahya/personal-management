import {
  CardAction,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card'
import { Receipt } from 'lucide-react'

export default function FeeTableHeader({ action }) {
  return (
    <CardHeader>
      <CardIcon icon={Receipt} />
      <div className="min-w-0 flex-1">
        <CardTitle>Fee List</CardTitle>
        <CardDescription>
          Track commissions, admin fees, and trading costs that impact your bottom line
        </CardDescription>
      </div>
      {action && <CardAction>{action}</CardAction>}
    </CardHeader>
  )
}
