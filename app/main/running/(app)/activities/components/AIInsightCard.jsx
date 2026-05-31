'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Sparkles,
  Loader2,
  Zap,
  Heart,
  Trophy,
  Footprints,
  BookOpen,
  Activity,
  BarChart2,
  GitCompare,
  ChevronsUpDown,
  X,
  Pencil,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { fetchActivityInsight, requestInsightGeneration, fetchActivities } from '@/lib/api/running'

const FOCUS_BUTTONS = [
  { focus: 'performance', label: 'Performance & Pace', icon: Zap },
  { focus: 'recovery', label: 'Recovery & Load', icon: Heart },
  { focus: 'next_race', label: 'Race Tips', icon: Trophy },
  { focus: 'next_training', label: 'Next Training', icon: Footprints },
]

const FOLLOWUP_BUTTONS = [
  { focus: 'detail_training', label: 'Training Plan', icon: BookOpen },
  { focus: 'zone_analysis', label: 'HR Zone Analysis', icon: Activity },
  { focus: 'compare_baseline', label: 'Compare Baseline', icon: BarChart2 },
]

const FOCUS_LABELS = {
  general: 'General',
  performance: 'Performance & Pace',
  recovery: 'Recovery & Load',
  next_race: 'Race Tips',
  next_training: 'Next Training',
  detail_training: 'Training Plan',
  zone_analysis: 'HR Zone Analysis',
  compare_baseline: 'Compare Baseline',
  compare_activity: 'Activity Comparison',
}

const PENDING_STATUS_COPY = [
  { maxSec: 5, text: 'Reading your run data...' },
  { maxSec: 15, text: 'Analyzing pace, HR zones, and splits...' },
  { maxSec: 30, text: 'Writing your coaching insights...' },
  { maxSec: Infinity, text: 'Almost done — final touches...' },
]

function getPendingStatusCopy(elapsedSec) {
  return (
    PENDING_STATUS_COPY.find((s) => elapsedSec < s.maxSec)?.text ?? 'Almost done — final touches...'
  )
}

function fmtDistance(m) {
  if (!m) return null
  return `${(m / 1000).toFixed(1)} km`
}

function fmtPace(secPerKm) {
  if (!secPerKm || secPerKm <= 0) return null
  const min = Math.floor(secPerKm / 60)
  const sec = String(secPerKm % 60).padStart(2, '0')
  return `${min}:${sec}/km`
}

