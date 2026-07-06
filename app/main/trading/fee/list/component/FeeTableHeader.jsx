import {
  CardAction,
  CardDescription,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card'
import { Receipt } from 'lucide-react'

export default function FeeTableHeader({ action }) {
  return (
    <CardHeader>
      <CardIcon icon={Receipt} />
      <CardHeaderContent>
        <CardTitle>Fee List</CardTitle>
        <CardDescription>
          Track commissions, admin fees, and trading costs that impact your bottom line
        </CardDescription>
      </CardHeaderContent>
      {action && <CardAction>{action}</CardAction>}
    </CardHeader>
  )
}
