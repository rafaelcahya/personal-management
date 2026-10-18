'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  fetchAnalyticsOverview,
  fetchCalorieTrend,
  fetchEnduranceScoreTrend,
  fetchFitnessAgeTrend,
  fetchPersonalBests,
  fetchSessionProfile,
  fetchTemperatureEfficiency,
} from '@/lib/api/running'

// A failed section retries through its own endpoint instead of re-running the whole overview
const SECTION_FETCHERS = {
  calorie_trend: fetchCalorieTrend,
  endurance_score: fetchEnduranceScoreTrend,
  fitness_age: fetchFitnessAgeTrend,
  personal_bests: fetchPersonalBests,
  session_profile: fetchSessionProfile,
  temperature_efficiency: fetchTemperatureEfficiency,
}

const KEYS = Object.keys(SECTION_FETCHERS)
const FALLBACK_ERROR = 'Failed to load'

function without(obj, key) {
  const { [key]: _removed, ...rest } = obj
  return rest
}

export function useAnalyticsOverview() {
  const [state, setState] = useState({
    data: {},
    errors: {},
    pending: Object.fromEntries(KEYS.map((k) => [k, true])),
  })

  useEffect(() => {
    let cancelled = false
    fetchAnalyticsOverview()
      .then(({ data, errors }) => {
        if (!cancelled) setState({ data: data ?? {}, errors: errors ?? {}, pending: {} })
      })
      .catch((err) => {
        if (cancelled) return
        const message = err.message || FALLBACK_ERROR
        setState({
          data: {},
          errors: Object.fromEntries(KEYS.map((k) => [k, message])),
          pending: {},
        })
      })
    return () => {
      cancelled = true
    }
  }, [])

  const retry = useCallback((key) => {
    setState((s) => ({
      ...s,
      errors: without(s.errors, key),
      pending: { ...s.pending, [key]: true },
    }))
    SECTION_FETCHERS[key]()
      .then((value) =>
        setState((s) => ({
          data: { ...s.data, [key]: value },
          errors: without(s.errors, key),
          pending: without(s.pending, key),
        }))
      )
      .catch((err) =>
        setState((s) => ({
          ...s,
          errors: { ...s.errors, [key]: err.message || FALLBACK_ERROR },
          pending: without(s.pending, key),
        }))
      )
  }, [])

  // A null section without an `errors` entry is still treated as failed so the retry UI shows
  const sectionProps = (key) => {
    const loading = Boolean(state.pending[key])
    const data = state.data[key] ?? null
    const error = loading ? null : (state.errors[key] ?? (data == null ? FALLBACK_ERROR : null))
    return { data, loading, error, onRetry: () => retry(key) }
  }

  return { sectionProps }
}
