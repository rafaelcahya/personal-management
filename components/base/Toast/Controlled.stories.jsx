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
  title: 'Toast/Controlled',
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

export const Controlled = {
  name: 'Controlled',
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="flex flex-col gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
          Use a boolean state to control the toast externally. Mount the toast when the state is
          true and pass{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">onOpenChange</code> so the
          component can notify the parent when it auto-dismisses or the user clicks close. This
          pattern is useful when the trigger is elsewhere in the component tree — e.g. a save button
          in a form triggers a toast rendered at the page level.
        </p>

        <ToastProvider position="bottom-right">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-400">
              open: <code className="font-mono">{String(open)}</code>
            </span>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
                >
                  Show
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                >
                  Hide
                </button>
              </div>
            </div>
          </div>

          {open && (
            <Toast onOpenChange={(o) => !o && setOpen(false)} variant="success" duration={Infinity}>
              <div className="flex-1 min-w-0">
                <ToastTitle>Controlled toast</ToastTitle>
                <ToastDescription>
                  Won&apos;t auto-dismiss — hide via button above.
                </ToastDescription>
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
                  title: 'Use controlled mode when the trigger is elsewhere in the component tree',
                  body: 'Controlled is useful when a save button in a form triggers a toast rendered at the page level — the trigger and the toast live in different components, so state lives in a shared ancestor.',
                },
              ],
            },
            {
              heading: 'When not to use',
              cards: [
                {
                  title: "Don't reach for controlled mode just to track open state",
                  body: 'Conditional rendering ({open && <Toast>}) already controls the toast through a boolean. Controlled mode adds no benefit when the trigger and toast are in the same component.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              cards: [
                {
                  title: 'Always wire onOpenChange to sync state after auto-dismiss',
                  body: 'Auto-dismiss fires onOpenChange(false) after the exit animation completes. If you skip this handler, your state stays true after the toast is gone — the next render would immediately re-mount it.',
                },
              ],
            },
            {
              heading: 'Advice',
              cards: [
                {
                  title:
                    'Use duration={Infinity} when the toast notifies about an important async event',
                  body: 'If a toast signals that a background operation is ready (e.g. export ready, file processed), the user may miss a short auto-dismiss. Infinity keeps it visible until acknowledged — always pair with a ToastClose.',
                },
              ],
            },
          ]}
        />

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`const [open, setOpen] = useState(false)

<ToastProvider position="bottom-right">
  <button onClick={() => setOpen(true)}>Show</button>
  <button onClick={() => setOpen(false)}>Hide</button>

  {open && (
    <Toast
      onOpenChange={(o) => !o && setOpen(false)}
      duration={Infinity}
    >
      <div className="flex-1 min-w-0">
        <ToastTitle>Controlled toast</ToastTitle>
        <ToastDescription>Won't auto-dismiss.</ToastDescription>
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
