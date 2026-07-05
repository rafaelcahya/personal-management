'use client'

import Link from 'next/link'
import Button from '@/components/base/Button/Button'
import { Gauge, Info } from 'lucide-react'
import Card, {
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card.jsx'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/base/Tooltip/Tooltip.jsx'

const TOOLTIP_TEXT =
  'Composite score (0–100) from three signals: VO₂max fitness (40%), 28-day training load (30%), and longest run in the last 8 weeks (30%). Requires at least 4 qualifying runs with HR + VO₂max data.'

const TIER_COLORS = {
  Beginner: 'text-slate-400',
  Building: 'text-orange-500',
  Developing: 'text-yellow-600',
  Solid: 'text-blue-600',
  Advanced: 'text-emerald-600',
}

export default function EnduranceScoreTile({ enduranceScore, viewTrendHref }) {
  const { endurance_score, endurance_tier } = enduranceScore ?? {}

  return (
    <section id="enduranceScoreTile_dashboardPage" aria-label="Endurance Score">
      <Card>
        <CardHeader layout="below">
          <div className="flex gap-2">
            <CardIcon icon={Gauge} />
            <div className="min-w-0 flex-1">
              <CardTitle>Endurance Score</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Composite fitness score (0–100) from VO₂max, training load, and long run history.
              </CardDescription>
            </div>
          </div>
          <CardAction>
            {viewTrendHref && (
              <Link
                href={viewTrendHref}
                className="text-xs text-violet-600 hover:underline mt-1 inline-flex items-center gap-1"
              >
                View full trend →
              </Link>
            )}
          </CardAction>
        </CardHeader>
        <CardContent className="px-5 py-5">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-indigo-50 shrink-0 mt-0.5">
              <Gauge className="size-4 text-indigo-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              {endurance_score == null ? (
                <div>
                  <p className="text-2xl font-bold text-slate-300 tabular-nums">—</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Need at least 4 qualifying runs with HR + VO₂max data
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-800 tabular-nums">
                      {endurance_score}
                    </span>
                    <span className="text-sm text-slate-400">/ 100</span>
                  </div>
                  {endurance_tier && (
                    <p
                      className={`text-xs font-medium mt-0.5 ${TIER_COLORS[endurance_tier] ?? 'text-slate-500'}`}
                    >
                      {endurance_tier}
                    </p>
                  )}
                </div>
              )}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="About Endurance Score"
                  className="text-slate-300 hover:text-slate-500 shrink-0"
                >
                  <Info className="size-4" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-72 text-xs leading-relaxed">
                {TOOLTIP_TEXT}
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
