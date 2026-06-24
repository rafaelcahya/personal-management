'use client'

import { useState, useEffect, useMemo } from 'react'
import { BarChart2, TrendingUp, Zap, Activity, Trophy, Mountain } from 'lucide-react'
import {
  fetchActivities,
  fetchPerformanceTrends,
  getDashboard,
  fetchAnalyticsStaleness,
  fetchZoneReference,
} from '@/lib/api/running'
import PageHeader from '@/app/main/components/PageHeader'
import SyncStravaButton from '@/app/main/running/components/SyncStravaButton'
import { RUN_TYPES } from './components/utils'
import Section from './components/Section'
import SectionsManager from './components/SectionsManager'
import { useSectionVisibility } from './hooks/useSectionVisibility'
import WeeklyDistanceChart from './components/WeeklyDistanceChart'
import PaceTrendChart from './components/PaceTrendChart'
import BestPaceChart from './components/BestPaceChart'
import WeeklyElevationChart from './components/WeeklyElevationChart'
import TerrainDistributionChart from './components/TerrainDistributionChart'
import PerformanceManagementChart from './components/PerformanceManagementChart'
import Vo2maxTrendChart from './components/Vo2maxTrendChart'
import RunningPowerChart from './components/RunningPowerChart'
import EfTrendChart from './components/EfTrendChart'
import RacePredictor from './components/RacePredictor'
import AnalyticsAICard from './components/AnalyticsAICard'
import Vo2maxTargetEffortSection from './components/Vo2maxTargetEffortSection'
import PersonalBestsTable from './components/PersonalBestsTable'
import CalorieTrendChart from './components/CalorieTrendChart'
import ZoneAnalyticsSection from './components/ZoneAnalyticsSection'
import FitnessAgeTrendChart from './components/FitnessAgeTrendChart'
import EnduranceScoreTrendChart from './components/EnduranceScoreTrendChart'
import TrainingZonesReference from './components/TrainingZonesReference'
import PerformanceTrends from '../dashboard/components/PerformanceTrends'
import SessionProfileSection from './components/SessionProfileSection'
import TemperatureEfficiencySection from './components/TemperatureEfficiencySection'