function groupActivitiesByMonth(activities) {
  const groups = {}
  for (const a of activities) {
    const d = new Date(a.started_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    if (!groups[key]) groups[key] = { label, items: [] }
    groups[key].items.push(a)
  }
  return Object.values(groups).sort((a, b) => (a.label < b.label ? 1 : -1))
}

function parseInline(text) {
  if (typeof text !== 'string') return text
  const result = []
  let remaining = text
  let key = 0
  while (remaining.length > 0) {
    const start = remaining.indexOf('**')
    if (start === -1) {
      result.push(remaining)
      break
    }
    if (start > 0) result.push(remaining.slice(0, start))
    const end = remaining.indexOf('**', start + 2)
    if (end === -1) {
      result.push(remaining.slice(start))
      break
    }
    result.push(
      <strong key={key++} className="font-semibold text-slate-700">
        {remaining.slice(start + 2, end)}
      </strong>
    )
    remaining = remaining.slice(end + 2)
  }
  return result
}

function renderMarkdown(content) {
  if (!content) return null

  const sections = content.split(/\n(?=## )/)

  return sections.map((section, i) => {
    const lines = section.split('\n')
    const firstLine = lines[0]
    const isHeader = firstLine.startsWith('## ')
    const header = isHeader ? firstLine.replace(/^## /, '') : null
    const bodyLines = isHeader ? lines.slice(1) : lines

    const bodyParts = []
    let listItems = []

    for (const line of bodyLines) {
      if (line.trim() === '') {
        if (listItems.length > 0) {
          bodyParts.push({ type: 'list', items: [...listItems] })
          listItems = []
        }
        continue
      }
      if (line.trim() === '---') {
        if (listItems.length > 0) {
          bodyParts.push({ type: 'list', items: [...listItems] })
          listItems = []
        }
        bodyParts.push({ type: 'hr' })
        continue
      }
      if (line.trim().startsWith('- ')) {
        listItems.push(line.trim().slice(2))
      } else {
        if (listItems.length > 0) {
          bodyParts.push({ type: 'list', items: [...listItems] })
          listItems = []
        }
        if (line.trim()) bodyParts.push({ type: 'p', text: line.trim() })
      }
    }
    if (listItems.length > 0) bodyParts.push({ type: 'list', items: listItems })

    return (
      <div key={i} className="mb-3 last:mb-0">
        {header && (
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 mt-3 mb-1.5 first:mt-0">
            {header}
          </p>
        )}
        {bodyParts.map((part, j) =>
          part.type === 'hr' ? (
            <hr key={j} className="border-slate-200 my-2" />
          ) : part.type === 'list' ? (
            <ul key={j} className="list-disc list-inside space-y-0.5 mb-1">
              {part.items.map((item, k) => (
                <li key={k} className="text-sm text-slate-600">
                  {parseInline(item)}
                </li>
              ))}
            </ul>
          ) : (
            <p key={j} className="text-sm text-slate-600 mb-1">
              {parseInline(part.text)}
            </p>
          )
        )}
      </div>
    )
  })
}

function FocusButtons({ onSelect, generating, variant = 'primary' }) {
  const buttons = variant === 'followup' ? FOLLOWUP_BUTTONS : FOCUS_BUTTONS
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible md:pb-0"
      style={{ scrollbarWidth: 'none' }}
    >
      {buttons.map(({ focus, label, icon: Icon }) => (
        <button
          key={focus}
          id={`aiInsightGenerateBtn_${focus}_activityDetailPage`}
          onClick={() => onSelect(focus)}
          disabled={generating === focus}
          className={`flex flex-shrink-0 items-center gap-1.5 px-3 py-2 md:py-1.5 rounded-full text-xs font-medium transition-colors disabled:opacity-60
            ${
              variant === 'primary'
                ? 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
        >
          {generating === focus ? (
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
          ) : (
            <Icon className="h-3 w-3" aria-hidden="true" />
          )}
          {label}
        </button>
      ))}
    </div>
  )
}

function RpeInput({ value, onChange, disabled }) {
  const pillsRef = useRef([])

  function handleKeyDown(e, idx) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      const next = (idx + 1) % 10
      onChange(next + 1)
      pillsRef.current[next]?.focus()
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = (idx - 1 + 10) % 10
      onChange(prev + 1)
      pillsRef.current[prev]?.focus()
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onChange(value === idx + 1 ? null : idx + 1)
    }
  }

  return (
    <div
      id="aiInsightRpeGroup_activityDetailPage"
      role="radiogroup"
      aria-label="Rate of Perceived Exertion, 1 to 10"
    >
      <div className="flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n, idx) => {
          const selected = value === n
          return (
            <button
              key={n}
              id={`aiInsightRpePill_${n}_activityDetailPage`}
              ref={(el) => (pillsRef.current[idx] = el)}
              role="radio"
              aria-checked={selected}
              aria-label={`RPE ${n}`}
              tabIndex={selected ? 0 : value == null && n === 1 ? 0 : -1}
              disabled={disabled}
              onClick={() => onChange(selected ? null : n)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`flex-shrink-0 min-w-[36px] h-9 rounded-full text-xs font-medium transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600
                disabled:opacity-40 disabled:pointer-events-none
                ${
                  selected
                    ? 'bg-violet-600 border border-violet-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-violet-400 hover:text-violet-600'
                }`}
            >
              {n}
            </button>
          )
        })}
      </div>
      <div className="flex justify-between mt-1" aria-hidden="true">
        <span className="text-xs text-slate-400">1 (very easy)</span>
        <span className="text-xs text-slate-400">10 (max effort)</span>
      </div>
    </div>
  )
}

function ContextZone({ rpe, onRpeChange, note, onNoteChange, disabled }) {
  const maxNote = 200
  const noteLen = note.length
  const countColor =
    noteLen >= maxNote ? 'text-red-400' : noteLen >= 180 ? 'text-amber-500' : 'text-slate-400'

  return (
    <div
      id="aiInsightContextZone_activityDetailPage"
      className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-3"
    >
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        How did this run feel?
      </p>
      <RpeInput value={rpe} onChange={onRpeChange} disabled={disabled} />
      <div className="space-y-1">
        <input
          id="aiInsightNotesInput_activityDetailPage"
          type="text"
          value={note}
          onChange={(e) => onNoteChange(e.target.value.slice(0, maxNote))}
          disabled={disabled}
          placeholder="Anything else? (e.g. tired legs, hot weather, new shoes)"
          aria-label="Additional run context"
          aria-describedby="aiInsightNotesCount_activityDetailPage"
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600
            selection:bg-violet-500 disabled:opacity-40"
        />
        <p
          id="aiInsightNotesCount_activityDetailPage"
          className={`text-xs text-right ${countColor}`}
          aria-live="polite"
        >
          {noteLen} / {maxNote}
        </p>
      </div>
    </div>
  )
}

function ContextPill({ rpe, note, onEdit }) {
  if (!rpe && !note) {
    return (
      <button onClick={onEdit} className="text-xs text-violet-600 hover:underline">
        Add run context
      </button>
    )
  }
  const label = [rpe ? `RPE ${rpe}` : null, note || null].filter(Boolean).join(' · ')
  return (
    <button
      id="aiInsightContextPill_activityDetailPage"
      onClick={onEdit}
      aria-label={`Run context: ${label}. Click to edit.`}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium cursor-pointer hover:bg-slate-200 transition-colors"
    >
      {label}
      <Pencil className="h-3 w-3 text-slate-400" aria-hidden="true" />
    </button>
  )
}

function ActivitySelector({ activityId, onSelect, isMobile }) {
  const [open, setOpen] = useState(false)
  const [activities, setActivities] = useState(null)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  async function handleOpen() {
    setOpen(true)
    if (!activities) {
      try {
        const data = await fetchActivities({ limit: 100, sort: 'newest' })
        setActivities((data || []).filter((a) => a.id !== activityId))
      } catch {
        setActivities([])
      }
    }
  }

  function handleSelect(activity) {
    setSelected(activity)
    setOpen(false)
    onSelect(activity)
  }

  function handleRemove() {
    setSelected(null)
    onSelect(null)
  }

  const filtered = (activities || []).filter((a) => {
    if (!search) return true
    const date = new Date(a.started_at).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    const name = a.name || ''
    return (
      date.toLowerCase().includes(search.toLowerCase()) ||
      name.toLowerCase().includes(search.toLowerCase())
    )
  })

  const groups = groupActivitiesByMonth(filtered)

  const selectorContent = (
    <div id="aiInsightCompareCommand_activityDetailPage" className="flex flex-col">
      <div className="p-2 border-b border-slate-100">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by date or name..."
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600"
        />
      </div>
      <ScrollArea className="max-h-64">
        {groups.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center">No matching runs found.</p>
        ) : (
          groups.map((group) => (
            <div key={group.label}>
              <p className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide bg-slate-50">
                {group.label}
              </p>
              {group.items.map((a) => {
                const date = new Date(a.started_at).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                })
                const dist = fmtDistance(a.distance_m)
                const pace = fmtPace(a.avg_pace_sec_per_km)
                return (
                  <button
                    key={a.id}
                    onClick={() => handleSelect(a)}
                    className="w-full flex justify-between gap-2 px-3 py-2 text-left hover:bg-violet-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-slate-700">{date}</span>
                    <span className="flex gap-3">
                      {dist && <span className="text-sm text-slate-500">{dist}</span>}
                      {pace && <span className="text-sm text-slate-500 tabular-nums">{pace}</span>}
                    </span>
                  </button>
                )
              })}
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  )

  if (selected) {
    const date = new Date(selected.started_at).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    const dist = fmtDistance(selected.distance_m)
    const pace = fmtPace(selected.avg_pace_sec_per_km)
    const label = [dist, pace].filter(Boolean).join(' @ ')

    return (
      <div
        id="aiInsightComparePill_activityDetailPage"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 border border-violet-200 text-violet-700 text-xs font-medium"
      >
        <span className="text-violet-400 font-normal">vs.</span>
        {date}
        {label ? ` · ${label}` : ''}
        <button
          onClick={handleRemove}
          aria-label="Remove comparison activity"
          className="ml-1 rounded-full p-0.5 hover:bg-violet-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200"
        >
          <X className="h-3 w-3" aria-hidden="true" />
        </button>
      </div>
    )
  }

  const triggerButton = (
    <Button
      id="aiInsightCompareTrigger_activityDetailPage"
      variant="outline"
      onClick={handleOpen}
      className="w-full justify-between text-slate-600 hover:border-violet-400 hover:text-violet-600 focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600"
    >
      <span className="flex items-center gap-2">
        <GitCompare className="h-4 w-4 text-slate-400" aria-hidden="true" />
        Compare with another run
      </span>
      <ChevronsUpDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
    </Button>
  )

  if (isMobile) {
    return (
      <>
        {triggerButton}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            id="aiInsightCompareSheet_activityDetailPage"
            side="bottom"
            className="max-h-[70vh]"
          >
            <SheetHeader>
              <SheetTitle>Compare with another run</SheetTitle>
            </SheetHeader>
            {selectorContent}
          </SheetContent>
        </Sheet>
      </>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent
        id="aiInsightComparePopover_activityDetailPage"
        className="w-72 p-0"
        align="start"
      >
        {selectorContent}
      </PopoverContent>
    </Popover>
  )
}

export default function AIInsightCard({
  activityId,
  initialPerceivedEffort = null,
  initialUserNote = null,
}) {
  const [insight, setInsight] = useState(undefined)
  const [loadError, setLoadError] = useState(false)
  const [generating, setGenerating] = useState(null)
  const [generateError, setGenerateError] = useState(false)
  const [rpe, setRpe] = useState(initialPerceivedEffort)
  const [note, setNote] = useState(initialUserNote ?? '')
  const [contextExpanded, setContextExpanded] = useState(true)
  const [compareActivity, setCompareActivity] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [pendingElapsed, setPendingElapsed] = useState(0)
  const [longWait, setLongWait] = useState(false)
  const pollRef = useRef(null)
  const pollCountRef = useRef(0)
  const baselineIdRef = useRef(null)
  const pendingStartRef = useRef(null)
  const pendingTimerRef = useRef(null)
  const longWaitTimerRef = useRef(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const loadInsight = useCallback(async () => {
    setLoadError(false)
    try {
      const data = await fetchActivityInsight(activityId)
      setInsight(data)
      return data
    } catch {
      setLoadError(true)
      setInsight(null)
      return null
    }
  }, [activityId])

  useEffect(() => {
    const isPending = insight && insight.status === 'pending'
    if (!isPending) {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
      if (pendingTimerRef.current) {
        clearInterval(pendingTimerRef.current)
        pendingTimerRef.current = null
      }
      if (longWaitTimerRef.current) {
        clearTimeout(longWaitTimerRef.current)
        longWaitTimerRef.current = null
      }
      setPendingElapsed(0)
      setLongWait(false)
      return
    }

    if (!pendingStartRef.current) pendingStartRef.current = Date.now()
    if (!pendingTimerRef.current) {
      pendingTimerRef.current = setInterval(() => {
        setPendingElapsed(Math.floor((Date.now() - pendingStartRef.current) / 1000))
      }, 1000)
    }
    if (!longWaitTimerRef.current) {
      longWaitTimerRef.current = setTimeout(() => setLongWait(true), 60000)
    }

    if (pollRef.current) return
    pollCountRef.current = 0
    pollRef.current = setInterval(async () => {
      pollCountRef.current += 1
      const data = await fetchActivityInsight(activityId).catch(() => null)
      const isNewResult =
        data &&
        data.status === 'completed' &&
        data.is_valid === true &&
        data.id !== baselineIdRef.current
      const timedOut = pollCountRef.current >= 15
      if (isNewResult || timedOut) {
        setInsight(data)
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }, 8000)

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }
  }, [insight, activityId])

  useEffect(() => {
    loadInsight()
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
      if (pendingTimerRef.current) {
        clearInterval(pendingTimerRef.current)
        pendingTimerRef.current = null
      }
      if (longWaitTimerRef.current) {
        clearTimeout(longWaitTimerRef.current)
        longWaitTimerRef.current = null
      }
    }
  }, [loadInsight])

  async function handleGenerate(focus) {
    baselineIdRef.current = insight?.id ?? null
    pendingStartRef.current = null
    setGenerating(focus)
    setGenerateError(false)
    setLongWait(false)
    try {
      await requestInsightGeneration(activityId, focus, {
        perceived_effort: rpe,
        user_note: note || null,
        compare_activity_id: compareActivity?.id ?? null,
      })
      setInsight({ status: 'pending', is_valid: true })
      setContextExpanded(false)
    } catch {
      setGenerateError(true)
    } finally {
      setGenerating(null)
    }
  }

  async function handleRefresh() {
    setInsight(undefined)
    await loadInsight()
  }

  const isGenerating = generating !== null
  const isValidInsight =
    insight && insight.status === 'completed' && insight.is_valid === true && insight.content
  const currentFocus = insight?.data_refs?.focus
  const focusLabel = currentFocus ? FOCUS_LABELS[currentFocus] : null

  const isPending = !loadError && insight && insight.status === 'pending'
  const statusCopy = getPendingStatusCopy(pendingElapsed)

  return (
    <div
      id="aiInsightCard_activityDetailPage"
      className="space-y-4"
      aria-live="polite"
      aria-atomic="true"
      aria-busy={isPending}
    >
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 flex-shrink-0">
          <Sparkles className="h-4 w-4 text-violet-600" aria-hidden="true" />
        </span>
        <span className="text-base font-semibold text-slate-800">AI Coach</span>
        <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">
          BETA
        </span>
      </div>

      {/* Loading skeleton */}
      {insight === undefined && !loadError && (
        <div
          id="aiInsightLoading_activityDetailPage"
          className="space-y-3 animate-pulse motion-reduce:animate-none"
        >
          <div className="h-5 w-28 bg-violet-100 rounded-full" />
          <div className="space-y-1.5">
            <div className="h-3 bg-slate-200 rounded w-1/3" />
            <div className="h-3 bg-slate-200 rounded w-full" />
            <div className="h-3 bg-slate-200 rounded w-5/6" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3 bg-slate-200 rounded w-2/5" />
            <div className="h-3 bg-slate-200 rounded w-full" />
            <div className="h-3 bg-slate-200 rounded w-3/4" />
          </div>
        </div>
      )}

      {/* Fetch error */}
      {loadError && (
        <div id="aiInsightError_activityDetailPage" className="flex items-center gap-3">
          <p className="text-sm text-slate-400">Could not load analysis.</p>
          <Button
            id="aiInsightRetry_activityDetailPage"
            variant="ghost"
            size="sm"
            className="text-violet-600 hover:text-violet-700 px-0 h-auto font-normal"
            onClick={() => {
              setInsight(undefined)
              loadInsight()
            }}
          >
            Try again
          </Button>
        </div>
      )}

      {/* No insight yet */}
      {!loadError && insight === null && (
        <div id="aiInsightEmpty_activityDetailPage" className="space-y-3">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-violet-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-slate-500">
              Get AI-powered coaching insights for this run. Choose a focus to start.
            </p>
          </div>
          <ContextZone
            rpe={rpe}
            onRpeChange={setRpe}
            note={note}
            onNoteChange={setNote}
            disabled={isGenerating}
          />
          {generateError && (
            <p className="text-xs text-red-400">Failed to start analysis. Try again.</p>
          )}
          <FocusButtons onSelect={handleGenerate} generating={generating} variant="primary" />
        </div>
      )}

      {/* Pending / generating */}
      {isPending && (
        <div id="aiInsightPending_activityDetailPage" className="space-y-3">
          <div
            id="aiInsightPendingBar_activityDetailPage"
            className="h-1 w-full bg-violet-100 rounded-full overflow-hidden"
          >
            <div className="h-full w-1/2 bg-violet-300 rounded-full animate-pulse motion-reduce:animate-none" />
          </div>
          <p
            id="aiInsightPendingStatus_activityDetailPage"
            className="text-sm text-slate-500 italic motion-reduce:not-italic"
          >
            {statusCopy}
          </p>
          <div
            id="aiInsightPendingSkeleton_activityDetailPage"
            className="space-y-3 animate-pulse motion-reduce:animate-none"
          >
            <div className="h-5 w-28 bg-violet-100 rounded-full" />
            <div className="space-y-1.5">
              <div className="h-3 bg-slate-200 rounded w-1/3" />
              <div className="h-3 bg-slate-200 rounded w-full" />
              <div className="h-3 bg-slate-200 rounded w-5/6" />
              <div className="h-3 bg-slate-200 rounded w-4/5" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 bg-slate-200 rounded w-2/5" />
              <div className="h-3 bg-slate-200 rounded w-full" />
              <div className="h-3 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-2/3" />
            </div>
          </div>
          {longWait && (
            <div id="aiInsightLongWaitHint_activityDetailPage" className="flex items-center gap-2">
              <p className="text-xs text-slate-400">This is taking longer than usual.</p>
              <Button
                variant="ghost"
                size="sm"
                className="text-violet-600 hover:text-violet-700 px-0 h-auto font-normal text-xs"
                onClick={handleRefresh}
              >
                Try again
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Has valid insight */}
      {isValidInsight && (
        <div id="aiInsightContent_activityDetailPage" className="space-y-4">
          <div>
            {focusLabel && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-violet-100 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-full font-medium mb-3">
                {focusLabel}
              </span>
            )}
            <div className="prose-sm">{renderMarkdown(insight.content)}</div>
          </div>

          <div className="bg-white/60 border border-violet-100 rounded-lg p-3 space-y-4">
            {contextExpanded ? (
              <ContextZone
                rpe={rpe}
                onRpeChange={setRpe}
                note={note}
                onNoteChange={setNote}
                disabled={isGenerating}
              />
            ) : (
              <ContextPill rpe={rpe} note={note} onEdit={() => setContextExpanded(true)} />
            )}

            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Analyze with a different focus
              </p>
              {generateError && (
                <p className="text-xs text-red-400">Failed to start analysis. Try again.</p>
              )}
              <FocusButtons onSelect={handleGenerate} generating={generating} variant="primary" />
            </div>

            <div className="space-y-2 border-t border-violet-100 pt-3">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Ask more</p>
              <FocusButtons onSelect={handleGenerate} generating={generating} variant="followup" />
            </div>

            <div
              id="aiInsightCompareSection_activityDetailPage"
              className="space-y-2 border-t border-violet-100 pt-3"
            >
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Compare runs
              </p>
              <ActivitySelector
                activityId={activityId}
                onSelect={setCompareActivity}
                isMobile={isMobile}
              />
              {compareActivity && (
                <Button
                  id="aiInsightGetRecommendationBtn_activityDetailPage"
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white focus-visible:ring-2 focus-visible:ring-violet-200"
                  disabled={isGenerating}
                  onClick={() => handleGenerate('compare_activity')}
                >
                  {isGenerating && generating === 'compare_activity' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                      Analyzing...
                    </>
                  ) : (
                    'Get Recommendation'
                  )}
                </Button>
              )}
            </div>
          </div>

          {insight.created_at && (
            <p className="text-xs text-slate-400">
              {new Date(insight.created_at).toLocaleString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
        </div>
      )}

      {/* Completed but invalid */}
      {!loadError && insight && insight.status === 'completed' && !isValidInsight && (
        <div id="aiInsightInvalid_activityDetailPage" className="space-y-3">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-violet-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-slate-500">
              Get AI-powered coaching insights for this run. Choose a focus to start.
            </p>
          </div>
          <FocusButtons onSelect={handleGenerate} generating={generating} variant="primary" />
        </div>
      )}
    </div>
  )
}
