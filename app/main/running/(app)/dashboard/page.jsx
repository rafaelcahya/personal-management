'use client'

import { useEffect, useRef, useState } from 'react'
import Button from '@/components/base/Button/Button'
import { RefreshCw, CheckCircle2 } from 'lucide-react'
import { getDashboard, syncStrava, fetchUpcomingRaces, fetchActivityTypes } from '@/lib/api/running'
import WeeklyStats from './components/WeeklyStats'
import TrainingLoad from './components/TrainingLoad'
import ActivitySection from './components/ActivitySection'
import DashboardSkeleton from './components/DashboardSkeleton'
import DashboardError from './components/DashboardError'
import ShoeRotation from './components/ShoeRotation'
import YtdStats from './components/YtdStats'
import NextRace from './components/NextRace'
import PageHeader from '@/app/main/components/PageHeader'
import FitnessAgeTile from './components/FitnessAgeTile'
import EnduranceScoreTile from './components/EnduranceScoreTile'
import StreakCard from './components/StreakCard'
import { getCfg } from './utils/activityDisplay'
import LazyMount from '@/app/main/running/components/LazyMount'

const SYNC_COOLDOWN_MIN = 30

function shouldAutoSync(lastSyncAt) {
  if (!lastSyncAt) return true
  return (Date.now() - new Date(lastSyncAt).getTime()) / 60000 > SYNC_COOLDOWN_MIN
}

function formatSyncMessage(result) {
  if (result.message) return result.message
  if (result.count > 0) {
    return `${result.count} new ${result.count === 1 ? 'activity' : 'activities'}`
  }
  return 'Already up to date'
}

// Keeps the Strava round trip off the critical rendering path
function afterFirstPaint(cb) {
  if (typeof window.requestIdleCallback === 'function') {
    const handle = window.requestIdleCallback(cb, { timeout: 2000 })
    return () => window.cancelIdleCallback(handle)
  }
  const handle = setTimeout(cb, 200)
  return () => clearTimeout(handle)
}

function formatRelativeTime(isoString) {
  if (!isoString) return null
  const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)
  if (diffSec < 60) return 'just now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}h ago`
  return `${Math.floor(diffHour / 24)}d ago`
}

