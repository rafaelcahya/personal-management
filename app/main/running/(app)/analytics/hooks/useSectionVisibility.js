'use client'

import { useState, useEffect, useCallback } from 'react'
import { ANALYTICS_SECTIONS } from '../sections'

const STORAGE_KEY = 'analytics-section-visibility'

function getDefaults() {
  return Object.fromEntries(ANALYTICS_SECTIONS.map((s) => [s.id, s.defaultVisible]))
}

export function useSectionVisibility() {
  const [visibility, setVisibility] = useState(getDefaults)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setVisibility({ ...getDefaults(), ...parsed })
      }
    } catch {}
  }, [])

  const setVisible = useCallback((id, value) => {
    setVisibility((prev) => {
      const next = { ...prev, [id]: value }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  const showAll = useCallback(() => {
    const all = Object.fromEntries(ANALYTICS_SECTIONS.map((s) => [s.id, true]))
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
    } catch {}
    setVisibility(all)
  }, [])

  const resetToDefault = useCallback(() => {
    const defaults = getDefaults()
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
    } catch {}
    setVisibility(defaults)
  }, [])

  const visibleCount = ANALYTICS_SECTIONS.filter((s) => visibility[s.id]).length

  return {
    visibility,
    setVisible,
    showAll,
    resetToDefault,
    visibleCount,
    total: ANALYTICS_SECTIONS.length,
  }
}
