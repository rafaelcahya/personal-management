import { useState } from 'react'
import { Tooltip, TooltipTrigger, TooltipContent } from './Tooltip'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tooltip/Animation',
}

export default meta

const btnClass =
  'inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors cursor-default'

const presets = ['fast', 'default', 'slow', 'slower']
const presetMs = { fast: 100, default: 150, slow: 300, slower: 500 }

function DurationDemo() {
  const [preset, setPreset] = useState('default')
  const [customMs, setCustomMs] = useState('')
  const [inputMs, setInputMs] = useState('')

  const activeDuration = customMs ? Number(customMs) : preset

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setPreset(p)
              setCustomMs('')
              setInputMs('')
            }}
            className={[
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              preset === p && !customMs
                ? 'bg-slate-900 text-white border-slate-900'
                : 'border-slate-200 hover:bg-accent',
            ].join(' ')}
          >
            {p} · {presetMs[p]}ms
          </button>
        ))}
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={0}
            max={2000}
            placeholder="ms"
            value={inputMs}
            onChange={(e) => setInputMs(e.target.value)}
            className="w-20 px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="button"
            onClick={() => {
              if (inputMs) {
                setCustomMs(inputMs)
                setPreset('')
              }
            }}
            className="px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-accent transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      <div>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button type="button" className={btnClass}>
              Hover to preview — duration:{' '}
              {customMs ? `${customMs}ms (custom)` : `${preset} (${presetMs[preset]}ms)`}
            </button>
          </TooltipTrigger>
          <TooltipContent animation="zoom" duration={activeDuration}>
            Animation duration demo
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

export const Animation = {
  name: 'Animation',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Five animation types via the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">animation</code> prop. Control
        speed with <code className="font-mono bg-gray-100 px-1 rounded text-xs">duration</code> —
        named presets or a raw integer in milliseconds.
      </p>

      <div className="flex flex-col gap-5 w-full max-w-2xl">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">animation types — hover each</span>
          <div className="flex items-center gap-3 flex-wrap">
            {['none', 'fade', 'zoom', 'slide-up', 'slide-down'].map((anim) => (
              <Tooltip key={anim} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button type="button" className={btnClass}>
                    {anim}
                  </button>
                </TooltipTrigger>
                <TooltipContent animation={anim} duration="slow">
                  animation="{anim}"
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">duration</span>
          <DurationDemo />
        </div>
      </div>
    </div>
  ),
}