export default function AnalyticsPage() {
  const [activities, setActivities] = useState([])
  const [trendData, setTrendData] = useState([])
  const [trainingLoad, setTrainingLoad] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isPageStale, setIsPageStale] = useState(false)
  const [refData, setRefData] = useState(null)
  const [refLoading, setRefLoading] = useState(true)
  const [refError, setRefError] = useState(null)

  const { visibility, setVisible, showAll, resetToDefault, visibleCount, total } =
    useSectionVisibility()

  function loadRefData() {
    setRefLoading(true)
    setRefError(null)
    fetchZoneReference()
      .then((data) => setRefData(data))
      .catch(() => setRefError('Failed to load zone reference'))
      .finally(() => setRefLoading(false))
  }

  useEffect(() => {
    loadRefData()
  }, [])

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

  const vis = (id) => visibility[id] !== false

  return (
    <main id="analyticsPage" className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Training trends, load analysis, and race predictions"
        breadcrumbs={[
          { label: 'Running', href: '/main/running/dashboard' },
          { label: 'Analytics' },
        ]}
      />
      <SyncStravaButton
        id="syncStravaBtn_analytics"
        actions={
          <SectionsManager
            visibility={visibility}
            setVisible={setVisible}
            showAll={showAll}
            resetToDefault={resetToDefault}
            visibleCount={visibleCount}
            total={total}
          />
        }
      />

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
          {vis('performanceTrendsSection_analyticsPage') && (
            <div id="performanceTrendsSection_analyticsPage" className="scroll-mt-20">
              <PerformanceTrends />
            </div>
          )}

          {vis('weeklyDistanceSection') && (
            <Section
              id="weeklyDistanceSection"
              title="Weekly Distance"
              description="Running volume per week over the last 12 weeks. Use this to spot under-training or overload before it becomes an issue."
              icon={BarChart2}
            >
              <WeeklyDistanceChart activities={activities} />
              <AnalyticsAICard section="weekly_distance" isPageStale={isPageStale} />
            </Section>
          )}

          {vis('paceTrendSection') && (
            <Section
              id="paceTrendSection"
              title="Pace Trend"
              description="How your average pace changes run by run. The purple line is a 3-run moving average — a downward slope means you're getting faster."
              icon={TrendingUp}
            >
              <PaceTrendChart trendData={runTrendData} />
              <AnalyticsAICard section="pace_trend" isPageStale={isPageStale} />
            </Section>
          )}

          {vis('bestPaceSection') && (
            <Section
              id="bestPaceSection"
              title="Best Pace by Distance"
              description="Your fastest recorded average pace for each distance bracket. Lower bars mean faster paces — compare across 5K, 10K, half, and marathon."
              icon={Zap}
            >
              <BestPaceChart activities={activities} />
            </Section>
          )}

          {vis('elevationTerrainSection_analyticsPage') && (
            <Section
              id="elevationTerrainSection_analyticsPage"
              title="Elevation & Terrain"
              description="Weekly elevation gain and the terrain mix of your runs — Flat, Rolling, Hilly, or Mountainous, based on elevation gain per kilometer."
              icon={Mountain}
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                  <div className="flex items-baseline gap-2 mb-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Terrain Distribution
                    </p>
                    <p className="text-xs text-slate-400">
                      {activities.filter((a) => RUN_TYPES.has(a.activity_type)).length} runs
                    </p>
                  </div>
                  <TerrainDistributionChart activities={activities} />
                </div>
                <div className="lg:col-span-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Weekly Elevation Trend
                  </p>
                  <WeeklyElevationChart activities={activities} />
                </div>
              </div>
            </Section>
          )}

          {vis('pmcSection_analyticsPage') && (
            <Section
              id="pmcSection_analyticsPage"
              title="Performance Management (Fitness / Fatigue / Form)"
              description="Fitness (28-day load) and Fatigue (7-day load) over time, with Form (the gap between them) showing how fresh or fatigued you are. Most useful with 60+ days of history, especially for race tapering decisions."
              icon={Activity}
            >
              <PerformanceManagementChart />
            </Section>
          )}

          {vis('vo2maxTrendSection') && (
            <Section
              id="vo2maxTrendSection"
              title="VO2max Trend"
              description="Estimated aerobic capacity (mL/kg/min) based on HR and pace. Higher is better — an upward trend means your engine is growing."
              icon={Activity}
            >
              <Vo2maxTrendChart activities={activities} />
              <AnalyticsAICard section="vo2max_trend" isPageStale={isPageStale} />
            </Section>
          )}

          {vis('runningPowerSection_analyticsPage') && (
            <Section
              id="runningPowerSection_analyticsPage"
              title="Running Power"
              description="Average power per run, with a 30-activity rolling average and weighted power (smooths out spikes from hills and surges) overlaid. Requires a device with running power support."
              icon={Zap}
            >
              <RunningPowerChart activities={activities} />
            </Section>
          )}

          {vis('vo2maxTargetEffortSection') && (
            <Section
              id="vo2maxTargetEffortSection"
              title="VO2max Target Effort"
              description="How your current VO2max compares to what you need for your race goal — and how long it will take to close the gap."
              icon={Activity}
            >
              <Vo2maxTargetEffortSection activities={activities} />
            </Section>
          )}

          {vis('efTrendSection') && (
            <Section
              id="efTrendSection"
              title="Efficiency Factor Trend"
              description="Speed per unit of heart rate effort. Green dots = above your 30-day average (more efficient). A rising trend means you're running faster for the same HR."
              icon={TrendingUp}
            >
              <EfTrendChart activities={activities} />
              <AnalyticsAICard section="ef_trend" isPageStale={isPageStale} />
            </Section>
          )}

          {vis('racePredictorSection') && (
            <Section
              id="racePredictorSection"
              title="Race Predictor"
              description="Predicted finish times across distances using the Riegel formula. Pick your best-known distance as the source for the most accurate projections."
              icon={TrendingUp}
            >
              <RacePredictor activities={activities} />
              <AnalyticsAICard section="race_predictor" isPageStale={isPageStale} />
            </Section>
          )}

          {vis('personalBestsSection_analyticsPage') && (
            <Section
              id="personalBestsSection_analyticsPage"
              title="Personal Bests"
              description="Your top 5 fastest times for key distances. Click any row to see the activity where you recorded that effort."
              icon={Trophy}
            >
              <PersonalBestsTable />
            </Section>
          )}

          {vis('calorieTrendSection_analyticsPage') && (
            <Section
              id="calorieTrendSection_analyticsPage"
              title="Calorie Burn Trend"
              description="Total calories burned per month across the last 6 months, estimated from your runs using your current weight."
              icon={BarChart2}
            >
              <CalorieTrendChart />
            </Section>
          )}

          {vis('fitnessAgeTrendSection_analyticsPage') && (
            <Section
              id="fitnessAgeTrendSection_analyticsPage"
              title="Fitness Age Trend"
              description="Your cardiovascular Fitness Age per week, based on VO₂max vs. NTNU population norms (Nes et al. 2011). Lower than your chronological age means above-average fitness."
              icon={Activity}
            >
              <FitnessAgeTrendChart />
            </Section>
          )}

          {vis('enduranceScoreTrendSection_analyticsPage') && (
            <Section
              id="enduranceScoreTrendSection_analyticsPage"
              title="Endurance Score Trend"
              description="Weekly composite score (0–100) combining VO₂max fitness, 28-day training load, and your longest run in the last 8 weeks. Higher is better."
              icon={Activity}
            >
              <EnduranceScoreTrendChart />
            </Section>
          )}

          {vis('trainingZonesSection_analyticsPage') && (
            <div id="trainingZonesSection_analyticsPage" className="scroll-mt-20">
              <TrainingZonesReference
                data={refData}
                loading={refLoading}
                error={refError}
                onRetry={loadRefData}
              />
            </div>
          )}

          {vis('zoneAnalyticsSection_analyticsPage') && (
            <div id="zoneAnalyticsSection_analyticsPage" className="scroll-mt-20">
              <ZoneAnalyticsSection />
            </div>
          )}

          {vis('sessionProfileSection_analyticsPage') && <SessionProfileSection />}

          {vis('temperatureEfficiencySection_analyticsPage') && <TemperatureEfficiencySection />}
        </>
      )}
    </main>
  )
}
