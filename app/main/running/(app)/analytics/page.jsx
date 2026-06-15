'use client'

import { useState, useEffect, useMemo } from 'react'
import { BarChart2, TrendingUp, Zap, Activity, Trophy } from 'lucide-react'
import {
  fetchActivities,
  fetchPerformanceTrends,
  getDashboard,
  fetchAnalyticsStaleness,
} from '@/lib/api/running'
import PageHeader from '@/app/main/components/PageHeader'
import SyncStravaButton from '@/app/main/running/components/SyncStravaButton'
import { RUN_TYPES } from './components/utils'
import Section from './components/Section'
import SummaryStats from './components/SummaryStats'
import WeeklyDistanceChart from './components/WeeklyDistanceChart'
import PaceTrendChart from './components/PaceTrendChart'
import BestPaceChart from './components/BestPaceChart'
import TrainingLoadChart from './components/TrainingLoadChart'
import Vo2maxTrendChart from './components/Vo2maxTrendChart'
import EfTrendChart from './components/EfTrendChart'
import RacePredictor from './components/RacePredictor'
import AnalyticsAICard from './components/AnalyticsAICard'
import Vo2maxTargetEffortSection from './components/Vo2maxTargetEffortSection'
import PersonalBestsTable from './components/PersonalBestsTable'
import CalorieTrendChart from './components/CalorieTrendChart'
import ZoneAnalyticsSection from './components/ZoneAnalyticsSection'
import FitnessAgeTrendChart from './components/FitnessAgeTrendChart'

export default function AnalyticsPage() {
  const [activities, setActivities] = useState([])
  const [trendData, setTrendData] = useState([])
  const [trainingLoad, setTrainingLoad] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isPageStale, setIsPageStale] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [activitiesRes, trendsRes, dashboardRes, stalenessRes] = await Promise.allSettled([
          fetchActivities({ page: 1, limit: 200 }),
          fetchPerformanceTrends(50),
          getDashboard(),
          fetchAnalyticsStaleness(),
        ])

        if (cancelled) return

        if (activitiesRes.status === 'fulfilled') {
          setActivities(activitiesRes.value?.data ?? [])
        }
        if (trendsRes.status === 'fulfilled') {
          setTrendData(trendsRes.value?.data ?? [])
        }
        if (dashboardRes.status === 'fulfilled') {
          setTrainingLoad(dashboardRes.value?.training_load ?? null)
        }
        if (stalenessRes.status === 'fulfilled') {
          setIsPageStale(stalenessRes.value?.is_stale ?? false)
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load analytics data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const runTrendData = useMemo(
    () => trendData.filter((a) => RUN_TYPES.has(a.activity_type)),
    [trendData]
  )

  return (
    <div id="analyticsPage" className="flex flex-col gap-6">
      <PageHeader
        title="Analytics"
        description="Training trends, load analysis, and race predictions"
        breadcrumbs={[
          { label: 'Running', href: '/main/running/dashboard' },
          { label: 'Analytics' },
        ]}
      />
      <SyncStravaButton id="syncStravaBtn_analytics" />

      {loading && (
        <div
          id="analyticsLoadingSkeleton"
          className="flex flex-col gap-6"
          aria-label="Loading analytics"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-20 bg-slate-100 rounded-lg animate-pulse"
                aria-hidden="true"
              />
            ))}
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-slate-100 rounded-xl animate-pulse"
              aria-hidden="true"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div
          id="analyticsError"
          role="alert"
          className="flex flex-col items-center justify-center py-16 gap-3 text-center"
        >
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-violet-600 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <SummaryStats activities={activities} />

          <Section
            id="weeklyDistanceSection"
            title="Weekly Distance"
            description="Running volume per week over the last 12 weeks. Use this to spot under-training or overload before it becomes an issue."
            icon={BarChart2}
          >
            <WeeklyDistanceChart activities={activities} />
            <AnalyticsAICard section="weekly_distance" isPageStale={isPageStale} />
          </Section>

          <Section
            id="paceTrendSection"
            title="Pace Trend"
            description="How your average pace changes run by run. The purple line is a 3-run moving average — a downward slope means you're getting faster."
            icon={TrendingUp}
          >
            <PaceTrendChart trendData={runTrendData} />
            <AnalyticsAICard section="pace_trend" isPageStale={isPageStale} />
          </Section>

          <Section
            id="bestPaceSection"
            title="Best Pace by Distance"
            description="Your fastest recorded average pace for each distance bracket. Lower bars mean faster paces — compare across 5K, 10K, half, and marathon."
            icon={Zap}
          >
            <BestPaceChart activities={activities} />
          </Section>

          <Section
            id="trainingLoadSection"
            title="Training Load (ACWR)"
            description="Acute:Chronic Workload Ratio compares your last 7 days of effort against your 28-day baseline. Stay between 0.8–1.3 to minimize injury risk."
            icon={Activity}
          >
            <TrainingLoadChart trainingLoad={trainingLoad} />
            <AnalyticsAICard section="training_load" isPageStale={isPageStale} />
          </Section>

          <Section
            id="vo2maxTrendSection"
            title="VO2max Trend"
            description="Estimated aerobic capacity (mL/kg/min) based on HR and pace. Higher is better — an upward trend means your engine is growing."
            icon={Activity}
          >
            <Vo2maxTrendChart activities={activities} />
            <AnalyticsAICard section="vo2max_trend" isPageStale={isPageStale} />
          </Section>

          <Section
            id="vo2maxTargetEffortSection"
            title="VO2max Target Effort"
            description="How your current VO2max compares to what you need for your race goal — and how long it will take to close the gap."
            icon={Activity}
          >
            <Vo2maxTargetEffortSection activities={activities} />
          </Section>

          <Section
            id="efTrendSection"
            title="Efficiency Factor Trend"
            description="Speed per unit of heart rate effort. Green dots = above your 30-day average (more efficient). A rising trend means you're running faster for the same HR."
            icon={TrendingUp}
          >
            <EfTrendChart activities={activities} />
            <AnalyticsAICard section="ef_trend" isPageStale={isPageStale} />
          </Section>

          <Section
            id="racePredictorSection"
            title="Race Predictor"
            description="Predicted finish times across distances using the Riegel formula. Pick your best-known distance as the source for the most accurate projections."
            icon={TrendingUp}
          >
            <RacePredictor activities={activities} />
            <AnalyticsAICard section="race_predictor" isPageStale={isPageStale} />
          </Section>

          <Section
            id="personalBestsSection_analyticsPage"
            title="Personal Bests"
            description="Your top 5 fastest times for key distances. Click any row to see the activity where you recorded that effort."
            icon={Trophy}
          >
            <PersonalBestsTable />
          </Section>

          <Section
            id="calorieTrendSection_analyticsPage"
            title="Calorie Burn Trend"
            description="Total calories burned per month across the last 6 months, estimated from your runs using your current weight."
            icon={BarChart2}
          >
            <CalorieTrendChart />
          </Section>

          <Section
            id="fitnessAgeTrendSection_analyticsPage"
            title="Fitness Age Trend"
            description="Your cardiovascular Fitness Age per week, based on VO₂max vs. NTNU population norms (Nes et al. 2011). Lower than your chronological age means above-average fitness."
            icon={Activity}
          >
            <FitnessAgeTrendChart />
          </Section>

          <ZoneAnalyticsSection />
        </>
      )}
    </div>
  )
}
