import Card, { CardContent } from '@/components/base/Card/Card.jsx'

export default function OverviewSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <Card className="border border-slate-200/70 shadow-sm py-5 gap-4">
        <CardContent className="px-5">
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-36 bg-slate-200 rounded" />
            <div className="h-3 w-60 bg-slate-100 rounded" />
          </div>
        </CardContent>
        <div className="grid grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`px-5 py-3 flex flex-col gap-2 ${i < 3 ? 'border-r border-slate-200' : ''}`}
            >
              <div className="h-3 w-20 bg-slate-200 rounded" />
              <div className="h-6 w-28 bg-slate-200 rounded" />
              <div className="h-3 w-16 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="border border-slate-200/70 shadow-sm pt-2">
        <CardContent className="px-5 pt-3 pb-5">
          <div className="flex flex-col gap-1.5 mb-5">
            <div className="h-4 w-48 bg-slate-200 rounded" />
            <div className="h-3 w-72 bg-slate-100 rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="flex justify-center">
                  <div className="w-28 h-28 bg-slate-200 rounded-full" />
                </div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex justify-between">
                      <div className="h-3 w-24 bg-slate-200 rounded" />
                      <div className="h-3 w-20 bg-slate-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
