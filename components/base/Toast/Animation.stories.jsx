import { useState } from 'react'
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from './Toast'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Toast/Animation',
}

export default meta

const animations = [
  {
    value: 'slide-fade',
    label: 'slide-fade',
    desc: 'Slides up from bottom + fades in. Slides right + fades out.',
  },
  {
    value: 'slide',
    label: 'slide',
    desc: 'Slides up from bottom on enter. Slides right on exit. No opacity change.',
  },
  { value: 'fade', label: 'fade', desc: 'Fades in and out only. No position movement.' },
  { value: 'none', label: 'none', desc: 'Appears and disappears instantly with no transition.' },
]

const durationPresets = [
  { label: '1s', value: 1000 },
  { label: '3s', value: 3000 },
  { label: '5s', value: 5000 },
  { label: '∞', value: Infinity },
]

function AnimationDemo({ animValue }) {
  const [open, setOpen] = useState(false)

  const trigger = () => {
    setOpen(false)
    setTimeout(() => setOpen(true), 50)
  }

  return (
    <ToastProvider position="bottom-right">
      <button
        type="button"
        onClick={trigger}
        className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
      >
        {animValue}
      </button>

      {open && (
        <Toast onOpenChange={(o) => !o && setOpen(false)} animation={animValue} duration={3000}>
          <div className="flex-1 min-w-0">
            <ToastTitle>animation=&quot;{animValue}&quot;</ToastTitle>
            <ToastDescription>Click ✕ to see exit animation.</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
      )}

      <ToastViewport />
    </ToastProvider>
  )
}

function DurationDemo() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(3000)
  const [customMs, setCustomMs] = useState('')
  const [inputMs, setInputMs] = useState('')

  const activeDuration = customMs ? Number(customMs) : selected

  const trigger = () => {
    setOpen(false)
    setTimeout(() => setOpen(true), 50)
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      <div className="flex items-center gap-2 flex-wrap">
        {durationPresets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setSelected(p.value)
              setCustomMs('')
              setInputMs('')
            }}
            className={[
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              selected === p.value && !customMs
                ? 'bg-slate-900 text-white border-slate-900'
                : 'border-slate-200 hover:bg-accent',
            ].join(' ')}
          >
            {p.label}
          </button>
        ))}
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={500}
            max={10000}
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
                setSelected(null)
              }
            }}
            className="px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-accent transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      <ToastProvider position="bottom-right">
        <button
          type="button"
          onClick={trigger}
          className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          Show toast —{' '}
          {activeDuration === Infinity
            ? 'no auto-dismiss'
            : `dismisses after ${activeDuration / 1000}s`}
        </button>

        {open && (
          <Toast onOpenChange={(o) => !o && setOpen(false)} duration={activeDuration}>
            <div className="flex-1 min-w-0">
              <ToastTitle>Duration demo</ToastTitle>
              <ToastDescription>
                {activeDuration === Infinity
                  ? 'Stays until dismissed manually.'
                  : `Auto-dismisses after ${activeDuration}ms.`}
              </ToastDescription>
            </div>
            <ToastClose />
          </Toast>
        )}

        <ToastViewport />
      </ToastProvider>
    </div>
  )
}

export const Animation = {
  name: 'Animation',
  render: () => (
    <div className="flex flex-col items-center gap-8 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Control the enter/exit animation via the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">animation</code> prop. Click
        each button to preview — then click ✕ to see the exit animation.
      </p>

      <div className="flex flex-col gap-8 w-full max-w-2xl">
        <div className="flex flex-col gap-3">
          <span className="text-xs text-gray-400">animation types</span>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Value', 'Enter', 'Exit'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 border border-gray-200 text-xs font-semibold text-gray-700 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['slide-fade', 'Slide up + fade in', 'Slide right + fade out'],
                  ['slide', 'Slide up', 'Slide right'],
                  ['fade', 'Fade in', 'Fade out'],
                  ['none', 'Instant', 'Instant'],
                ].map(([val, enter, exit]) => (
                  <tr key={val} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                      {val}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                      {enter}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                      {exit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
            {animations.map((a) => (
              <AnimationDemo key={a.value} animValue={a.value} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">duration</span>
          <DurationDemo />
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Toast animation="slide-fade">...</Toast>  {/* default */}
<Toast animation="slide">...</Toast>
<Toast animation="fade">...</Toast>
<Toast animation="none">...</Toast>

{/* combine with duration */}
<Toast animation="fade" duration={3000}>...</Toast>`}</code>
      </pre>
    </div>
  ),
}
