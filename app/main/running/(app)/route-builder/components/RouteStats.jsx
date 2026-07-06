'use client'

import { Loader2 } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import FieldContent from '@/components/base/Field/FieldContent'
import FieldLabel from '@/components/base/Field/FieldLabel'

export default function RouteStats({
  distanceM,
  waypointCount,
  routeName,
  onRouteNameChange,
  onSave,
  onUndo,
  onClear,
  saving,
}) {
  const distanceKm = (distanceM / 1000).toFixed(2)
  const canSave = waypointCount >= 2 && routeName.trim().length > 0

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-xl border border-slate-200">
      {/* Distance stat */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Distance</p>
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

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          id="undoWaypointBtn_routeBuilderPage"
          variant="outline"
          size="base"
          onClick={onUndo}
          disabled={waypointCount === 0}
          className="flex-1 text-sm"
        >
          Undo
        </Button>
        <Button
          id="clearRouteBtn_routeBuilderPage"
          variant="outline"
          size="base"
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
          size="base"
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
