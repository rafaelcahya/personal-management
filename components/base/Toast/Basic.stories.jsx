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
  title: 'Toast/Basic',
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

export const Basic = {
  name: 'Basic',
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="flex flex-col gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
          Mount <code className="font-mono bg-gray-100 px-1 rounded text-xs">Toast</code> inside a{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">ToastProvider</code> and pair
          it with <code className="font-mono bg-gray-100 px-1 rounded text-xs">ToastViewport</code>{' '}
          to render it in a fixed Portal. Use conditional rendering to show the toast — the
          component handles its own enter/exit animation and calls{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">onOpenChange(false)</code>{' '}
          after the exit animation completes.
        </p>

        <ToastProvider position="bottom-right">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-400">click to trigger</span>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                Show Toast
              </button>
            </div>
          </div>

          {open && (
            <Toast onOpenChange={(o) => !o && setOpen(false)}>
              <div className="flex-1 min-w-0">
                <ToastTitle>Toast notification</ToastTitle>
                <ToastDescription>This is a basic toast message.</ToastDescription>
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
                  title: 'Use Toast for transient, low-stakes confirmations',
                  body: 'Toast is ideal for brief outcome messages like "Saved", "Deleted", or "Copied" — feedback where it is safe for the user to miss the notification and keep working.',
                },
              ],
            },
            {
              heading: 'When not to use',
              cards: [
                {
                  title: "Don't use Toast when the message must always be visible",
                  body: "If the user can't afford to miss the notification — e.g. a sync failure or a permission warning — use a Banner or inline alert that stays on screen until dismissed.",
                },
              ],
            },
            {
              heading: 'Accessibility',
              cards: [
                {
                  title: 'Always include a ToastClose button',
                  body: 'Auto-dismiss may not fire if the tab stays in background or the timer is cleared. A close button guarantees the user can always dismiss the toast manually.',
                },
              ],
            },
            {
              heading: 'Advice',
              cards: [
                {
                  title: 'Always include ToastProvider + ToastViewport in the same tree',
                  body: 'ToastViewport creates the Portal. Without it, the toast renders inside the current DOM and can be clipped by overflow containers.',
                },
                {
                  title: 'Use {open && <Toast>} — not an open prop',
                  body: 'Conditional rendering is the recommended pattern. Mount the toast to show it; the component animates in, auto-dismisses, then calls onOpenChange(false) after the exit animation so you can unmount it cleanly.',
                },
              ],
            },
          ]}
        />

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`const [open, setOpen] = useState(false)

<ToastProvider position="bottom-right">
  <button onClick={() => setOpen(true)}>Show Toast</button>

  {open && (
    <Toast onOpenChange={(o) => !o && setOpen(false)}>
      <div className="flex-1 min-w-0">
        <ToastTitle>Toast notification</ToastTitle>
        <ToastDescription>This is a basic toast message.</ToastDescription>
      </div>
      <ToastClose />
    </Toast>
  )}

  <ToastViewport />
</ToastProvider>`}</code>
        </pre>
      </div>
    )
  },
}
