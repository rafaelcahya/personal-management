'use client'

import { Badge } from '@/components/base/Badge/Badge'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function ImpactBadge({ value, className = '' }) {
  if (!value) return null
  const isBullish = value === 'UP'
  return (
    <Badge
      className={`font-medium text-xs ${
        isBullish ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
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
