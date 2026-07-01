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

export const Controlled = {
  name: 'Controlled',
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
          Control the toast state externally via the{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">open</code> and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">onOpenChange</code> props.
          Useful for programmatic show/hide from anywhere in your component tree.
        </p>

        <ToastProvider position="bottom-right">
          <div className="flex flex-col gap-3 w-full max-w-sm items-center">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                Show
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
              >
                Hide
              </button>
            </div>

            <span className="text-xs text-gray-400">
              open: <code className="font-mono">{String(open)}</code>
            </span>
          </div>

          {open && (
            <Toast onOpenChange={(o) => !o && setOpen(false)} variant="success" duration={Infinity}>
              <div className="flex-1 min-w-0">
                <ToastTitle>Controlled toast</ToastTitle>
                <ToastDescription>Won&apos;t auto-dismiss — hide via button above</ToastDescription>
              </div>
              <ToastClose />
            </Toast>
          )}

          <ToastViewport />
        </ToastProvider>

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`const [open, setOpen] = useState(false)

<ToastProvider position="bottom-right">
  <button onClick={() => setOpen(true)}>Show</button>
  <button onClick={() => setOpen(false)}>Hide</button>

  <Toast open={open} onOpenChange={setOpen} duration={Infinity}>
    <div className="flex-1 min-w-0">
      <ToastTitle>Controlled toast</ToastTitle>
      <ToastDescription>Won't auto-dismiss.</ToastDescription>
    </div>
    <ToastClose />
  </Toast>

  <ToastViewport />
</ToastProvider>`}</code>
        </pre>
      </div>
    )
  },
}
