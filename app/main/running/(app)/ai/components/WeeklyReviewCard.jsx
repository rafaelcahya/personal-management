'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, CalendarDays } from 'lucide-react'
import { renderMarkdown } from './utils'

function getFirstTwoLines(content) {
  if (!content) return ''
  const lines = content.split('\n').filter((l) => l.trim().length > 0)
  return lines.slice(0, 2).join(' ')
}

export default function WeeklyReviewCard({ weeklyReview }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <section
      id="weeklyReviewCard_aiCoachPage"
      className="rounded-xl border border-slate-200 bg-white overflow-hidden"
      aria-label="Latest weekly review"
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-200"
        aria-expanded={expanded}
        aria-controls="weeklyReviewCardBody_aiCoachPage"
      >
        <div className="flex items-center gap-2 min-w-0">
          <CalendarDays className="h-4 w-4 text-violet-500 shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-700">Weekly Review</p>
            {!expanded && weeklyReview?.content && (
              <p className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
                {getFirstTwoLines(weeklyReview.content)}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {weeklyReview?.created_at && (
            <p className="text-xs text-slate-400 hidden sm:block">
              {new Date(weeklyReview.created_at).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          )}
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-slate-400" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
          )}
        </div>
      </button>

      {!weeklyReview && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100">
          <p className="text-sm text-slate-400">
            No weekly review available yet. Reviews are generated automatically every Sunday.
          </p>
        </div>
      )}

      {expanded && weeklyReview && (
        <div
          id="weeklyReviewCardBody_aiCoachPage"
          className="px-4 pb-4 pt-3 border-t border-slate-100"
        >
          {weeklyReview.created_at && (
            <p className="text-xs text-slate-400 mb-3 sm:hidden">
              {new Date(weeklyReview.created_at).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
          {renderMarkdown(weeklyReview.content)}
        </div>
      )}
    </section>
  )
}
