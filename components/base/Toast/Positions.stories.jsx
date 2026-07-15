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
  title: 'Toast/Positions',
}

export default meta

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full max-w-2xl">
    {items.map(({ heading, cards }) => (
      <div key={heading}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {heading}
        </p>
        <div className="flex flex-col gap-3">
          {cards.map(({ title, body }) => (
            <div
              key={title}
              className="flex gap-3 p-4 rounded-lg border border-violet-100 bg-violet-50"
            >
              <span className="mt-0.5 shrink-0 size-4 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </span>
              <div>
                <p className="text-xs font-semibold text-violet-800 mb-0.5">{title}</p>
                <p className="text-xs text-violet-700 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

const positions = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]

export const Positions = {
  name: 'Positions',
  render: () => {
    const [activePosition, setActivePosition] = useState(null)

    return (
      <div className="flex flex-col gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
          Set the <code className="font-mono bg-gray-100 px-1 rounded text-xs">position</code> prop
          on <code className="font-mono bg-gray-100 px-1 rounded text-xs">ToastProvider</code> to
          control where the toast stack appears. The slide animation direction adjusts automatically
          to match the position — e.g. bottom-right slides in from the right, top-center slides in
          from the top. Click a position to preview it.
        </p>

        <ToastProvider position={activePosition ?? 'bottom-right'}>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-400">click a position to trigger</span>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-3 gap-2">
                {positions.map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setActivePosition(pos)}
                    className={[
                      'inline-flex items-center justify-center px-3 py-2 rounded-lg border text-xs font-medium transition-colors',
                      activePosition === pos
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'hover:bg-accent',
                    ].join(' ')}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {activePosition && (
            <Toast
              key={activePosition}
              onOpenChange={(o) => !o && setActivePosition(null)}
              variant="info"
            >
              <div className="flex-1 min-w-0">
                <ToastTitle>Position: {activePosition}</ToastTitle>
                <ToastDescription>Toast rendered at {activePosition}.</ToastDescription>
              </div>
              <ToastClose />
            </Toast>
          )}

          <ToastViewport />
        </ToastProvider>

        <BestPractices
          items={[
            {
              heading: 'When to use',
              cards: [
                {
                  title: 'Default to bottom-right for standard notifications',
                  body: 'Bottom-right is the platform convention for transient toasts on web, macOS, and Windows. Only deviate when the UI has a specific spatial reason — e.g. a bottom sheet occupying the bottom edge.',
                },
              ],
            },
            {
              heading: 'When not to use',
              cards: [
                {
                  title: "Don't mix positions within the same app",
                  body: 'If toasts appear in both top-right and bottom-right simultaneously, users lose track of where to look. Pick one position and use it consistently across all toast triggers in the app.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              cards: [
                {
                  title: "The slide direction matches the position automatically — don't fight it",
                  body: 'top-left slides in from the left, bottom-center from the bottom. These are intentional and match platform expectations. Overriding the animation direction creates a disorienting mismatch.',
                },
              ],
            },
            {
              heading: 'Advice',
              cards: [
                {
                  title: 'Use one ToastProvider per position',
                  body: 'Each ToastProvider owns one viewport slot. If you genuinely need toasts at two positions simultaneously (e.g. top-right for errors, bottom-right for confirmations), mount two separate ToastProvider + ToastViewport pairs.',
                },
              ],
            },
          ]}
        />

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`<ToastProvider position="top-left">...</ToastViewport /></ToastProvider>
<ToastProvider position="top-center">...</ToastViewport /></ToastProvider>
<ToastProvider position="top-right">...</ToastViewport /></ToastProvider>
<ToastProvider position="bottom-left">...</ToastViewport /></ToastProvider>
<ToastProvider position="bottom-center">...</ToastViewport /></ToastProvider>
<ToastProvider position="bottom-right">...</ToastViewport /></ToastProvider>`}</code>
        </pre>
      </div>
    )
  },
}
