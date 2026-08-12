import {
  CardDescription,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card'
import { Package } from 'lucide-react'

export default function ProductTableHeader() {
  return (
    <CardHeader>
      <CardIcon icon={Package} />
      <CardHeaderContent>
        <CardTitle className="text-sm font-semibold text-slate-900">Product Inventory</CardTitle>
        <CardDescription className="text-xs text-slate-500 mt-0.5">
          Track stock levels, usage patterns, and restock timing
        </CardDescription>
      </CardHeaderContent>
    </CardHeader>
  )
}
