import {
  CardAction,
  CardDescription,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card'
import { Tag } from 'lucide-react'

export default function ProductBrandTableHeader({ controls }) {
  return (
    <CardHeader layout="below" className="gap-4">
      <div className="flex gap-4">
        <CardIcon icon={Tag} />
        <CardHeaderContent>
          <CardTitle>Product Brands</CardTitle>
          <CardDescription>Manage brand status and notes for your inventory</CardDescription>
        </CardHeaderContent>
      </div>
      {controls && <CardAction>{controls}</CardAction>}
    </CardHeader>
  )
}
