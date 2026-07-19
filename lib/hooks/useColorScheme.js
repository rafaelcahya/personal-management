'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'color-scheme'
const SCHEMES = ['default', 'violet']

export function useColorScheme() {
  const [scheme, setSchemeState] = useState('default')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const initial = SCHEMES.includes(stored) ? stored : 'default'
    setSchemeState(initial)
    applyScheme(initial)
  }, [])

  function setScheme(next) {
    setSchemeState(next)
    localStorage.setItem(STORAGE_KEY, next)
    applyScheme(next)
  }

  return { scheme, setScheme }
}

function applyScheme(scheme) {
  const el = document.documentElement
  if (!document.startViewTransition) {
    SCHEMES.forEach((s) => el.classList.remove(s))
    if (scheme !== 'default') el.classList.add(scheme)
    return
  }
  document.startViewTransition(() => {
    SCHEMES.forEach((s) => el.classList.remove(s))
    if (scheme !== 'default') el.classList.add(scheme)
  })
}
