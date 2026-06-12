'use client'

import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function ImpactBadge({ value, className = '' }) {
  if (!value) return null
  const isBullish = value === 'UP'
  return (
    <Badge
      variant="outline"
      className={`font-medium text-xs ${
        isBullish
          ? 'bg-green-50 text-green-700 border-green-200'
          : 'bg-red-50 text-red-700 border-red-200'
      } ${className}`}
    >
      {isBullish ? (
        <TrendingUp className="h-3 w-3 mr-1" />
      ) : (
        <TrendingDown className="h-3 w-3 mr-1" />
      )}
      {isBullish ? 'Bullish' : 'Bearish'}
    </Badge>
  )
}
