'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, CalendarClock, Clock, MapPin } from 'lucide-react'
import { parseInline } from './utils'

function isStale(createdAt) {
  if (!createdAt) return false
  return Date.now() - new Date(createdAt).getTime() > 7 * 24 * 60 * 60 * 1000
}

function getWeekStart() {
  const now = new Date()
  const day = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((day + 6) % 7))
  monday.setHours(0, 0, 0, 0)
  return monday.toISOString().split('T')[0]
}

function isCurrentWeek(insight) {
  if (!insight?.data_refs?.week_start) return false
  return insight.data_refs.week_start === getWeekStart()
}

function parseContent(content) {
  if (!content) return null
  try {
    const json = content.match(/\{[\s\S]*\}/)
    return json ? JSON.parse(json[0]) : null
  } catch {
    return null
  }
}

function DualRoleBlock({ section, label }) {
  if (!section) return null
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      )}
      <div className="rounded-lg bg-violet-50 border border-violet-100 px-3 py-2.5">
        <p className="text-xs font-semibold text-violet-600 mb-1">Running Coach</p>
        <p className="text-sm text-slate-700">{parseInline(section.running_coach)}</p>
      </div>
      <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5">
        <p className="text-xs font-semibold text-blue-600 mb-1">Performance Analyst</p>
        <p className="text-sm text-slate-700">{parseInline(section.performance_analyst)}</p>
      </div>
      {section.summary && (
        <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
          <p className="text-xs font-semibold text-slate-500 mb-0.5">Takeaway</p>
          <p className="text-sm text-slate-600">{parseInline(section.summary)}</p>
        </div>
      )}
    </div>
  )
}

function SessionBlock({ session, day }) {
  if (!session) return null
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{day}</p>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
          {session.target_zone}
        </span>
      </div>
      <p className="text-sm font-medium text-slate-800">{session.session_type}</p>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        {session.duration_min && (
          <span className="flex items-center gap-1">
            <Clock className="size-3 shrink-0" aria-hidden="true" />
            {session.duration_min} min
          </span>
        )}
        {session.timing && (
          <span className="flex items-center gap-1">
            <MapPin className="size-3 shrink-0" aria-hidden="true" />
            {session.timing}
          </span>
        )}
      </div>
      {session.rationale && (
        <p className="text-xs text-slate-500 leading-relaxed">{session.rationale}</p>
      )}
    </div>
  )
}

export default function FridayPrepCard({ fridayPrep }) {
  const [expanded, setExpanded] = useState(false)

  const hasCurrentWeek = fridayPrep && isCurrentWeek(fridayPrep)
  const parsed = hasCurrentWeek ? parseContent(fridayPrep.content) : null
  const stale = hasCurrentWeek ? isStale(fridayPrep.created_at) : false

  return (
    <section
      id="fridayPrepCard_aiCoachPage"
      className="rounded-xl border border-slate-200 bg-white overflow-hidden"
      aria-label="Weekend training plan"
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-200"
        aria-expanded={expanded}
        aria-controls="fridayPrepCardBody_aiCoachPage"
      >
        <div className="flex items-center gap-2 min-w-0">
          <CalendarClock className="h-4 w-4 text-violet-500 shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-700">Weekend Training Plan</p>
            {!expanded && hasCurrentWeek && parsed?.weekend_plan?.summary && (
              <p className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
                {parsed.weekend_plan.summary}
              </p>
            )}
            {!hasCurrentWeek && (
              <p className="text-xs text-slate-400 mt-0.5">Generated every Friday at 3 PM</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {stale && <span className="text-xs text-amber-500 hidden sm:block">Last week</span>}
          {hasCurrentWeek && fridayPrep.created_at && (
            <p className="text-xs text-slate-400 hidden sm:block">
              {new Date(fridayPrep.created_at).toLocaleDateString('en-US', {
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

      {!hasCurrentWeek && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100">
          <p className="text-sm text-slate-400">
            No weekend plan yet. Plans are generated automatically every Friday at 3 PM.
          </p>
        </div>
      )}

      {expanded && hasCurrentWeek && (
        <div
          id="fridayPrepCardBody_aiCoachPage"
          className="px-4 pb-5 pt-3 border-t border-slate-100 flex flex-col gap-5"
        >
          {stale && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              This plan was generated last week — a fresh plan will appear next Friday.
            </p>
          )}

          {parsed ? (
            <>
              <DualRoleBlock section={parsed.weekend_plan} label="Weekend Overview" />

              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Sessions
                </p>
                <SessionBlock session={parsed.saturday} day="Saturday" />
                <SessionBlock session={parsed.sunday} day="Sunday" />
              </div>

              <DualRoleBlock section={parsed.load_check} label="Load Check" />
              <DualRoleBlock section={parsed.readiness} label="Readiness" />
            </>
          ) : (
            <p className="text-sm text-slate-400">
              Could not parse this week&apos;s plan. A new one will be generated next Friday.
            </p>
          )}
        </div>
      )}
    </section>
  )
}
