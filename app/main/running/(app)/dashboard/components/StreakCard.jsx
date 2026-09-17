'use client'

import { Flame, AlertTriangle } from 'lucide-react'
import Card, { CardContent } from '@/components/base/Card/Card.jsx'

function weeksLabel(n) {
  return `${n} week${n === 1 ? '' : 's'}`
}

export default function StreakCard({ streak }) {
  const current = streak?.current_weeks ?? 0
  const best = streak?.best_weeks ?? 0
  const atRisk = streak?.at_risk ?? false
  const activeThisWeek = streak?.active_this_week ?? false

  const hasStreak = current > 0
  const flameColor = hasStreak
    ? atRisk
      ? 'text-warning'
      : 'text-orange-500'
    : 'text-muted-foreground'
  const flameBg = hasStreak
    ? atRisk
      ? 'bg-warning-subtle'
      : 'bg-orange-50 dark:bg-orange-950/40'
    : 'bg-muted'

  return (
    <section id="streakCard_dashboardPage" aria-label="Running streak">
      <Card>
        <CardContent className="px-5 py-5">
          <div className="flex items-center gap-4" aria-live="polite">
            <div className={`p-3 rounded-xl shrink-0 ${flameBg}`}>
              <Flame className={`size-6 ${flameColor}`} aria-hidden="true" />
            </div>

            <div className="flex-1 min-w-0">
              {hasStreak ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span
                      id="streakCurrent_dashboardPage"
                      className="text-2xl font-bold text-foreground tabular-nums"
                    >
                      {weeksLabel(current)}
                    </span>
                    <span className="text-sm text-muted-foreground">streak</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activeThisWeek ? (
                      <span className="text-success-subtle-foreground font-medium">
                        Active this week <span aria-hidden="true">✓</span>
                      </span>
                    ) : (
                      <span>Keep it alive this week</span>
                    )}
                    <span> · </span>
                    <span id="streakBest_dashboardPage">Best: {weeksLabel(best)}</span>
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold text-foreground">
                    {best > 0 ? 'Start a new streak' : 'Start your streak'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Log an activity this week to {best > 0 ? 'begin again' : 'get going'}{' '}
                    <span aria-hidden="true">🔥</span>
                    {best > 0 && (
                      <>
                        <span> · </span>
                        <span id="streakBest_dashboardPage">Best: {weeksLabel(best)}</span>
                      </>
                    )}
                  </p>
                </>
              )}
            </div>
          </div>

          {atRisk && (
            <div
              id="streakAtRisk_dashboardPage"
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-lg bg-warning-subtle border border-warning/30 px-3 py-2"
            >
              <AlertTriangle className="size-4 text-warning shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-warning-subtle-foreground">
                <span className="font-medium">Streak at risk.</span> Log an activity before the week
                ends to keep your {weeksLabel(current)} streak alive.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
