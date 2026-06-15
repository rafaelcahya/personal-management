'use client'

import { useEffect, useState } from 'react'
import {
  Footprints,
  Bike,
  Waves,
  Mountain,
  Dumbbell,
  Zap,
  Timer,
  Map,
  Trophy,
  Heart,
  Activity,
  PersonStanding,
  Wind,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react'
import { getDashboard, syncStrava, fetchUpcomingRaces } from '@/lib/api/running'
import WeeklyStats from './components/WeeklyStats'
import TrainingLoad from './components/TrainingLoad'
import ActivitySection from './components/ActivitySection'
import PerformanceTrends from './components/PerformanceTrends'
import AiCoachPlaceholder from './components/AiCoachPlaceholder'
import HealthCheckin from './components/HealthCheckin'
import DashboardSkeleton from './components/DashboardSkeleton'
import DashboardError from './components/DashboardError'
import ShoeRotation from './components/ShoeRotation'
import YtdStats from './components/YtdStats'
import NextRace from './components/NextRace'
import PageHeader from '@/app/main/components/PageHeader'
import FitnessAgeTile from './components/FitnessAgeTile'
import EnduranceScoreTile from './components/EnduranceScoreTile'

const ACTIVITY_CONFIG = {
  Run: { icon: Footprints, color: 'text-violet-600', bg: 'bg-violet-50', label: 'Run' },
  TrailRun: { icon: Mountain, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Trail Run' },
  VirtualRun: {
    icon: Footprints,
    color: 'text-violet-400',
    bg: 'bg-violet-50',
    label: 'Virtual Run',
  },
  Walk: { icon: PersonStanding, color: 'text-green-600', bg: 'bg-green-50', label: 'Walk' },
  Hike: { icon: Mountain, color: 'text-amber-700', bg: 'bg-amber-50', label: 'Hike' },
  Ride: { icon: Bike, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Ride' },
  VirtualRide: { icon: Bike, color: 'text-blue-400', bg: 'bg-blue-50', label: 'Virtual Ride' },
  MountainBikeRide: { icon: Bike, color: 'text-orange-600', bg: 'bg-orange-50', label: 'MTB' },
  GravelRide: { icon: Bike, color: 'text-stone-600', bg: 'bg-stone-50', label: 'Gravel' },
  Swim: { icon: Waves, color: 'text-cyan-600', bg: 'bg-cyan-50', label: 'Swim' },
  WeightTraining: { icon: Dumbbell, color: 'text-slate-600', bg: 'bg-slate-100', label: 'Weights' },
  Yoga: { icon: Wind, color: 'text-teal-600', bg: 'bg-teal-50', label: 'Yoga' },
  easy: { icon: Footprints, color: 'text-green-600', bg: 'bg-green-50', label: 'Easy' },
  tempo: { icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Tempo' },
  interval: { icon: Timer, color: 'text-red-600', bg: 'bg-red-50', label: 'Interval' },
  long: { icon: Map, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Long' },
  race: { icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Race' },
  recovery: { icon: Heart, color: 'text-slate-500', bg: 'bg-slate-100', label: 'Recovery' },
}

const DEFAULT_CONFIG = { icon: Activity, color: 'text-slate-500', bg: 'bg-slate-100', label: null }
const SYNC_COOLDOWN_MIN = 30

function getConfig(type) {
  return ACTIVITY_CONFIG[type] ?? DEFAULT_CONFIG
}

function shouldAutoSync(lastSyncAt) {
  if (!lastSyncAt) return true
  return (Date.now() - new Date(lastSyncAt).getTime()) / 60000 > SYNC_COOLDOWN_MIN
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

  async function loadDashboard(type = null, { isFilter = false, silent = false } = {}) {
    if (isFilter) setFiltering(true)
    else if (!silent) setLoading(true)
    setError(null)
    try {
      const data = await getDashboard(type)
      setDashboardData(data)
      setLastSyncAt(data.last_sync_at ?? null)
      if (!isFilter) {
        const types = [
          ...new Set((data.recent_activities ?? []).map((a) => a.activity_type).filter(Boolean)),
        ]
        setAvailableTypes(types)
      }
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
    setSyncing(true)
    setSyncResult(null)
    try {
      const result = await syncStrava()
      setLastSyncAt(new Date().toISOString())
      setSyncResult({ count: result.synced })
      if (result.synced > 0) {
        await loadDashboard(activeType, { silent: true })
      }
    } catch {
      // sync failure is non-blocking — dashboard data is still shown
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    async function init() {
      const [data] = await Promise.all([
        loadDashboard(),
        fetchUpcomingRaces()
          .then((res) => setUpcomingRaces(res.data ?? []))
          .catch(() => setUpcomingRaces([])),
      ])
      if (data && shouldAutoSync(data.last_sync_at)) {
        await runSync()
      }
    }
    init()
  }, [])

  function handleTypeSelect(type) {
    const next = activeType === type ? null : type
    setActiveType(next)
    setSyncResult(null)
    loadDashboard(next, { isFilter: true })
  }

  return (
    <div id="dashboardPage" className="flex flex-col gap-5">
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
                <button
                  onClick={() => handleTypeSelect(null)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeType === null
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                {availableTypes.map((type) => {
                  const cfg = getConfig(type)
                  const Icon = cfg.icon
                  const isActive = activeType === type
                  return (
                    <button
                      key={type}
                      onClick={() => handleTypeSelect(type)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        isActive
                          ? `${cfg.bg} ${cfg.color} ring-1 ring-current`
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <Icon className="size-3" aria-hidden="true" />
                      {cfg.label ?? type}
                    </button>
                  )
                })}
              </div>
            )}
            {/* Sync status bar */}
            <div
              id="syncStatusBar"
              className="rounded-lg bg-slate-50 border border-slate-200/70 px-4 py-2.5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>Last synced:</span>
                  <span className="font-medium text-slate-500">
                    {lastSyncAt ? formatRelativeTime(lastSyncAt) : 'Never'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {syncResult !== null && (
                    <span
                      id="syncResultMsg"
                      className={`hidden sm:flex items-center gap-1.5 text-xs font-medium ${
                        syncResult.count > 0 ? 'text-green-600' : 'text-slate-400'
                      }`}
                    >
                      <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
                      {syncResult.count > 0
                        ? `${syncResult.count} new ${syncResult.count === 1 ? 'activity' : 'activities'}`
                        : 'Already up to date'}
                    </span>
                  )}
                  <button
                    id="syncBtn_dashboard"
                    onClick={runSync}
                    disabled={syncing}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-500 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <RefreshCw
                      className={`size-3 ${syncing ? 'animate-spin' : ''}`}
                      aria-hidden="true"
                    />
                    {syncing ? 'Syncing…' : 'Sync'}
                  </button>
                </div>
              </div>

              {syncResult !== null && (
                <div
                  className={`mt-1.5 sm:hidden flex items-center gap-1.5 text-xs font-medium ${
                    syncResult.count > 0 ? 'text-green-600' : 'text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
                  {syncResult.count > 0
                    ? `${syncResult.count} new ${syncResult.count === 1 ? 'activity' : 'activities'}`
                    : 'Already up to date'}
                </div>
              )}
            </div>
          </div>

          {dashboardData.weekly_stats && <WeeklyStats data={dashboardData.weekly_stats} />}
          {dashboardData.training_load && (
            <TrainingLoad
              data={dashboardData.training_load}
              weeklyStats={dashboardData.weekly_stats}
            />
          )}
          <YtdStats ytd_stats={dashboardData.training_load?.ytd_stats} />
          {dashboardData.fitness_age != null && (
            <FitnessAgeTile fitnessAge={dashboardData.fitness_age} />
          )}
          {dashboardData.endurance_score !== undefined && (
            <EnduranceScoreTile enduranceScore={dashboardData.endurance_score} />
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <NextRace upcoming_races={upcomingRaces} />
            <ShoeRotation />
          </div>
          <ActivitySection
            calendarActivities={dashboardData.calendar_activities ?? []}
            recentActivities={dashboardData.recent_activities ?? []}
            activityType={activeType}
          />
          <PerformanceTrends activityType={activeType} />
          <AiCoachPlaceholder />
          {dashboardData.health_today && <HealthCheckin data={dashboardData.health_today} />}
        </div>
      )}
    </div>
  )
}