export default function RunningDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null)
  const [upcomingRaces, setUpcomingRaces] = useState([])
  const [lastSyncAt, setLastSyncAt] = useState(null)
  const [availableTypes, setAvailableTypes] = useState([])
  const [activeType, setActiveType] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filtering, setFiltering] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState(null)
  const [error, setError] = useState(null)
  // Refs because the auto-sync callback is scheduled from an older render
  const activeTypeRef = useRef(null)
  const syncingRef = useRef(false)
  const cancelAutoSyncRef = useRef(null)

  async function loadDashboard(type = null, { isFilter = false, silent = false } = {}) {
    if (isFilter) setFiltering(true)
    else if (!silent) setLoading(true)
    setError(null)
    try {
      const data = await getDashboard(type)
      setDashboardData(data)
      setLastSyncAt(data.last_sync_at ?? null)
      return data
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        window.location.href = '/login'
        return null
      }
      setError(err.message || 'Failed to load dashboard')
      return null
    } finally {
      setLoading(false)
      setFiltering(false)
    }
  }

  async function runSync() {
    if (syncingRef.current) return
    // A manual click makes the still-pending auto-sync redundant
    cancelAutoSyncRef.current?.()
    syncingRef.current = true
    setSyncing(true)
    setSyncResult(null)
    try {
      const result = await syncStrava()
      setLastSyncAt(new Date().toISOString())
      if (result.backfill_started) {
        setSyncResult({
          count: 0,
          message: result.message || 'Sync started, activities will appear shortly',
        })
      } else {
        setSyncResult({ count: result.synced })
        if (result.synced > 0) {
          await loadDashboard(activeTypeRef.current, { silent: true })
        }
      }
    } catch (err) {
      // other failures are non-blocking — dashboard data is still shown
      if (err.needsReconnect) {
        setSyncResult({ count: 0, message: 'Strava needs reconnecting. See Settings.', warn: true })
      }
    } finally {
      syncingRef.current = false
      setSyncing(false)
    }
  }

  useEffect(() => {
    fetchActivityTypes()
      .then((types) => setAvailableTypes(types ?? []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false
    async function init() {
      const [data] = await Promise.all([
        loadDashboard(),
        fetchUpcomingRaces()
          .then((res) => setUpcomingRaces(res.data ?? []))
          .catch(() => setUpcomingRaces([])),
      ])
      if (!cancelled && data && shouldAutoSync(data.last_sync_at)) {
        cancelAutoSyncRef.current = afterFirstPaint(runSync)
      }
    }
    init()
    return () => {
      cancelled = true
      cancelAutoSyncRef.current?.()
    }
  }, [])

  function handleTypeSelect(type) {
    const next = activeType === type ? null : type
    setActiveType(next)
    activeTypeRef.current = next
    setSyncResult(null)
    loadDashboard(next, { isFilter: true })
  }

  return (
    <main id="dashboardPage" className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your training, load, and performance trends."
        breadcrumbs={[
          { label: 'Running', href: '/main/running/dashboard' },
          { label: 'Dashboard' },
        ]}
      />
      {loading && <DashboardSkeleton />}
      {!loading && error && (
        <DashboardError message={error} onRetry={() => loadDashboard(activeType)} />
      )}
      {!loading && !error && dashboardData && (
        <div
          className={`flex flex-col gap-6 transition-opacity duration-150 ${filtering ? 'opacity-60 pointer-events-none' : ''}`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Activity type filter */}
            {availableTypes.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400 font-medium">Filter:</span>
                <Button
                  id="activityTypeFilterAll_dashboardPage"
                  variant="ghost"
                  size="xs"
                  aria-pressed={activeType === null}
                  onClick={() => handleTypeSelect(null)}
                  className={`rounded-full ${activeType === null ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  All
                </Button>
                {availableTypes.map((type) => {
                  const cfg = getCfg(type)
                  const Icon = cfg.icon
                  const isActive = activeType === type
                  return (
                    <Button
                      key={type}
                      id={`activityTypeFilter_${type}_dashboardPage`}
                      variant="ghost"
                      size="xs"
                      aria-pressed={isActive}
                      onClick={() => handleTypeSelect(type)}
                      className={`rounded-full ${isActive ? `${cfg.bg} ${cfg.color} ring-1 ring-current` : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                      <Icon className="size-3" aria-hidden="true" />
                      {cfg.label ?? type}
                    </Button>
                  )
                })}
              </div>
            )}
            {/* Sync status bar */}
            <div
              id="syncStatusBar"
              className="rounded-lg bg-slate-50 border border-slate-200/70 px-4 py-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>Last synced:</span>
                  <span className="font-medium text-slate-500">
                    {lastSyncAt ? formatRelativeTime(lastSyncAt) : 'Never'}
                  </span>
                </div>

                {syncResult !== null && (
                  <span
                    id="syncResultMsg"
                    role="status"
                    className={`order-3 flex w-full items-center gap-1.5 text-xs font-medium sm:order-2 sm:ml-auto sm:w-auto ${
                      syncResult.warn
                        ? 'text-amber-600'
                        : syncResult.count > 0
                          ? 'text-green-600'
                          : 'text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
                    {formatSyncMessage(syncResult)}
                  </span>
                )}
                <Button
                  id="syncBtn_dashboard"
                  variant="ghost"
                  size="xs"
                  onClick={runSync}
                  disabled={syncing}
                  className="order-2 text-slate-500 hover:bg-slate-200 sm:order-3"
                >
                  <RefreshCw
                    className={`size-3 ${syncing ? 'animate-spin' : ''}`}
                    aria-hidden="true"
                  />
                  {syncing ? 'Syncing…' : 'Sync'}
                </Button>
              </div>
            </div>
          </div>

          {dashboardData.streak && <StreakCard streak={dashboardData.streak} />}
          {dashboardData.weekly_stats && (
            <WeeklyStats data={dashboardData.weekly_stats} activityType={activeType} />
          )}
          {dashboardData.training_load && (
            <TrainingLoad
              data={dashboardData.training_load}
              weeklyStats={dashboardData.weekly_stats}
            />
          )}
          <YtdStats ytd_stats={dashboardData.training_load?.ytd_stats} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dashboardData.fitness_age != null && (
              <FitnessAgeTile
                fitnessAge={dashboardData.fitness_age}
                viewTrendHref="/main/running/analytics#fitnessAgeTrendSection_analyticsPage"
              />
            )}
            {dashboardData.endurance_score !== undefined && (
              <EnduranceScoreTile
                enduranceScore={dashboardData.endurance_score}
                viewTrendHref="/main/running/analytics#enduranceScoreTrendSection_analyticsPage"
              />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NextRace upcoming_races={upcomingRaces} />
            <LazyMount minHeight={320}>
              <ShoeRotation />
            </LazyMount>
          </div>
          <ActivitySection
            calendarActivities={dashboardData.calendar_activities ?? []}
            recentActivities={dashboardData.recent_activities ?? []}
            activityType={activeType}
          />
        </div>
      )}
    </main>
  )
}
