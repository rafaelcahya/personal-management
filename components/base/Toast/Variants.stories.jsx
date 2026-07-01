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
  title: 'Toast/Variants',
}

export default meta

const variants = [
  {
    name: 'default',
    label: 'Default',
    title: 'Default toast',
    desc: 'General purpose notification.',
  },
  { name: 'info', label: 'Info', title: 'Info', desc: 'Here is some useful information.' },
  { name: 'success', label: 'Success', title: 'Saved!', desc: 'Your changes have been saved.' },
  {
    name: 'warning',
    label: 'Warning',
    title: 'Heads up',
    desc: 'This action may have side effects.',
  },
  {
    name: 'danger',
    label: 'Danger',
    title: 'Error',
    desc: 'Something went wrong. Please try again.',
  },
]

export const Variants = {
  name: 'Variants',
  render: () => {
    const [activeVariant, setActiveVariant] = useState(null)

    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
          Five semantic variants via the{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant</code> prop. Click a
          button to preview each one.
        </p>

        <ToastProvider position="bottom-right">
          <div className="flex flex-col gap-3 w-full max-w-sm">
            {variants.map((v) => (
              <button
                key={v.name}
                type="button"
                onClick={() => setActiveVariant(v.name)}
                className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
              >
                {v.label}
              </button>
            ))}
          </div>

          {activeVariant && (
            <Toast
              key={activeVariant}
              onOpenChange={(o) => !o && setActiveVariant(null)}
              variant={activeVariant}
            >
              <div className="flex-1 min-w-0">
                <ToastTitle>{variants.find((v) => v.name === activeVariant)?.title}</ToastTitle>
                <ToastDescription>
                  {variants.find((v) => v.name === activeVariant)?.desc}
                </ToastDescription>
              </div>
              <ToastClose />
            </Toast>
          )}

          <ToastViewport />
        </ToastProvider>

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`<Toast variant="default">...</Toast>
<Toast variant="info">...</Toast>
<Toast variant="success">...</Toast>
<Toast variant="warning">...</Toast>
<Toast variant="danger">...</Toast>`}</code>
        </pre>
      </div>
    )
  },
}
