'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/base/Button/Button'
import { RefreshCw, CheckCircle2 } from 'lucide-react'
import { syncStrava, fetchSyncStatus } from '@/lib/api/running'

function formatRelativeTime(isoString) {
  if (!isoString) return null
  const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)
  if (diffSec < 60) return 'just now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}h ago`
  return `${Math.floor(diffHour / 24)}d ago`
}

export default function SyncStravaButton({ id = 'syncStravaBtn', actions }) {
  const [connected, setConnected] = useState(false)
  const [lastSyncAt, setLastSyncAt] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState(null)

  useEffect(() => {
    fetchSyncStatus()
      .then((data) => {
        setConnected(data.connected)
        setLastSyncAt(data.last_sync_at ?? null)
      })
      .catch(() => {})
  }, [])

  if (!connected) return null

  async function handleSync() {
    setSyncing(true)
    setSyncResult(null)
    try {
      const result = await syncStrava()
      setLastSyncAt(new Date().toISOString())
      setSyncResult({ count: result.synced })
    } catch {
      // sync failure is non-blocking
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div
      id={`${id}_bar`}
      className="flex flex-col rounded-lg bg-slate-50 border border-slate-200/70 px-4 py-2.5 gap-0"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Last synced:</span>
          <span className="font-medium text-slate-500">
            {lastSyncAt ? formatRelativeTime(lastSyncAt) : 'Never'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:contents">{actions}</span>
          {syncResult !== null && (
            <span
              className={`flex items-center gap-1.5 text-xs font-medium ${
                syncResult.count > 0 ? 'text-green-600' : 'text-slate-400'
              }`}
            >
              <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
              {syncResult.count > 0
                ? `${syncResult.count} new ${syncResult.count === 1 ? 'activity' : 'activities'}`
                : 'Already up to date'}
            </span>
          )}
          <Button
            id={id}
            variant="ghost"
            size="xs"
            onClick={handleSync}
            disabled={syncing}
            className="text-slate-500 hover:bg-slate-200"
          >
            <RefreshCw className={`size-3 ${syncing ? 'animate-spin' : ''}`} aria-hidden="true" />
            {syncing ? 'Syncing…' : 'Sync'}
          </Button>
        </div>
      </div>

      {actions && (
        <div className="md:hidden border-t border-slate-200/70 mt-2 pt-2 flex justify-end">
          {actions}
        </div>
      )}
    </div>
  )
}
