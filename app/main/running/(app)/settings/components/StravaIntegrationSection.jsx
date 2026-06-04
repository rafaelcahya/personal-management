'use client'

import { useState } from 'react'
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { syncStrava } from '@/lib/api/running'

export default function StravaIntegrationSection() {
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState(null)
  const [syncError, setSyncError] = useState(null)

  async function handleSync() {
    setSyncing(true)
    setSyncResult(null)
    setSyncError(null)
    try {
      const result = await syncStrava()
      setSyncResult(result.synced)
    } catch (err) {
      if (err.message === 'Strava not connected') {
        setSyncError('Strava is not connected. Connect your account first.')
      } else {
        setSyncError(err.message || 'Sync failed. Please try again.')
      }
    } finally {
      setSyncing(false)
    }
  }

  return (
    <section aria-label="Strava integration">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Strava Integration
      </h2>
      <Card className="border border-slate-200/70 py-0">
        <CardContent className="px-5 py-4 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-800">Sync Strava Activities</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Pull your latest runs from Strava into the dashboard. Only new activities since the
                last sync are imported.
              </p>
            </div>
            <Button
              id="syncStravaBtn_settings"
              onClick={handleSync}
              disabled={syncing}
              size="sm"
              className="bg-[#FC4C02] hover:bg-[#e04402] text-white shrink-0"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              {syncing ? 'Syncing…' : 'Sync Now'}
            </Button>
          </div>

          {syncResult !== null && (
            <div
              id="syncSuccessMsg_settings"
              className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700"
              role="status"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              {syncResult === 0
                ? 'Already up to date — no new activities found.'
                : `${syncResult} new ${syncResult === 1 ? 'activity' : 'activities'} imported successfully.`}
            </div>
          )}

          {syncError && (
            <div
              id="syncErrorMsg_settings"
              className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              {syncError}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
