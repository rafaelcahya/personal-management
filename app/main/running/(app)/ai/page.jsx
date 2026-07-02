'use client'

import { useState, useEffect } from 'react'
import {
  getDashboard,
  fetchAnomalyInsights,
  fetchDailyInsight,
  fetchUpcomingRaces,
  fetchWeeklyReviewInsight,
  fetchFridayPrepInsight,
} from '@/lib/api/running'
import PageHeader from '@/app/main/components/PageHeader'
import TrainingLoadTiles from './components/TrainingLoadTiles'
import AnomalyAlertsSection from './components/AnomalyAlertsSection'
import DailyInsightCard from './components/DailyInsightCard'
import InjuryCoachCard from './components/InjuryCoachCard'
import FridayPrepCard from './components/FridayPrepCard'
import RaceCountdownCard from './components/RaceCountdownCard'
import WeeklyReviewCard from './components/WeeklyReviewCard'

export default function AICoachPage() {
  const [trainingLoad, setTrainingLoad] = useState(null)
  const [anomalies, setAnomalies] = useState([])
  const [dailyInsight, setDailyInsight] = useState(null)
  const [upcomingRace, setUpcomingRace] = useState(null)
  const [weeklyReview, setWeeklyReview] = useState(null)
  const [fridayPrep, setFridayPrep] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [dashboardRes, anomaliesRes, dailyRes, racesRes, weeklyRes, fridayRes] =
          await Promise.allSettled([
            getDashboard(),
            fetchAnomalyInsights(),
            fetchDailyInsight(),
            fetchUpcomingRaces(),
            fetchWeeklyReviewInsight(),
            fetchFridayPrepInsight(),
          ])

        if (cancelled) return

        if (dashboardRes.status === 'fulfilled') {
          setTrainingLoad(dashboardRes.value?.training_load ?? null)
        }
        if (anomaliesRes.status === 'fulfilled') {
          setAnomalies(anomaliesRes.value ?? [])
        }
        if (dailyRes.status === 'fulfilled') {
          setDailyInsight(dailyRes.value ?? null)
        }
        if (racesRes.status === 'fulfilled') {
          const races = racesRes.value?.data ?? racesRes.value ?? []
          const sorted = [...races].sort((a, b) => new Date(a.race_date) - new Date(b.race_date))
          const next = sorted.find((r) => new Date(r.race_date) >= new Date())
          setUpcomingRace(next ?? null)
        }
        if (weeklyRes.status === 'fulfilled') {
          setWeeklyReview(weeklyRes.value ?? null)
        }
        if (fridayRes.status === 'fulfilled') {
          setFridayPrep(fridayRes.value ?? null)
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load AI Coach data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div id="aiCoachPage" className="flex flex-col gap-6">
      <PageHeader
        title="AI Coach"
        description="Daily insights, anomaly alerts, and training state"
        breadcrumbs={[{ label: 'Running', href: '/main/running/dashboard' }, { label: 'AI Coach' }]}
      />

      {loading && (
        <div
          id="aiCoachLoadingSkeleton"
          className="flex flex-col gap-4"
          aria-label="Loading AI Coach"
        >
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-24 bg-slate-100 rounded-xl animate-pulse"
                aria-hidden="true"
              />
            ))}
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 bg-slate-100 rounded-xl animate-pulse"
              aria-hidden="true"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div
          id="aiCoachError"
          role="alert"
          className="flex flex-col items-center justify-center py-16 gap-3 text-center"
        >
          <p className="text-sm text-red-500">{error}</p>
          <Button
            variant="ghost"
            onClick={() => window.location.reload()}
            className="text-xs text-violet-600 underline hover:no-underline"
          >
            Try again
          </Button>
        </div>
      )}

      {!loading && !error && (
        <>
          <TrainingLoadTiles trainingLoad={trainingLoad} />
          <AnomalyAlertsSection anomalies={anomalies} />
          <DailyInsightCard initialInsight={dailyInsight} trainingLoad={trainingLoad} />
          <InjuryCoachCard />
          <FridayPrepCard fridayPrep={fridayPrep} />
          <RaceCountdownCard upcomingRace={upcomingRace} weeklyReview={weeklyReview} />
          <WeeklyReviewCard weeklyReview={weeklyReview} />
        </>
      )}
    </div>
  )
}
