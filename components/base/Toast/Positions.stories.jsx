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
      <div className="flex flex-col items-center gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
          Six screen positions via the{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">position</code> prop on{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">ToastProvider</code>. Click a
          position to preview it.
        </p>

        <ToastProvider position={activePosition ?? 'bottom-right'}>
          <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
            {positions.map((pos) => (
              <button
                key={pos}
                type="button"
                onClick={() => setActivePosition(pos)}
                className="inline-flex items-center justify-center px-3 py-2 rounded-lg border text-xs font-medium hover:bg-accent transition-colors"
              >
                {pos}
              </button>
            ))}
          </div>

          {activePosition && (
            <Toast
              key={activePosition}
              onOpenChange={(o) => !o && setActivePosition(null)}
              variant="info"
            >
              <div className="flex-1 min-w-0">
                <ToastTitle>Position: {activePosition}</ToastTitle>
                <ToastDescription>Toast rendered at {activePosition}</ToastDescription>
              </div>
              <ToastClose />
            </Toast>
          )}

          <ToastViewport />
        </ToastProvider>

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`<ToastProvider position="top-left">
  ...
  <ToastViewport />
</ToastProvider>

<ToastProvider position="top-center">...</ToastProvider>
<ToastProvider position="top-right">...</ToastProvider>
<ToastProvider position="bottom-left">...</ToastProvider>
<ToastProvider position="bottom-center">...</ToastProvider>
<ToastProvider position="bottom-right">...</ToastProvider>`}</code>
        </pre>
      </div>
    )
  },
}
