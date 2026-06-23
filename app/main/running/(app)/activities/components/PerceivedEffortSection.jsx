'use client'

import { useState, useRef, useEffect } from 'react'
import { Info, ChevronDown, ChevronUp } from 'lucide-react'
import {
  Tooltip as UITooltip,
  TooltipContent as UITooltipContent,
  TooltipProvider as UITooltipProvider,
  TooltipTrigger as UITooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { updateActivity } from '@/lib/api/running'
import { RPE_LEVELS } from '@/lib/constants/running/rpe'

const BORG_CR10_COPY =
  'The Borg CR10 is a 1–10 perceived effort scale developed by Swedish psychologist Gunnar Borg. Unlike his original 6–20 scale (designed so RPE × 10 ≈ heart rate bpm), CR10 is a general effort scale that maps naturally to training zones — no heart rate estimation needed. It is the de facto standard in modern endurance apps.'

export default function PerceivedEffortSection({
  activityId,
  initialRpe,
  movingTimeSec,
  startedAt,
}) {
  const [rpe, setRpe] = useState(initialRpe ?? null)
  const [hovered, setHovered] = useState(null)
  const [guideExpanded, setGuideExpanded] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)
  const [saving, setSaving] = useState(false)

  const pillsRef = useRef([])
  const savedTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
    }
  }, [])

  const isOlderThan30Min =
    startedAt != null && Date.now() - new Date(startedAt).getTime() > 30 * 60 * 1000

  async function handlePick(value) {
    const prev = rpe
    const next = rpe === value ? null : value
    setRpe(next)
    setSaving(true)
    try {
      await updateActivity(activityId, { perceived_exertion: next })
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
      setSavedMsg(true)
      savedTimerRef.current = setTimeout(() => setSavedMsg(false), 2000)
    } catch {
      setRpe(prev)
      toast.error('Could not save effort rating. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function handleKeyDown(e, idx) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      const next = (idx + 1) % 10
      handlePick(next + 1)
      pillsRef.current[next]?.focus()
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = (idx - 1 + 10) % 10
      handlePick(prev + 1)
      pillsRef.current[prev]?.focus()
    }
  }

  const sessionLoad =
    rpe != null && movingTimeSec != null ? Math.round(rpe * (movingTimeSec / 60)) : null

  const hoveredLevel = hovered != null ? RPE_LEVELS.find((l) => l.value === hovered) : null
  const selectedLevel = rpe != null ? RPE_LEVELS.find((l) => l.value === rpe) : null
  const activeLevel = hoveredLevel ?? selectedLevel

  return (
    <div id="rpeSection_activityDetailPage" className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Perceived Effort
        </p>
        <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
          Borg CR10
        </span>
        <UITooltipProvider delayDuration={200}>
          <UITooltip>
            <UITooltipTrigger asChild>
              <button
                id="rpeInfoTrigger_activityDetailPage"
                aria-label="About the Borg CR10 scale"
                className="flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200"
              >
                <Info className="size-3.5 text-slate-400 hover:text-slate-600 transition-colors" />
              </button>
            </UITooltipTrigger>
            <UITooltipContent
              id="rpeInfoTooltip_activityDetailPage"
              side="top"
              className="max-w-72 text-xs leading-relaxed"
            >
              {BORG_CR10_COPY}
            </UITooltipContent>
          </UITooltip>
        </UITooltipProvider>
        {savedMsg && (
          <span
            id="rpeSavedMsg_activityDetailPage"
            className="text-xs text-emerald-600 font-medium ml-auto"
          >
            Saved
          </span>
        )}
      </div>

      {/* Null-state prompt */}
      {rpe === null && isOlderThan30Min && (
        <p id="rpeNullPrompt_activityDetailPage" className="text-xs text-slate-400 italic">
          How did this run feel?
        </p>
      )}

      {/* Picker */}
      <div
        role="radiogroup"
        aria-label="Rate of Perceived Exertion, 1 to 10"
        className="flex gap-1"
      >
        {RPE_LEVELS.map((level, idx) => {
          const selected = rpe === level.value
          return (
            <button
              key={level.value}
              id={`rpePicker_${level.value}_activityDetailPage`}
              ref={(el) => (pillsRef.current[idx] = el)}
              role="radio"
              aria-checked={selected}
              aria-label={`RPE ${level.value} — ${level.label}`}
              tabIndex={selected ? 0 : rpe == null && level.value === 1 ? 0 : -1}
              disabled={saving}
              onClick={() => handlePick(level.value)}
              onMouseEnter={() => setHovered(level.value)}
              onMouseLeave={() => setHovered(null)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              style={
                selected
                  ? { background: level.bg, color: level.text, borderColor: level.bg }
                  : hovered === level.value
                    ? { background: level.bgLight, borderColor: level.bg, color: level.bg }
                    : {}
              }
              className={`flex-1 min-w-0 h-9 rounded-lg text-xs font-semibold border transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200
                disabled:opacity-50 disabled:pointer-events-none
                ${selected ? '' : 'bg-white border-slate-200 text-slate-500'}`}
            >
              {level.value}
            </button>
          )
        })}
      </div>

      {/* Axis labels / active level description — single container, consistent ID */}
      <div id="rpeHoverLabel_activityDetailPage" className="min-h-[18px]">
        {activeLevel ? (
          <p className="text-xs text-slate-600">
            <span className="font-medium">
              {activeLevel.value} — {activeLevel.label}
            </span>
            {' · '}
            <span className="text-slate-400">{activeLevel.breathing}</span>
          </p>
        ) : (
          <div className="flex justify-between" aria-hidden="true">
            <span className="text-xs text-slate-400">1 (very easy)</span>
            <span className="text-xs text-slate-400">10 (max effort)</span>
          </div>
        )}
      </div>

      {/* Session Load */}
      {sessionLoad != null && (
        <UITooltipProvider delayDuration={200}>
          <UITooltip>
            <UITooltipTrigger asChild>
              <button
                id="rpeSessionLoad_activityDetailPage"
                className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 bg-violet-50 rounded-lg cursor-help focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200"
              >
                <span className="text-xs text-violet-700 font-semibold">{sessionLoad}</span>
                <span className="text-xs text-violet-500">Session Load</span>
              </button>
            </UITooltipTrigger>
            <UITooltipContent side="top" className="max-w-64 text-xs leading-relaxed">
              <p className="font-semibold mb-1">Session Load (Foster&apos;s method)</p>
              <p>
                RPE × moving time (min). Validated proxy for training load — r=0.90 vs HR-based
                TRIMP.
              </p>
            </UITooltipContent>
          </UITooltip>
        </UITooltipProvider>
      )}

      {/* Expandable guide */}
      <button
        id="rpeGuideToggle_activityDetailPage"
        onClick={() => setGuideExpanded((v) => !v)}
        className="flex items-center gap-1 self-start text-xs text-slate-400 hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
      >
        {guideExpanded ? (
          <>
            <ChevronUp className="size-3.5" aria-hidden="true" />
            Hide full guide
          </>
        ) : (
          <>
            <ChevronDown className="size-3.5" aria-hidden="true" />
            Show full guide
          </>
        )}
      </button>

      {guideExpanded && (
        <div
          id="rpeGuideTable_activityDetailPage"
          className="overflow-x-auto rounded-lg border border-slate-100"
        >
          <table className="min-w-full text-xs" aria-label="RPE guide reference">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                  RPE
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                  Label
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                  Breathing / Talk test
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                  Zone
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                  Typical use
                </th>
              </tr>
            </thead>
            <tbody>
              {RPE_LEVELS.map((level) => (
                <tr
                  key={level.value}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-3 py-2.5 font-semibold" style={{ color: level.bg }}>
                    {level.value}
                  </td>
                  <td className="px-3 py-2.5 font-semibold text-slate-900 whitespace-nowrap">
                    {level.label}
                  </td>
                  <td className="px-3 py-2.5 text-slate-500">{level.breathing}</td>
                  <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{level.zone}</td>
                  <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{level.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
