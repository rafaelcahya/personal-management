'use client'

import Link from 'next/link'
import Button from '@/components/base/Button/Button'
import { Brain, Info } from 'lucide-react'
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
  'Fitness Age compares your estimated VO₂max against population norms from the NTNU study (Nes et al. 2011). A lower Fitness Age means your cardiovascular fitness is above average for your chronological age.'

export default function FitnessAgeTile({ fitnessAge, viewTrendHref }) {
  const { fitness_age, chronological_age, sex_missing } = fitnessAge ?? {}

  function getSubLabel() {
    if (fitness_age == null || chronological_age == null) return null
    const diff = chronological_age - fitness_age
    if (diff > 0)
      return {
        text: `${diff} yr${diff > 1 ? 's' : ''} younger than your age`,
        color: 'text-green-600',
      }
    if (diff < 0)
      return {
        text: `${Math.abs(diff)} yr${Math.abs(diff) > 1 ? 's' : ''} older than your age`,
        color: 'text-red-500',
      }
    return { text: 'Same as your age', color: 'text-slate-400' }
  }

  const sub = getSubLabel()

  return (
    <section id="fitnessAgeTile_dashboardPage" aria-label="Fitness Age">
      <Card>
        <CardHeader layout="below">
          <div className="flex gap-2">
            <CardIcon icon={Brain} />
            <div>
              <CardTitle>Fitness Age</CardTitle>
              <CardDescription>
                Estimated cardiovascular age based on VO₂max population norms.
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
            <div className="p-2 rounded-lg bg-violet-50 shrink-0 mt-0.5">
              <Brain className="size-4 text-violet-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              {sex_missing ? (
                <p className="text-sm text-slate-400">
                  Set your sex in{' '}
                  <a
                    href="/main/running/settings"
                    className="text-violet-600 underline hover:no-underline"
                  >
                    Profile
                  </a>{' '}
                  to see Fitness Age
                </p>
              ) : fitness_age == null ? (
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
                      {fitness_age}
                    </span>
                    <span className="text-sm text-slate-400">yrs</span>
                  </div>
                  {sub && <p className={`text-xs font-medium mt-0.5 ${sub.color}`}>{sub.text}</p>}
                </div>
              )}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="About Fitness Age"
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
