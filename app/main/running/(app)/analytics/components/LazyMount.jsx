'use client'

import { useInView } from '../hooks/useInView'

// Estimates of each block's loaded height (px). Keep them close to reality: the closer the
// placeholder is, the less the page jumps when a block mounts above the reader.
export const LAZY_HEIGHT = {
  aiCard: 120,
  targetEffort: 360,
  zoneAnalytics: 720,
}

// Defers children (and their API calls) until the block is near the viewport, so a page
// with many independently-fetching sections doesn't fire all of them on load.
export default function LazyMount({ minHeight = LAZY_HEIGHT.aiCard, children }) {
  const [ref, seen] = useInView()

  if (seen) return children

  return <div ref={ref} aria-hidden="true" style={{ minHeight }} />
}
