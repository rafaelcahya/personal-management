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

export const Basic = {
  name: 'Basic',
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
          Click the button to trigger a toast. The toast auto-dismisses after 5 seconds or can be
          closed manually via the{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">ToastClose</code> button.
        </p>

        <ToastProvider position="bottom-right">
          <div className="flex flex-col gap-4 items-center w-full max-w-sm">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              Show Toast
            </button>
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

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`const [open, setOpen] = useState(false)

<ToastProvider position="bottom-right">
  <button onClick={() => setOpen(true)}>Show Toast</button>

  <Toast open={open} onOpenChange={setOpen}>
    <div className="flex-1 min-w-0">
      <ToastTitle>Toast notification</ToastTitle>
      <ToastDescription>This is a basic toast message.</ToastDescription>
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
