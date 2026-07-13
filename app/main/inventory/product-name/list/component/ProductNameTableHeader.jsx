import {
  CardAction,
  CardDescription,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card'
import { FileText } from 'lucide-react'

export default function ProductNameTableHeader({ controls }) {
  return (
    <CardHeader layout="below" className="gap-4">
      <div className="flex gap-4">
        <CardIcon icon={FileText} />
        <CardHeaderContent>
          <CardTitle>Product Names</CardTitle>
          <CardDescription>
            Manage product name statuses and notes for your inventory
          </CardDescription>
        </CardHeaderContent>
      </div>
      {controls && <CardAction>{controls}</CardAction>}
    </CardHeader>
  )
}
