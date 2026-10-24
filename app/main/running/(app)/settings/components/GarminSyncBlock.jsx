'use client'

import { useState } from 'react'
import { RefreshCw, ChevronDown } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import DatePicker from '@/components/base/DatePicker/DatePicker/DatePicker'
import { FieldContent, FieldLabel } from '@/components/base/Field/Field'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/base/Collapsible/Collapsible'
import { syncGarmin } from '@/lib/api/running'
import {
  FIELD_CLASS,
  GARMIN_BTN_CLASS,
  fromIsoDate,
  toIsoDate,
  validateSyncRange,
} from '../../../utils/garmin'

/**
 * Manual Garmin sync. The server only queues the work, so there is no polling: the status is
 * re-read quietly and new data shows up on the next visit to a run.
 */
export default function GarminSyncBlock({ onStatusRefresh, onNotConnected, onError }) {
  const [syncing, setSyncing] = useState(false)
  const [notice, setNotice] = useState(null)
  const [rangeOpen, setRangeOpen] = useState(false)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [serverRangeError, setServerRangeError] = useState(null)

  const rangeError = validateSyncRange(from, to) ?? serverRangeError
  const today = new Date()

  function changeDate(setter) {
    return (date) => {
      setter(toIsoDate(date))
      setServerRangeError(null)
    }
  }

  async function handleSync() {
    setSyncing(true)
    setNotice(null)
    setServerRangeError(null)
    onError(null)
    try {
      await syncGarmin(from && to ? { from, to } : null)
      setNotice('Sync started. New data will appear shortly.')
      onStatusRefresh()
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        window.location.href = '/login'
        return
      }
      if (err.status === 429) {
        setNotice('A Garmin sync is already running.')
      } else if (err.status === 409) {
        onNotConnected()
        onError(`${err.message}.`)
      } else if (err.status === 400) {
        setRangeOpen(true)
        setServerRangeError(err.message)
      } else {
        onError(err.message || 'Sync failed. Please try again.')
      }
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div id="garminSyncBlock_settings" className="px-5 py-4 flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-800">Sync Garmin Data</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Link Garmin numbers to your runs and import runs that are missing. Defaults to the last
            7 days.
          </p>
        </div>
        <Button
          id="garminSyncNowBtn_settings"
          onClick={handleSync}
          disabled={syncing || Boolean(rangeError)}
          className={`${GARMIN_BTN_CLASS} w-full sm:w-auto`}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
          {syncing ? 'Syncing…' : 'Sync Now'}
        </Button>
      </div>

      <Collapsible open={rangeOpen} onOpenChange={setRangeOpen}>
        <CollapsibleTrigger asChild>
          <Button
            id="garminSyncRangeToggle_settings"
            variant="ghost"
            aria-expanded={rangeOpen}
            className="self-start h-11 md:h-8 px-2 text-xs text-slate-500 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-violet-200"
          >
            <ChevronDown
              className={`size-3.5 transition-transform ${rangeOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
            Choose dates (optional, max 90 days)
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <FieldContent className="flex-1" error={rangeError ? ' ' : undefined}>
                <FieldLabel htmlFor="garminSyncFromInput_settings">From</FieldLabel>
                <DatePicker
                  id="garminSyncFromInput_settings"
                  value={fromIsoDate(from)}
                  onChange={changeDate(setFrom)}
                  toDate={today}
                  placeholder="Start date"
                  className={FIELD_CLASS}
                  disabled={syncing}
                />
              </FieldContent>
              <FieldContent className="flex-1" error={rangeError ? ' ' : undefined}>
                <FieldLabel htmlFor="garminSyncToInput_settings">To</FieldLabel>
                <DatePicker
                  id="garminSyncToInput_settings"
                  value={fromIsoDate(to)}
                  onChange={changeDate(setTo)}
                  toDate={today}
                  placeholder="End date"
                  className={FIELD_CLASS}
                  disabled={syncing}
                />
              </FieldContent>
            </div>
            {rangeError && (
              <p
                id="garminSyncRangeError_settings"
                role="alert"
                className="text-xs font-medium text-destructive"
              >
                {rangeError}
              </p>
            )}
            {(from || to) && (
              <Button
                id="garminSyncRangeClearBtn_settings"
                variant="ghost"
                onClick={() => {
                  setFrom('')
                  setTo('')
                  setServerRangeError(null)
                }}
                className="self-start h-11 md:h-8 px-2 text-xs text-slate-500"
              >
                Clear dates
              </Button>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {notice && (
        <div
          id="garminSyncNoticeMsg_settings"
          role="status"
          className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-sm text-blue-700"
        >
          <RefreshCw className="w-4 h-4 shrink-0" aria-hidden="true" />
          {notice}
        </div>
      )}
    </div>
  )
}
