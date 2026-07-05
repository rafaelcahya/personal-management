'use client'

import { Badge } from '@/components/base/Badge/Badge'
import { Info } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

export default function RatioCard({ icon, label, value, comment, threshold = 1, description }) {
  const isGood = value >= threshold

  const getColor = () => {
    if (value >= threshold * 1.5) return 'text-green-600'
    if (value >= threshold) return 'text-blue-600'
    return 'text-red-600'
  }

  const getBgColor = () => {
    if (value >= threshold * 1.5) return 'bg-green-50/70'
    if (value >= threshold) return 'bg-blue-50/70'
    return 'bg-red-50/70'
  }

  return (
    <div className={`p-3 rounded-lg border-none ${getBgColor()}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <div className={`${getColor()}`}>{icon}</div>
          <p className="text-xs font-semibold text-slate-700">{label}</p>
          {description && (
            <HoverCard>
              <HoverCardTrigger>
                <Info className="size-3 text-slate-400 hover:text-slate-600 cursor-help" />
              </HoverCardTrigger>
              <HoverCardContent className="w-56 p-2">
                <p className="text-xs text-slate-600">{description}</p>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
        <Badge variant={isGood ? 'default' : 'destructive'} className="text-xs h-5">
          {comment}
        </Badge>
      </div>
      <p className={`text-xl font-semibold ${getColor()} mb-2`}>{value}</p>
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${isGood ? 'bg-green-500' : 'bg-red-500'}`}
          style={{
            width: `${Math.min((value / threshold) * 50, 100)}%`,
          }}
        />
      </div>
    </div>
  )
}
