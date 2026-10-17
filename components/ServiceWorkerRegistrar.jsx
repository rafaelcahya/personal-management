'use client'

import { useEffect } from 'react'
import { syncPushSubscription } from '@/lib/push/pushClient'

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => syncPushSubscription())
      .catch((err) => console.error('[ServiceWorkerRegistrar]', err?.message))
  }, [])

  return null
}
