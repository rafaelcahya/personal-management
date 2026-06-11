'use client'

import { useState, useEffect, useRef } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import {
  Stethoscope,
  PersonStanding,
  Microscope,
  Info,
  Loader2,
  AlertTriangle,
  X,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getInjuryCoachInsight, fetchActivities } from '@/lib/api/running'
import { renderMarkdown } from './utils'

const ROLES = [
  {
    id: 'physio',
    cardId: 'injuryPhysioCard_aiPage',
    label: 'Sports Physiotherapist',
    description: 'Movement, rehab & injury prevention',
    Icon: PersonStanding,
    placeholder: 'e.g. My left knee clicks when I climb stairs. Is this normal after a long run?',
  },
  {
    id: 'sports_medicine',
    cardId: 'injuryPhysicianCard_aiPage',
    label: 'Sports Medicine Physician',
    description: 'Diagnosis, load management & return-to-sport',
    Icon: Microscope,
    placeholder: 'e.g. I have had shin pain for 3 weeks. Should I get an X-ray or keep running?',
  },
]

const PHASES = [
  {
    id: 'acute',
    label: 'Acute',
    elementId: 'injuryPhaseAcute_aiPage',
    guide:
      '0–72 hours after injury. Expect sharp pain, swelling, and inflammation. Focus is rest, ice, and protecting the area.',
  },
  {
    id: 'subacute',
    label: 'Sub-acute',
    elementId: 'injuryPhaseSubacute_aiPage',
    guide:
      '3 days to ~6 weeks. Pain is easing and tissue is healing. Gentle movement and light rehab can begin.',
  },
  {
    id: 'recovery',
    label: 'Recovery',
    elementId: 'injuryPhaseRecovery_aiPage',
    guide:
      '6+ weeks. Rebuilding strength and mobility. Gradual return to running with progressive load.',
  },
]

const SEVERE_KEYWORDS = ['10/10', "can't walk", 'severe pain']

function containsSevereKeyword(text) {
  const lower = text.toLowerCase()
  return SEVERE_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()))
}

function fmtPace(secPerKm) {
  if (!secPerKm) return null
  const m = Math.floor(secPerKm / 60)
  const s = String(secPerKm % 60).padStart(2, '0')
  return `${m}:${s}/km`
}

function fmtDist(meters) {
  if (!meters) return null
  return `${(meters / 1000).toFixed(1)} km`
}

