'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import Button from '@/components/base/Button/Button'
import {
  ExternalLink,
  FilePenLine,
  Trash2,
  MoreHorizontal,
  Sparkles,
  RefreshCw,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { fetchEventDetail, fetchEventAnalysis } from '@/lib/api/event'
import PageHeader from '../../../components/PageHeader'
import ImpactBadge from '../component/ImpactBadge'
import UpdateEvent from '../UpdateEvent'
import DeleteEvent from '../DeleteEvent'
import EventAnalysisModal from '../component/EventAnalysisModal'

function formatEventDate(dateStr) {
  if (!dateStr) return '—'
  const datePart = String(dateStr).split('T')[0]
  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    const [y, m, d] = datePart.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function formatTimestamp(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ActualOutcomeBadge({ value }) {
  if (!value) return null
  return <ImpactBadge value={value} />
}

export default function EventDetailClient({ id }) {
  const router = useRouter()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false)
  const [cachedAnalysis, setCachedAnalysis] = useState(null)
  const [analysisLoading, setAnalysisLoading] = useState(false)

  const loadAnalysis = async () => {
    setAnalysisLoading(true)
    try {
      const data = await fetchEventAnalysis(id)
      setCachedAnalysis(data)
    } catch {
      // silent — analysis is optional
    } finally {
      setAnalysisLoading(false)
    }
  }

  const load = async () => {
    setLoading(true)
    setError(null)
    setNotFound(false)
    try {
      const data = await fetchEventDetail(id)
      if (!data || !data.event) {
        setNotFound(true)
      } else {
        setEvent(data.event)
      }
    } catch (err) {
      if (err.message?.includes('not found') || err.message?.includes('404')) {
        setNotFound(true)
      } else {
        setError('Failed to load event. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id])

  useEffect(() => {
    if (event) loadAnalysis()
  }, [event?.id])

  if (loading) {
    return (
      <div id="eventDetailLoading_eventDetailPage" className="flex flex-col gap-5 p-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div
        id="eventDetailNotFound_eventDetailPage"
        className="flex flex-col items-center justify-center py-20 gap-4"
      >
        <p className="text-xl font-semibold text-slate-700">Event not found</p>
        <p className="text-sm text-slate-500">This event may have been deleted or doesn't exist.</p>
        <Button variant="outline" onClick={() => router.push('/main/trading/event')}>
          Back to Market Events
        </Button>
      </div>
    )
  }

  if (error) {
    return (
      <div
        id="eventDetailError_eventDetailPage"
        className="flex flex-col items-center justify-center py-20 gap-4"
      >
        <p className="text-xl font-semibold text-slate-700">Something went wrong</p>
        <p className="text-sm text-slate-500">{error}</p>
        <Button variant="outline" onClick={load}>
          Retry
        </Button>
      </div>
    )
  }

  const links = Array.isArray(event.links) ? event.links : []
  const tags = Array.isArray(event.tags) ? event.tags : []
  const singleAnalysis = cachedAnalysis?.single ?? null
  const multiAnalyses = cachedAnalysis?.multi ?? []
  const hasAnyAnalysis = Boolean(singleAnalysis) || multiAnalyses.length > 0

  const AnalyzeButton = ({ className = '' }) => (
    <Button
      id="analyzeEventBtn_eventDetailPage"
      size="base"
      onClick={() => setAnalysisModalOpen(true)}
      className={`gap-1.5 bg-violet-600 hover:bg-violet-700 text-white ${className}`}
    >
      <Sparkles className="size-3.5" />
      {singleAnalysis ? 'Refresh Analysis' : 'Analyze with AI'}
    </Button>
  )

  return (
    <div id="eventDetailPage" className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: 'Trading', href: '/main/trading/dashboard' },
          { label: 'Market Events', href: '/main/trading/event' },
          { label: event.title || 'Detail' },
        ]}
      />

      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
        {/* Title + Meta row */}
        <div className="flex flex-col gap-3 px-5 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-semibold text-slate-800 leading-tight">
              {event.title || '—'}
            </h1>
            {/* Desktop: icon buttons */}
            <div className="hidden md:flex items-center gap-1 shrink-0">
              <Button
                id="editEventBtn_eventDetailPage"
                variant="ghost"
                size="icon"
                className="size-8 hover:bg-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0"
                onClick={() => setEditOpen(true)}
              >
                <FilePenLine className="size-4 text-slate-500" />
              </Button>
              <Button
                id="deleteEventBtn_eventDetailPage"
                variant="ghost"
                size="icon"
                className="size-8 hover:bg-red-50 focus-visible:ring-0 focus-visible:ring-offset-0"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="size-4 text-red-500" />
              </Button>
            </div>

            {/* Mobile: dropdown */}
            <div className="flex md:hidden shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 hover:bg-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0"
                  >
                    <MoreHorizontal className="size-4 text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setEditOpen(true)}
                    className="cursor-pointer gap-2"
                  >
                    <FilePenLine className="size-4" />
                    Edit Event
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setDeleteOpen(true)}
                    className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                    Delete Event
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <ImpactBadge value={event.impact_direction} />
            <ActualOutcomeBadge value={event.actual_outcome} />
            <span className="text-sm text-slate-500 font-medium">
              {formatEventDate(event.event_date)}
            </span>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 ml-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-violet-100 text-violet-700 text-xs font-medium rounded-md px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Body: description (left) + sidebar (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Description */}
          <div className="lg:col-span-8 p-5 lg:border-r border-slate-100">
            <div
              id="eventDescriptionBody_eventDetailPage"
              className="prose prose-sm prose-slate max-w-none min-h-[120px]"
            >
              {event.event_description ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSanitize]}
                  components={{
                    a: ({ node, ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" />
                    ),
                  }}
                >
                  {event.event_description}
                </ReactMarkdown>
              ) : (
                <p className="text-slate-400 italic text-sm">No description provided.</p>
              )}
            </div>

            {/* Mobile: Analyze button below description */}
            <div className="mt-4 flex md:hidden">
              <AnalyzeButton />
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-4 p-5 flex flex-col gap-4">
            {/* Desktop: Analyze button */}
            <div className="hidden md:flex">
              <AnalyzeButton className="w-full justify-center" />
            </div>

            {/* Reference links */}
            {links.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Reference Links
                </p>
                <div className="flex flex-col gap-2">
                  {links.map((link, i) => (
                    <a
                      key={i}
                      id={`eventLink_${i}_eventDetailPage`}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-800 transition-colors group"
                    >
                      <ExternalLink className="size-3.5 shrink-0" />
                      <span className="truncate group-hover:underline">{link.hyperlink}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Analysis panel */}
        {!analysisLoading && hasAnyAnalysis && (
          <div className="border-t border-slate-100 p-5 flex flex-col gap-4">
            {/* Single analysis */}
            {singleAnalysis && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-violet-500" /> AI Analysis
                  </p>
                  <div className="flex items-center gap-3">
                    <span
                      id="lastAnalyzedTimestamp_eventDetailPage"
                      className="text-xs text-slate-400"
                    >
                      {formatTimestamp(singleAnalysis.generated_at)}
                    </span>
                    <Button
                      id="refreshAnalysisBtn_eventDetailPage"
                      variant="outline"
                      size="base"
                      onClick={() => setAnalysisModalOpen(true)}
                      className="h-7 gap-1.5 text-xs"
                    >
                      <RefreshCw className="size-3" /> Refresh
                    </Button>
                  </div>
                </div>
                <div
                  id="eventAnalysisResult_eventDetailPage"
                  className="prose prose-sm prose-slate max-w-none"
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                    components={{
                      a: ({ node, ...props }) => (
                        <a {...props} target="_blank" rel="noopener noreferrer" />
                      ),
                    }}
                  >
                    {singleAnalysis.output_md}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* Multi-analysis references */}
            {multiAnalyses.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {multiAnalyses.map((m) => (
                  <p key={m.id} className="text-xs text-slate-500">
                    Part of a multi-event analysis on {formatTimestamp(m.generated_at)}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {analysisModalOpen && (
        <EventAnalysisModal
          open={analysisModalOpen}
          onClose={() => setAnalysisModalOpen(false)}
          analysisType="single"
          event={event}
          onAnalysisComplete={() => {
            loadAnalysis()
          }}
        />
      )}

      {editOpen && (
        <UpdateEvent
          event={event}
          onClose={() => setEditOpen(false)}
          onUpdated={() => {
            setEditOpen(false)
            load()
          }}
        />
      )}

      {deleteOpen && (
        <DeleteEvent
          event={event}
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          redirectTo="/main/trading/event"
          onDeleted={() => router.push('/main/trading/event')}
        />
      )}
    </div>
  )
}
