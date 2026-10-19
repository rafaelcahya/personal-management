'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Upload, AlertCircle } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/base/RadioGroup/RadioGroup'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/Select/Select'
import Input from '@/components/base/Input/Input'
import Button from '@/components/base/Button/Button'
import { Spinner } from '@/components/base/Spinner/Spinner'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import { FieldLabel } from '@/components/base/Field/Field'
import { fetchActivities } from '@/lib/api/running'

const PACE_RE = /^([0-9]{1,2}):([0-5][0-9])$/
const TIME_RE = /^(?:([0-9]{1,2}):)?([0-5]?[0-9]):([0-5][0-9])$/

function paceToSec(str) {
  const m = str.match(PACE_RE)
  if (!m) return null
  const sec = Number(m[1]) * 60 + Number(m[2])
  return sec >= 150 && sec <= 900 ? sec : null
}

function timeToSec(str) {
  const m = str.match(TIME_RE)
  if (!m) return null
  const h = m[1] ? Number(m[1]) : 0
  return h * 3600 + Number(m[2]) * 60 + Number(m[3])
}

const inputCls =
  'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500'

export default function SimulatorInput({ onSimulate, simulating }) {
  const [source, setSource] = useState('gpx_upload')
  const [targetMode, setTargetMode] = useState('pace')
  const [pace, setPace] = useState('5:00')
  const [time, setTime] = useState('50:00')
  const [activities, setActivities] = useState([])
  const [activitiesLoading, setActivitiesLoading] = useState(true)
  const [activitiesError, setActivitiesError] = useState(null)
  const [activityId, setActivityId] = useState('')
  const [file, setFile] = useState(null)
  const fileRef = useRef(null)

  const loadActivities = useCallback(async () => {
    setActivitiesLoading(true)
    setActivitiesError(null)
    try {
      const { data } = await fetchActivities({ limit: 50 })
      setActivities((data ?? []).filter((a) => a.elevation_gain_m > 0 && a.distance_m > 0))
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        window.location.href = '/login'
        return
      }
      setActivitiesError(err.message || 'Could not load your activities')
    } finally {
      setActivitiesLoading(false)
    }
  }, [])

  useEffect(() => {
    loadActivities()
  }, [loadActivities])

  async function handleSimulate() {
    const payload = { source, target_mode: targetMode }

    if (targetMode === 'pace') {
      const sec = paceToSec(pace)
      if (!sec) return toast.error('Enter a target pace between 2:30 and 15:00 (mm:ss)')
      payload.target_pace_sec_per_km = sec
    } else {
      const sec = timeToSec(time)
      if (!sec) return toast.error('Enter a valid target time (h:mm:ss or mm:ss)')
      payload.target_time_sec = sec
    }

    if (source === 'gpx_upload') {
      if (!file) return toast.error('Choose a GPX file first')
      payload.gpx = await file.text()
    } else {
      if (!activityId) return toast.error('Select an activity first')
      payload.activity_id = activityId
    }

    onSimulate(payload)
  }

  return (
    <div className="space-y-5">
      {/* Source */}
      <div>
        <FieldLabel className="mb-2 block">Route source</FieldLabel>
        <RadioGroup
          value={source}
          onValueChange={setSource}
          orientation="horizontal"
          className="flex flex-row gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="gpx_upload" id="sourceGpx_routeSimulatorPage" />
            <label
              htmlFor="sourceGpx_routeSimulatorPage"
              className="text-sm font-medium cursor-pointer select-none"
            >
              Upload GPX
            </label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="activity" id="sourceActivity_routeSimulatorPage" />
            <label
              htmlFor="sourceActivity_routeSimulatorPage"
              className="text-sm font-medium cursor-pointer select-none"
            >
              From Activity
            </label>
          </div>
        </RadioGroup>
      </div>

      {source === 'gpx_upload' ? (
        <div>
          <input
            ref={fileRef}
            id="gpxUpload_routeSimulatorPage"
            type="file"
            accept=".gpx,application/gpx+xml"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <Button
            id="chooseGpxBtn_routeSimulatorPage"
            variant="outline"
            onClick={() => fileRef.current?.click()}
            className="w-full min-w-0 justify-center border-dashed"
          >
            <Upload className="size-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0 truncate" title={file?.name}>
              {file ? file.name : 'Choose GPX file'}
            </span>
          </Button>
        </div>
      ) : (
        <div>
          {activitiesLoading && (
            <div id="activitiesLoading_routeSimulatorPage" role="status">
              <Skeleton className="h-9 w-full rounded-md" />
              <span className="sr-only">Loading activities</span>
            </div>
          )}

          {!activitiesLoading && activitiesError && (
            <div
              id="activitiesError_routeSimulatorPage"
              role="alert"
              className="flex flex-col items-center gap-2 rounded-md border border-slate-200 px-3 py-4 text-center"
            >
              <AlertCircle className="size-5 text-red-400" aria-hidden="true" />
              <p className="text-sm text-slate-500">{activitiesError}</p>
              <Button
                id="retryActivitiesBtn_routeSimulatorPage"
                variant="ghost"
                onClick={loadActivities}
                className="text-violet-600"
              >
                Retry
              </Button>
            </div>
          )}

          {!activitiesLoading && !activitiesError && (
            <Select value={activityId} onValueChange={setActivityId}>
              <SelectTrigger
                id="activitySelect_routeSimulatorPage"
                className={inputCls}
                aria-label="Past run to simulate"
              >
                <SelectValue placeholder="Select a past run with elevation" />
              </SelectTrigger>
              <SelectContent>
                {activities.length === 0 && (
                  <div className="px-3 py-2 text-sm text-slate-400">
                    No activities with elevation data
                  </div>
                )}
                {activities.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {new Date(a.started_at).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                    })}{' '}
                    · {(a.distance_m / 1000).toFixed(1)} km · +{Math.round(a.elevation_gain_m)} m
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* Target */}
      <div>
        <FieldLabel className="mb-2 block">Target</FieldLabel>
        <RadioGroup
          value={targetMode}
          onValueChange={setTargetMode}
          orientation="horizontal"
          className="flex flex-row gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="pace" id="targetPace_routeSimulatorPage" />
            <label
              htmlFor="targetPace_routeSimulatorPage"
              className="text-sm font-medium cursor-pointer select-none"
            >
              Pace
            </label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="time" id="targetTime_routeSimulatorPage" />
            <label
              htmlFor="targetTime_routeSimulatorPage"
              className="text-sm font-medium cursor-pointer select-none"
            >
              Finish time
            </label>
          </div>
        </RadioGroup>
      </div>

      {targetMode === 'pace' ? (
        <div>
          <FieldLabel htmlFor="targetPaceInput_routeSimulatorPage" className="mb-2 block">
            Target pace (mm:ss per km)
          </FieldLabel>
          <Input
            id="targetPaceInput_routeSimulatorPage"
            value={pace}
            onChange={(e) => setPace(e.target.value)}
            placeholder="5:00"
            inputMode="numeric"
            className={inputCls}
          />
        </div>
      ) : (
        <div>
          <FieldLabel htmlFor="targetTimeInput_routeSimulatorPage" className="mb-2 block">
            Target finish time (h:mm:ss or mm:ss)
          </FieldLabel>
          <Input
            id="targetTimeInput_routeSimulatorPage"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="50:00"
            inputMode="numeric"
            className={inputCls}
          />
        </div>
      )}

      <Button
        id="simulateBtn_routeSimulatorPage"
        onClick={handleSimulate}
        disabled={simulating}
        className="w-full justify-center bg-violet-600 hover:bg-violet-700"
      >
        {simulating ? <Spinner className="size-4" /> : 'Simulate'}
      </Button>
    </div>
  )
}