export default function InjuryCoachCard() {
  const [selectedRole, setSelectedRole] = useState(null)
  const [bodyPart, setBodyPart] = useState('')
  const [phase, setPhase] = useState(null)
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [escalate, setEscalate] = useState(false)
  const [emergencyBlock, setEmergencyBlock] = useState(false)

  const [selectedActivity, setSelectedActivity] = useState(null)
  const [activitySearch, setActivitySearch] = useState('')
  const [activityList, setActivityList] = useState([])
  const [activityOpen, setActivityOpen] = useState(false)
  const [activityLoading, setActivityLoading] = useState(false)
  const pickerRef = useRef(null)
  const debouncedSearch = useDebounce(activitySearch, 300)

  useEffect(() => {
    if (!activityOpen) return
    setActivityLoading(true)
    fetchActivities({ limit: 20, search: debouncedSearch || null })
      .then((res) => setActivityList(res.data ?? []))
      .catch(() => setActivityList([]))
      .finally(() => setActivityLoading(false))
  }, [activityOpen, debouncedSearch])

  useEffect(() => {
    if (!activityOpen) return
    function handleClickOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setActivityOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [activityOpen])

  const isQuestionValid = question.trim().length >= 10

  function handleQuestionChange(e) {
    const val = e.target.value
    setQuestion(val)
    setEmergencyBlock(containsSevereKeyword(val))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isQuestionValid || !selectedRole || loading || emergencyBlock) return

    setLoading(true)
    setError(null)
    setResult(null)
    setEscalate(false)

    try {
      const payload = {
        role: selectedRole,
        question: question.trim(),
        ...(bodyPart.trim() && { body_part: bodyPart.trim() }),
        ...(phase && { injuryPhase: phase }),
        ...(selectedActivity && { activity_id: selectedActivity.id }),
      }
      const response = await getInjuryCoachInsight(payload)
      setResult(response.data)
      setEscalate(response.escalate ?? false)
    } catch (err) {
      setError(err.message || 'Failed to get a response. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleRoleSelect(roleId) {
    if (selectedRole === roleId) return
    setSelectedRole(roleId)
    setResult(null)
    setError(null)
    setEscalate(false)
  }

  const activeRole = ROLES.find((r) => r.id === selectedRole)

  return (
    <section
      className="rounded-xl border border-slate-200 bg-white p-4 space-y-4"
      aria-label="Injury and Recovery AI consultation"
    >
      <div className="flex items-center gap-2">
        <span
          className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 shrink-0"
          aria-hidden="true"
        >
          <Stethoscope className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
        </span>
        <h2 className="text-sm font-semibold text-slate-700">Injury &amp; Recovery</h2>
        <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-medium">
          AI
        </span>
      </div>

      <div
        id="injuryDisclaimer_aiPage"
        role="note"
        className="flex items-start gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg"
      >
        <Info className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs text-slate-500">
          AI guidance only — not a substitute for professional medical advice.
        </p>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        role="group"
        aria-label="Select AI role"
      >
        {ROLES.map((role) => {
          const isSelected = selectedRole === role.id
          return (
            <button
              key={role.id}
              id={role.cardId}
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleRoleSelect(role.id)}
              className={`text-left rounded-lg px-3 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 min-h-[44px] ${
                isSelected
                  ? 'border-2 border-violet-400 bg-violet-50'
                  : 'border border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <role.Icon
                  className={`h-4 w-4 shrink-0 ${isSelected ? 'text-violet-600' : 'text-slate-400'}`}
                  aria-hidden="true"
                />
                <span
                  className={`text-sm font-semibold ${isSelected ? 'text-violet-700' : 'text-slate-700'}`}
                >
                  {role.label}
                </span>
              </div>
              <p className="text-xs text-slate-400 pl-6">{role.description}</p>
            </button>
          )
        })}
      </div>

      {selectedRole && (
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <div className="space-y-1">
            <label
              htmlFor="injuryBodyPartInput_aiPage"
              className="text-sm font-medium text-slate-600"
            >
              Body part <span className="text-xs text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              id="injuryBodyPartInput_aiPage"
              type="text"
              value={bodyPart}
              onChange={(e) => setBodyPart(e.target.value)}
              placeholder="e.g. left knee, right Achilles, lower back"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-600">
              Injury phase <span className="text-xs text-slate-400 font-normal">(optional)</span>
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Injury phase">
              {PHASES.map((p) => (
                <button
                  key={p.id}
                  id={p.elementId}
                  type="button"
                  aria-pressed={phase === p.id}
                  onClick={() => setPhase(phase === p.id ? null : p.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 min-h-[36px] ${
                    phase === p.id
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {phase && (
              <p className="text-xs text-slate-500 leading-relaxed">
                {PHASES.find((p2) => p2.id === phase)?.guide}
              </p>
            )}
          </div>

          <div className="space-y-1" ref={pickerRef}>
            <p className="text-sm font-medium text-slate-600">
              Activity <span className="text-xs text-slate-400 font-normal">(optional)</span>
            </p>
            {selectedActivity ? (
              <div className="flex items-center gap-2 rounded-md border border-violet-300 bg-violet-50 px-3 py-2">
                <span
                  id="injuryActivitySelectedPill_aiPage"
                  className="text-sm font-medium text-violet-700 flex-1 min-w-0 truncate"
                >
                  {new Date(selectedActivity.started_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                  })}
                  {' · '}
                  {fmtDist(selectedActivity.distance_m) ?? '—'}
                  {selectedActivity.avg_pace_sec_per_km &&
                    ` · ${fmtPace(selectedActivity.avg_pace_sec_per_km)}`}
                </span>
                <button
                  id="injuryActivityClearBtn_aiPage"
                  type="button"
                  onClick={() => setSelectedActivity(null)}
                  className="shrink-0 text-slate-400 hover:text-slate-600"
                  aria-label="Clear selected activity"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <input
                    id="injuryActivitySearch_aiPage"
                    type="text"
                    value={activitySearch}
                    onChange={(e) => setActivitySearch(e.target.value)}
                    onFocus={() => setActivityOpen(true)}
                    placeholder="Search by date or distance..."
                    className="w-full rounded-md border border-slate-200 pl-8 pr-3 py-2 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                  />
                </div>
                {activityOpen && (
                  <div
                    id="injuryActivityList_aiPage"
                    className="absolute z-50 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-md max-h-48 overflow-y-auto"
                  >
                    {activityLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                      </div>
                    ) : activityList.length === 0 ? (
                      <p className="px-3 py-3 text-xs text-slate-400">No activities found</p>
                    ) : (
                      activityList.map((a) => (
                        <button
                          key={a.id}
                          id={`injuryActivityItem_aiPage_${a.id}`}
                          type="button"
                          onClick={() => {
                            setSelectedActivity(a)
                            setActivityOpen(false)
                            setActivitySearch('')
                          }}
                          className="w-full text-left px-3 py-2.5 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                        >
                          {a.name && (
                            <p className="text-sm font-medium text-slate-700 truncate">{a.name}</p>
                          )}
                          <p className="text-xs text-slate-400 mt-0.5">
                            {new Date(a.started_at).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                            {a.distance_m && ` · ${fmtDist(a.distance_m)}`}
                            {a.avg_pace_sec_per_km && ` · ${fmtPace(a.avg_pace_sec_per_km)}`}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="injuryQuestionInput_aiPage"
              className="text-sm font-medium text-slate-600"
            >
              Your question
            </label>
            <textarea
              id="injuryQuestionInput_aiPage"
              value={question}
              onChange={handleQuestionChange}
              placeholder={activeRole?.placeholder ?? 'Describe your symptoms or ask a question...'}
              rows={3}
              required
              minLength={10}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 resize-none"
            />
          </div>

          {emergencyBlock ? (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-300 px-3 py-2"
            >
              <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-red-800 font-medium">
                Pain at this level needs immediate medical attention. Please stop training and see a
                doctor or go to an emergency clinic.
              </p>
            </div>
          ) : (
            <>
              <Button
                id="injurySubmitBtn_aiPage"
                type="submit"
                disabled={!isQuestionValid || loading}
                className="bg-violet-600 hover:bg-violet-700 text-white text-sm focus-visible:ring-2 focus-visible:ring-violet-200 min-h-[44px] w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" aria-hidden="true" />
                    Getting guidance...
                  </>
                ) : (
                  <>
                    <Stethoscope className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                    Ask {activeRole?.label ?? 'AI'}
                  </>
                )}
              </Button>
            </>
          )}
        </form>
      )}

      {loading && (
        <div
          className="space-y-2 animate-pulse motion-reduce:animate-none"
          aria-label="Loading injury coach response"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="h-3 bg-slate-200 rounded w-1/2" aria-hidden="true" />
          <div className="h-3 bg-slate-200 rounded w-full" aria-hidden="true" />
          <div className="h-3 bg-slate-200 rounded w-4/5" aria-hidden="true" />
          <div className="h-3 bg-slate-200 rounded w-3/5" aria-hidden="true" />
        </div>
      )}

      {!loading && error && (
        <div role="alert" aria-live="polite" className="text-sm text-red-500">
          {error}
        </div>
      )}

      {!loading && result && (
        <div
          id="injuryOutputCard_aiPage"
          className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3"
          aria-live="polite"
          aria-atomic="true"
        >
          {escalate && (
            <div
              id="injuryEscalateBanner_aiPage"
              role="alert"
              className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-300 px-3 py-2"
            >
              <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-red-800 font-medium">
                This situation may require in-person professional evaluation. Please consult a
                qualified healthcare provider.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              AI Response
            </p>
            {activeRole && (
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium shrink-0">
                {activeRole.label}
              </span>
            )}
          </div>

          <div className="prose-sm text-slate-700">
            {renderMarkdown(result?.content ?? result?.data?.content)}
          </div>

          <div className="flex items-start gap-2 bg-white border border-slate-200 px-3 py-2 rounded-lg">
            <Info className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-slate-500">
              AI guidance only — not a substitute for professional medical advice.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
