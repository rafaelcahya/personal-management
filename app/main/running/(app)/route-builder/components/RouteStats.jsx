'use client'

import { useState, useEffect, useRef } from 'react'
import { FieldContent, FieldLabel } from '@/components/base/Field/Field'
import { Loader2, Info } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/base/Popover/Popover'
import { fmtDuration } from '@/app/main/running/(app)/dashboard/utils/format'

const PACE_REGEX = /^[0-9]{1,2}:[0-5][0-9]$/

function parsePaceToSec(mmss) {
  if (!PACE_REGEX.test(mmss)) return null
  const [m, s] = mmss.split(':').map(Number)
  return m * 60 + s
}

export default function RouteStats({
  distanceM,
  waypointCount,
  routeName,
  onRouteNameChange,
  onSave,
  onUndo,
  onClear,
  saving,
  defaultPaceMmss,
  onEstimatedSecChange,
}) {
  const distanceKm = (distanceM / 1000).toFixed(2)
  const canSave = waypointCount >= 2 && routeName.trim().length > 0

  const [pace, setPace] = useState('')
  const [paceError, setPaceError] = useState(false)
  const hasUserEdited = useRef(false)

  useEffect(() => {
    if (defaultPaceMmss && !hasUserEdited.current) setPace(defaultPaceMmss)
  }, [defaultPaceMmss])

  function handlePaceChange(e) {
    hasUserEdited.current = true
    const val = e.target.value
    setPace(val)
    setPaceError(val.length > 0 && !PACE_REGEX.test(val))
  }

  const paceSec = parsePaceToSec(pace)
  // Pace below 2:00/km (120 sec) is physically impossible for a runner
  const paceUnrealistic = paceSec != null && paceSec > 0 && paceSec < 120
  const estimatedSec =
    paceSec != null && paceSec > 0 && distanceM > 0
      ? Math.round(paceSec * (distanceM / 1000))
      : null

  useEffect(() => {
    onEstimatedSecChange?.(estimatedSec)
  }, [estimatedSec, onEstimatedSecChange])

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-xl border border-slate-200">
      {/* Distance + Waypoints */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Distance</p>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  id="distanceTooltip_routeBuilderPage"
                  type="button"
                  aria-label="Distance info"
                  className="flex items-center text-slate-300 hover:text-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-400 rounded"
                >
                  <Info className="size-3" />
                </button>
              </PopoverTrigger>
              <PopoverContent side="top" align="start" className="text-xs text-slate-600 max-w-52">
                Straight-line estimate; actual road distance will be longer
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-2xl font-bold text-slate-800 tabular-nums">
            {distanceKm}
            <span className="text-sm font-medium text-slate-400 ml-1">km</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Waypoints</p>
          <p className="text-2xl font-bold text-slate-800 tabular-nums">{waypointCount}</p>
        </div>
      </div>

      {/* Pace input + Est. Time */}
      <div className="flex flex-col gap-2">
        <FieldContent>
          <FieldLabel htmlFor="paceInput_routeBuilderPage">Pace (MM:SS /km)</FieldLabel>
          <Input
            id="paceInput_routeBuilderPage"
            type="text"
            placeholder="e.g. 5:30"
            value={pace}
            onChange={handlePaceChange}
            maxLength={5}
            className={`text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${paceError ? 'border-red-400 focus-visible:border-red-400 focus-visible:ring-red-200' : ''}`}
          />
          {paceError && <p className="text-xs text-red-500 mt-0.5">Enter a valid pace (MM:SS)</p>}
          {!paceError && paceUnrealistic && (
            <p className="text-xs text-amber-500 mt-0.5">
              Pace seems too fast — did you mean a slower value?
            </p>
          )}
        </FieldContent>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Est. Time</span>
          <span
            id="estimatedTime_routeBuilderPage"
            className="font-semibold text-slate-700 tabular-nums"
          >
            {estimatedSec != null ? fmtDuration(estimatedSec) : '—'}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          id="undoWaypointBtn_routeBuilderPage"
          variant="outline"
          onClick={onUndo}
          disabled={waypointCount === 0}
          className="flex-1 text-sm"
        >
          Undo
        </Button>
        <Button
          id="clearRouteBtn_routeBuilderPage"
          variant="outline"
          onClick={onClear}
          disabled={waypointCount === 0}
          className="flex-1 text-sm text-red-600 border-red-200 hover:bg-red-50"
        >
          Clear
        </Button>
      </div>

      {/* Save form */}
      <div className="flex flex-col gap-2">
        <FieldContent>
          <FieldLabel htmlFor="routeNameInput_routeBuilderPage">Route name</FieldLabel>
          <Input
            id="routeNameInput_routeBuilderPage"
            type="text"
            placeholder="e.g. Morning loop"
            value={routeName}
            onChange={(e) => onRouteNameChange(e.target.value)}
            maxLength={100}
            className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
          />
        </FieldContent>

        <Button
          id="saveRouteBtn_routeBuilderPage"
          disabled={!canSave || saving}
          onClick={onSave}
          className="w-full bg-violet-600 hover:bg-violet-700"
        >
          {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
          {saving ? 'Saving…' : 'Save Route'}
        </Button>

        {waypointCount < 2 && waypointCount > 0 && (
          <p className="text-xs text-slate-400 text-center">Add at least 2 waypoints to save</p>
        )}
      </div>
    </div>
  )
}
