'use client'

import { Gauge, Info } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'

const TOOLTIP_TEXT =
  'Composite score (0–100) from three signals: VO₂max fitness (40%), 28-day training load (30%), and longest run in the last 8 weeks (30%). Requires at least 4 qualifying runs with HR + VO₂max data.'

const TIER_COLORS = {
  Beginner: 'text-slate-400',
  Building: 'text-orange-500',
  Developing: 'text-yellow-600',
  Solid: 'text-blue-600',
  Advanced: 'text-emerald-600',
}

export default function EnduranceScoreTile({ enduranceScore }) {
  const { endurance_score, endurance_tier } = enduranceScore ?? {}

  return (
    <section id="enduranceScoreTile_dashboardPage" aria-label="Endurance Score">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Endurance Score
      </h2>
      <Card className="border border-slate-200/70 shadow-sm py-4">
        <div className="px-5 flex items-start gap-4">
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
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-slate-300 hover:text-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded shrink-0"
                  aria-label="About Endurance Score"
                >
                  <Info className="size-4" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-72 text-xs leading-relaxed">
                {TOOLTIP_TEXT}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Card>
    </section>
  )
}
