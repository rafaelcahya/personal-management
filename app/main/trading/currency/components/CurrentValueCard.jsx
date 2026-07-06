import Card, {
  CardContent,
  CardDescription,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card'
import { BarChart2 } from 'lucide-react'

function formatIDR(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function CurrentValueCard({ totalCurrentValue, currencyBreakdown }) {
  return (
    <Card>
      <CardHeader>
        <CardIcon icon={BarChart2} />
        <CardHeaderContent>
          <CardTitle>Current Value</CardTitle>
          <CardDescription>Based on live forex rates</CardDescription>
        </CardHeaderContent>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-2xl font-bold font-mono text-slate-900">
          {formatIDR(totalCurrentValue)}
        </p>
        <div className="space-y-2" aria-label="Currency breakdown">
          {currencyBreakdown.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{item.name}</span>
              <span className="text-slate-500 font-mono">{formatIDR(item.value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
