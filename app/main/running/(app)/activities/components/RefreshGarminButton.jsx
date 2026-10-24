'use client'

import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import Button from '@/components/base/Button/Button'
import { fetchGarminConnection, refreshGarminActivity } from '@/lib/api/running'

/** Shown only while Garmin is connected. Runs the refresh, then asks the page to reload quietly. */
export default function RefreshGarminButton({ activityId, onRefreshed }) {
  const [connected, setConnected] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchGarminConnection()
      .then((data) => {
        if (!cancelled) setConnected(data.status === 'connected')
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  async function handleRefresh() {
    setRefreshing(true)
    try {
      await refreshGarminActivity(activityId)
      toast.success('Garmin data updated')
      await onRefreshed?.()
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        window.location.href = '/login'
        return
      }
      if (err.status === 404 && err.message === 'No matching Garmin activity') {
        toast.info('No matching Garmin run found for this activity')
      } else if (err.status === 409) {
        toast.error('Garmin is not connected')
        setConnected(false)
      } else if (err.status === 429) {
        toast.info(err.message)
      } else if (err.status === 502) {
        toast.error('Garmin API is unavailable. Try again later.', { duration: Infinity })
      } else {
        toast.error(err.message || 'Could not refresh Garmin data')
      }
    } finally {
      setRefreshing(false)
    }
  }

  if (!connected) return null

  return (
    <Button
      id="refreshGarminBtn_activityDetailPage"
      variant="outline"
      onClick={handleRefresh}
      disabled={refreshing}
      aria-busy={refreshing}
      className="w-full sm:w-auto shrink-0 h-11 md:h-8 focus-visible:ring-2 focus-visible:ring-violet-200"
    >
      <RefreshCw className={`size-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
      {refreshing ? 'Refreshing…' : 'Refresh Garmin data'}
    </Button>
  )
}
