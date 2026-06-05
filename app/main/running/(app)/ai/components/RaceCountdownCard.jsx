'use client'

import { Trophy, Calendar } from 'lucide-react'

function daysToRace(targetDate) {
  if (!targetDate) return null
  const now = new Date()
  const target = new Date(targetDate)
  const diffMs = target.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

function extractAiNote(weeklyReview) {
  if (!weeklyReview?.content) return null
  const lines = weeklyReview.content.split('\n').filter((l) => l.trim().length > 0)
  const firstMeaningful = lines.find((l) => !l.startsWith('#') && !l.startsWith('---'))
  return firstMeaningful ?? null
}

export default function RaceCountdownCard({ upcomingRace, weeklyReview }) {
  const race = upcomingRace ?? null
  const days = daysToRace(race?.race_date)
  const aiNote = extractAiNote(weeklyReview)

  return (
    <section
      id="raceCountdownCard_aiCoachPage"
      aria-label="Upcoming race countdown"
      className="rounded-xl border border-slate-200 bg-white p-4 space-y-3"
    >
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-amber-500" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-slate-700">Upcoming Race</h2>
      </div>

      {!race ? (
        <p className="text-sm text-slate-400">
          No upcoming race set. Add a race goal to see your countdown here.
        </p>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-base font-semibold text-slate-800 truncate">
                {race.title ?? race.distance ?? 'Race'}
              </p>
              {race.race_date && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Calendar className="h-3 w-3 text-slate-400 shrink-0" aria-hidden="true" />
                  <p className="text-xs text-slate-400">
                    {new Date(race.race_date).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>

            {days != null && (
              <div
                className={`shrink-0 rounded-xl px-3 py-2 text-center ${
                  days <= 7
                    ? 'bg-red-50 border border-red-200'
                    : days <= 21
                      ? 'bg-amber-50 border border-amber-200'
                      : 'bg-emerald-50 border border-emerald-200'
                }`}
                aria-label={`${days} days until race`}
              >
                <p
                  className={`text-xl font-bold leading-none ${
                    days <= 7 ? 'text-red-600' : days <= 21 ? 'text-amber-600' : 'text-emerald-600'
                  }`}
                >
                  {days}
                </p>
                <p
                  className={`text-xs font-medium mt-0.5 ${
                    days <= 7 ? 'text-red-500' : days <= 21 ? 'text-amber-500' : 'text-emerald-500'
                  }`}
                >
                  days
                </p>
              </div>
            )}
          </div>

          {aiNote && (
            <div className="rounded-lg border border-violet-100 bg-violet-50/50 p-3">
              <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-1">
                AI Note
              </p>
              <p className="text-sm text-slate-600 leading-relaxed italic">{aiNote}</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
