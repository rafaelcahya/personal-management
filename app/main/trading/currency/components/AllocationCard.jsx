import Card, {
  CardContent,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card'
import { DollarSign } from 'lucide-react'
import AllocationChart from './AllocationChart'

export default function AllocationCard({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardIcon icon={DollarSign} />
        <div className="min-w-0 flex-1">
          <CardTitle>Allocation</CardTitle>
          <CardDescription>IDR invested by currency</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <AllocationChart data={data} />
      </CardContent>
    </Card>
  )
}
