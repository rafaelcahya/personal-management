'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Sparkles, Loader2, RefreshCw, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fetchDailyInsight, generateDailyInsight, generateFollowUp } from '@/lib/api/running'
import { renderMarkdown, parseInline, parseQuickTags, stripQuickTags } from './utils'

const POLL_INTERVAL_MS = 8000
const MAX_POLLS = 15

function isTodayInsight(insight) {
  if (!insight?.created_at) return false
  const created = new Date(insight.created_at)
  const now = new Date()
  return (
    created.getFullYear() === now.getFullYear() &&
    created.getMonth() === now.getMonth() &&
    created.getDate() === now.getDate()
  )
}

const FOCUS_META = {
  taper: { label: 'Taper Mode', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  recovery: { label: 'Recovery Focus', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  motivational: { label: 'Get Back on Track', cls: 'bg-green-50 text-green-700 border-green-200' },
  general: { label: 'General Coaching', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
}

function acwrBadge(acwr) {
  if (acwr == null) return null
  const v = parseFloat(acwr).toFixed(2)
  if (acwr < 0.8) return { label: `ACWR ${v} · Undertraining`, cls: 'text-blue-600' }
  if (acwr <= 1.3) return { label: `ACWR ${v} · Optimal`, cls: 'text-emerald-600' }
  if (acwr <= 1.5) return { label: `ACWR ${v} · Elevated`, cls: 'text-amber-600' }
  return { label: `ACWR ${v} · High Load`, cls: 'text-red-600' }
}

export default function DailyInsightCard({ initialInsight, trainingLoad }) {
  const [insight, setInsight] = useState(initialInsight ?? null)
  const [loadError, setLoadError] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState(false)

  const [followUpQuestion, setFollowUpQuestion] = useState(null)
  const [followUpContent, setFollowUpContent] = useState(null)
  const [followUpLoading, setFollowUpLoading] = useState(false)
  const [followUpError, setFollowUpError] = useState(false)
  const [activeTag, setActiveTag] = useState(null)
  const [freeText, setFreeText] = useState('')

  const pollRef = useRef(null)
  const pollCountRef = useRef(0)
  const prevInsightIdRef = useRef(null)

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
    pollCountRef.current = 0
  }, [])

  const startPolling = useCallback(() => {
    if (pollRef.current) return
    pollCountRef.current = 0
    pollRef.current = setInterval(async () => {
      pollCountRef.current += 1
      try {
        const data = await fetchDailyInsight()
        const isNewCompleted =
          data &&
          data.status === 'completed' &&
          data.is_valid === true &&
          data.id !== prevInsightIdRef.current
        const timedOut = pollCountRef.current >= MAX_POLLS
        if (isNewCompleted || timedOut) {
          setInsight(data)
          stopPolling()
        }
      } catch {
        stopPolling()
        setLoadError(true)
      }
    }, POLL_INTERVAL_MS)
  }, [stopPolling])

  useEffect(() => {
    return () => stopPolling()
  }, [stopPolling])

  const isPending = insight && insight.status === 'pending'

  useEffect(() => {
    if (isPending) {
      startPolling()
    } else {
      stopPolling()
    }
  }, [isPending, startPolling, stopPolling])

  useEffect(() => {
    setFollowUpQuestion(null)
    setFollowUpContent(null)
    setFollowUpError(false)
    setActiveTag(null)
    setFreeText('')
  }, [insight?.id])

  async function handleGenerate(force = false) {
    setGenerating(true)
    setGenerateError(false)
    try {
      prevInsightIdRef.current = insight?.id ?? null
      await generateDailyInsight(force)
      setInsight({ status: 'pending' })
    } catch {
      setGenerateError(true)
    } finally {
      setGenerating(false)
    }
  }

  async function handleFollowUp(question) {
    if (!question?.trim() || !insight?.id) return
    setFollowUpQuestion(question.trim())
    setFollowUpContent(null)
    setFollowUpError(false)
    setFollowUpLoading(true)
    try {
      const res = await generateFollowUp(insight.id, question.trim())
      setFollowUpContent(res.content)
    } catch {
      setFollowUpError(true)
    } finally {
      setFollowUpLoading(false)
    }
  }

  function handleTagClick(tag) {
    setActiveTag(tag)
    setFreeText('')
    handleFollowUp(tag)
  }

  function handleFreeTextSubmit() {
    if (!freeText.trim()) return
    setActiveTag(null)
    handleFollowUp(freeText)
    setFreeText('')
  }

  const isValidInsight =
    insight &&
    insight.status === 'completed' &&
    insight.is_valid === true &&
    insight.content &&
    isTodayInsight(insight)

  const tags = isValidInsight ? parseQuickTags(insight.content) : []

  return (
    <section
      id="dailyInsightCard_aiCoachPage"
      className="rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-50 to-purple-50 p-4 space-y-3"
      aria-label="Daily insight"
      aria-live="polite"
      aria-atomic="true"
      aria-busy={isPending || generating}
    >
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-violet-100 shrink-0">
            <Sparkles className="h-3.5 w-3.5 text-violet-600" aria-hidden="true" />
          </span>
          <h2 className="text-sm font-semibold text-slate-700">Daily Insight</h2>
          <span className="text-xs bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full font-medium">
            BETA
          </span>
        </div>
      </div>

      {loadError && (
        <div className="flex items-center gap-2" role="alert">
          <p className="text-sm text-slate-400">Could not load today&apos;s insight.</p>
          <Button
            variant="ghost"
            size="sm"
            className="text-violet-600 hover:text-violet-700 px-0 h-auto font-normal text-xs"
            onClick={() => {
              setLoadError(false)
              fetchDailyInsight()
                .then(setInsight)
                .catch(() => setLoadError(true))
            }}
          >
            Try again
          </Button>
        </div>
      )}

      {!loadError && !insight && (
        <div className="space-y-2">
          <p className="text-sm text-slate-500">
            Get a personalized insight based on your recent training, health log, and goals.
          </p>
          {generateError && (
            <p className="text-xs text-red-400" role="alert">
              Failed to start analysis. Try again.
            </p>
          )}
          <Button
            id="dailyInsightGenerateBtn_aiCoachPage"
            size="sm"
            disabled={generating}
            onClick={() => handleGenerate(false)}
            className="bg-violet-600 hover:bg-violet-700 text-white text-xs h-8 focus-visible:ring-2 focus-visible:ring-violet-200"
          >
            {generating ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1.5" aria-hidden="true" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 mr-1.5" aria-hidden="true" />
                Get today&apos;s insight
              </>
            )}
          </Button>
        </div>
      )}

      {!loadError && isPending && (
        <div className="space-y-2">
          <div className="h-1 w-full bg-violet-100 rounded-full overflow-hidden" aria-hidden="true">
            <div className="h-full w-1/2 bg-violet-300 rounded-full animate-pulse motion-reduce:animate-none" />
          </div>
          <div
            className="space-y-2 animate-pulse motion-reduce:animate-none"
            aria-label="Generating daily insight"
          >
            <div className="h-3 bg-slate-200 rounded w-1/2" aria-hidden="true" />
            <div className="h-3 bg-slate-200 rounded w-full" aria-hidden="true" />
            <div className="h-3 bg-slate-200 rounded w-4/5" aria-hidden="true" />
          </div>
          <p className="text-xs text-slate-400 italic">Analyzing your training data...</p>
        </div>
      )}

      {!loadError && isValidInsight && (
        <div className="space-y-3">
          <div className="bg-white/70 rounded-lg p-3">
            {renderMarkdown(stripQuickTags(insight.content))}
          </div>

          {tags.length > 0 && (
            <div id="dailyInsightTags_aiCoachPage" className="flex flex-wrap gap-1.5">
              {tags.map((tag, i) => (
                <button
                  key={i}
                  onClick={() => handleTagClick(tag)}
                  disabled={followUpLoading}
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    activeTag === tag
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          <div id="dailyInsightAskCoach_aiCoachPage" className="flex gap-2">
            <input
              type="text"
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFreeTextSubmit()
              }}
              placeholder="Ask your coach anything..."
              disabled={followUpLoading}
              className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-violet-200 bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600 text-slate-700 placeholder:text-slate-400 selection:bg-violet-500 disabled:opacity-50 text-sm font-medium"
            />
            <Button
              id="dailyInsightAskBtn_aiCoachPage"
              size="sm"
              disabled={!freeText.trim() || followUpLoading}
              onClick={handleFreeTextSubmit}
              className="bg-violet-600 hover:bg-violet-700 text-white h-8 px-3 focus-visible:ring-2 focus-visible:ring-violet-200"
              aria-label="Ask follow-up question"
            >
              {followUpLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-3 w-3" aria-hidden="true" />
              )}
            </Button>
          </div>

          {(followUpLoading || followUpContent || followUpError) && (
            <div
              id="dailyInsightFollowUp_aiCoachPage"
              className="rounded-lg border border-violet-100 bg-white/60 p-3 space-y-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold text-violet-600 truncate">
                  &ldquo;{followUpQuestion}&rdquo;
                </p>
                {!followUpLoading && (
                  <button
                    onClick={() => {
                      setFollowUpQuestion(null)
                      setFollowUpContent(null)
                      setFollowUpError(false)
                      setActiveTag(null)
                    }}
                    className="shrink-0 text-slate-400 hover:text-slate-600"
                    aria-label="Clear follow-up"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {followUpLoading && (
                <div className="space-y-1.5 animate-pulse">
                  <div className="h-2.5 bg-slate-200 rounded w-full" />
                  <div className="h-2.5 bg-slate-200 rounded w-4/5" />
                  <div className="h-2.5 bg-slate-200 rounded w-3/5" />
                </div>
              )}

              {!followUpLoading && followUpError && (
                <p className="text-xs text-red-400" role="alert">
                  Could not get a response. Try again.
                </p>
              )}

              {!followUpLoading && followUpContent && (
                <p className="text-sm text-slate-600 leading-relaxed">
                  {parseInline(followUpContent)}
                </p>
              )}
            </div>
          )}

          {(() => {
            const focus = insight.data_refs?.focus
            const focusMeta = FOCUS_META[focus]
            const acwr = acwrBadge(trainingLoad?.acwr)
            if (!focusMeta && !acwr) return null
            return (
              <div
                id="dailyInsightContext_aiCoachPage"
                className="flex flex-wrap items-center gap-2 pt-0.5"
              >
                {focusMeta && (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${focusMeta.cls}`}
                  >
                    {focusMeta.label}
                  </span>
                )}
                {acwr && <span className={`text-xs font-medium ${acwr.cls}`}>{acwr.label}</span>}
              </div>
            )
          })()}

          <div className="flex items-center justify-between pt-1">
            {insight.created_at && (
              <p className="text-xs text-slate-400">
                {new Date(insight.created_at).toLocaleString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
            <Button
              id="dailyInsightRegenerateBtn_aiCoachPage"
              variant="ghost"
              size="sm"
              disabled={generating || isPending}
              onClick={() => handleGenerate(true)}
              className="text-violet-600 hover:text-violet-700 px-0 h-auto text-xs font-normal focus-visible:ring-2 focus-visible:ring-violet-200"
              aria-label="Regenerate daily insight"
            >
              {generating ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin mr-1" aria-hidden="true" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 mr-1" aria-hidden="true" />
                  Regenerate
                </>
              )}
            </Button>
          </div>

          {generateError && (
            <p className="text-xs text-red-400" role="alert">
              Failed to start analysis. Try again.
            </p>
          )}
        </div>
      )}

      {!loadError && insight && !isPending && !isValidInsight && (
        <div className="space-y-2">
          <p className="text-xs text-slate-400">
            No insight generated yet for today. Tap below to get one.
          </p>
          {generateError && (
            <p className="text-xs text-red-400" role="alert">
              Failed to start analysis. Try again.
            </p>
          )}
          <Button
            id="dailyInsightGenerateFromStaleBtn_aiCoachPage"
            size="sm"
            disabled={generating}
            onClick={() => handleGenerate(false)}
            className="bg-violet-600 hover:bg-violet-700 text-white text-xs h-8 focus-visible:ring-2 focus-visible:ring-violet-200"
          >
            {generating ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1.5" aria-hidden="true" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 mr-1.5" aria-hidden="true" />
                Get today&apos;s insight
              </>
            )}
          </Button>
        </div>
      )}
    </section>
  )
}
