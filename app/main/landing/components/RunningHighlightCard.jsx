'use client'

import { Footprints, Flame, Trophy } from 'lucide-react'
import HighlightSection from './HighlightSection'
import { fetchRunningHighlights } from '@/lib/api/home'
import { useHighlightData } from '@/hooks/useHighlightData'

function km(distanceM) {
  return (Number(distanceM) / 1000 || 0).toFixed(1)
}

function raceEta(days) {
  if (days === 0) return 'today'
  return `in ${days} ${days === 1 ? 'day' : 'days'}`
}

export default function RunningHighlightCard() {
  const { data, loading, error, reload } = useHighlightData(fetchRunningHighlights)

  const streakWeeks = data?.streak?.current_weeks ?? 0
  const bestWeeks = data?.streak?.best_weeks ?? 0
  const thisWeekCount = data?.thisWeek?.count ?? 0
  const isEmpty = data && bestWeeks === 0 && thisWeekCount === 0 && !data.nextRace

  return (
    <HighlightSection
      id="runningHighlight_homePage"
      linkId="viewLink_runningHighlight_homePage"
      retryId="retryBtn_runningHighlight_homePage"
      title="Running"
      description="Training at a glance"
      icon={Footprints}
      href="/main/running/dashboard"
      loading={loading}
      error={error}
      onRetry={reload}
    >
      {isEmpty ? (
        <p className="text-sm text-muted-foreground">No runs logged yet.</p>
      ) : data ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Flame
              className={`size-5 shrink-0 ${streakWeeks > 0 ? 'text-orange-500' : 'text-muted-foreground'}`}
              aria-hidden="true"
            />
            {streakWeeks > 0 ? (
              <span className="text-2xl font-bold text-foreground tabular-nums">
                {streakWeeks}
                <span className="text-sm font-medium text-muted-foreground">
                  {' '}
                  {streakWeeks === 1 ? 'week streak' : 'weeks streak'}
                </span>
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">No active streak</span>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground tabular-nums">{thisWeekCount}</span>{' '}
            {thisWeekCount === 1 ? 'run' : 'runs'} ·{' '}
            <span className="font-medium text-foreground tabular-nums">
              {km(data.thisWeek?.distance_m)}
            </span>{' '}
            km this week
          </p>

          <div className="flex items-center gap-2 text-xs pt-2 border-t border-border">
            <Trophy className="size-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
            {data.nextRace ? (
              <span className="text-muted-foreground">
                Next race{data.nextRace.title ? ` · ${data.nextRace.title}` : ''}{' '}
                <span className="font-medium text-foreground">
                  {raceEta(data.nextRace.days_until)}
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">No upcoming race</span>
            )}
          </div>
        </div>
      ) : null}
    </HighlightSection>
  )
}
