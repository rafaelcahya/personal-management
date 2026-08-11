import Card, { CardContent, CardHeader } from '@/components/base/Card/Card'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'

export default function InvestmentFlowSkeleton() {
  return (
    <div
      id="investmentFlowSkeleton_investmentFlowPage"
      className="space-y-4"
      aria-label="Loading investment flow tree"
    >
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
          <div className="min-w-0 flex-1 flex flex-col gap-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3" style={{ paddingLeft: (i % 2) * 24 }}>
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 flex-1 max-w-xs" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
