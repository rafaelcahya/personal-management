import Card, {
  CardContent,
  CardDescription,
  CardHeader,
  CardHeaderContent,
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
        <CardHeaderContent>
          <CardTitle>Allocation</CardTitle>
          <CardDescription>IDR invested by currency</CardDescription>
        </CardHeaderContent>
      </CardHeader>
      <CardContent>
        <AllocationChart data={data} />
      </CardContent>
    </Card>
  )
}
