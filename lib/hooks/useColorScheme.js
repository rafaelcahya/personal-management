'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'color-scheme'
const SCHEMES = ['default', 'violet', 'glass']

const SCHEME_CLASS = {
  violet: 'violet',
  glass: 'theme-glass',
}

export function useColorScheme() {
  const [scheme, setSchemeState] = useState('default')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const initial = SCHEMES.includes(stored) ? stored : 'violet'
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
  const apply = () => {
    Object.values(SCHEME_CLASS).forEach((cls) => el.classList.remove(cls))
    const cls = SCHEME_CLASS[scheme]
    if (cls) el.classList.add(cls)
  }
  if (!document.startViewTransition) {
    apply()
    return
  }
  document.startViewTransition(apply)
}
