import {
  CardAction,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card'
import { FileText } from 'lucide-react'

export default function ProductNameTableHeader({ controls }) {
  return (
    <CardHeader
      layout={controls ? 'below' : 'beside'}
      className={controls ? 'sticky top-0 z-10 gap-5' : undefined}
    >
      <div className="flex gap-2">
        <CardIcon icon={FileText} />
        <div className="min-w-0 flex-1">
          <CardTitle>Product Names</CardTitle>
          <CardDescription>
            Manage product name statuses and notes for your inventory
          </CardDescription>
        </div>
      </div>
      {controls && <CardAction>{controls}</CardAction>}
    </CardHeader>
  )
}
