'use client'

import { useState, useEffect, useCallback } from 'react'

// Callback ref (not useRef) so it still works when the node mounts later, e.g. a toggled section
export function useInView({ rootMargin = '300px' } = {}) {
  const [node, setNode] = useState(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    if (!node || seen) return
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSeen(true)
      },
      { rootMargin }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [node, seen, rootMargin])

  const ref = useCallback((el) => setNode(el), [])
  return [ref, seen]
}
