'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, AlertTriangle } from 'lucide-react'
import { fetchGarminConnection } from '@/lib/api/running'
import { GARMIN_EXPIRY_WARNING_DAYS, daysUntilExpiry } from '../../../utils/garmin'
import { formatRelativeTime } from '../utils/format'

const SETTINGS_HREF = '/main/running/settings#garminConnectionSection_settings'
const LINK_CLASS =
  'underline underline-offset-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200'

/**
 * Garmin part of the sync status bar. Strava text never waits on it: while loading, on error,
 * or when Garmin is not connected, nothing is rendered.
 */
export default function GarminSyncSegment() {
  const [connection, setConnection] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchGarminConnection()
      .then((data) => {
        if (!cancelled) setConnection(data)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  if (!connection || connection.status === 'not_connected') return null

  const { status } = connection

  if (status === 'expired' || status === 'invalid') {
    return (
      <div
        id="garminSyncStatus_dashboard"
        role="status"
        className="flex items-center gap-1.5 text-xs font-medium text-red-600"
      >
        <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
        <span>{status === 'expired' ? 'Garmin key expired' : 'Garmin key rejected'}</span>
        <Link id="garminSettingsLink_dashboard" href={SETTINGS_HREF} className={LINK_CLASS}>
          Fix in Settings
        </Link>
      </div>
    )
  }

  const days = daysUntilExpiry(connection.key_expires_at)
  if (days != null && days <= GARMIN_EXPIRY_WARNING_DAYS) {
    return (
      <div
        id="garminSyncStatus_dashboard"
        role="status"
        className="flex items-center gap-1.5 text-xs font-medium text-amber-600"
      >
        <AlertTriangle className="size-3.5 shrink-0" aria-hidden="true" />
        <Link id="garminSettingsLink_dashboard" href={SETTINGS_HREF} className={LINK_CLASS}>
          {days <= 0
            ? 'Garmin key expires today'
            : `Garmin key expires in ${days} ${days === 1 ? 'day' : 'days'}`}
        </Link>
      </div>
    )
  }

  return (
    <div
      id="garminSyncStatus_dashboard"
      role="status"
      className="flex items-center gap-1.5 text-xs text-slate-400"
    >
      <span>Garmin: {connection.last_synced_at ? 'synced' : 'never synced'}</span>
      {connection.last_synced_at && (
        <span className="font-medium text-slate-500">
          {formatRelativeTime(connection.last_synced_at)}
        </span>
      )}
    </div>
  )
}
