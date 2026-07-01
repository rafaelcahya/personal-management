import { useState } from 'react'
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
} from './Toast'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Toast/With Action',
}

export default meta

function ActionDemo({ position, label, triggerLabel, variant, title, desc, actionLabel }) {
  const [open, setOpen] = useState(false)
  const [acted, setActed] = useState(false)

  const handleShow = () => {
    setActed(false)
    setOpen(true)
  }

  return (
    <div className="flex flex-col gap-1.5 w-full max-w-sm">
      <span className="text-xs text-gray-400">{label}</span>
      <ToastProvider position="bottom-right">
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleShow}
            className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            {triggerLabel}
          </button>
          {acted && (
            <p className="text-xs text-emerald-600 font-medium text-center">✓ Action triggered</p>
          )}
        </div>

        {open && (
          <Toast onOpenChange={(o) => !o && setOpen(false)} variant={variant}>
            <div className="flex-1 min-w-0">
              <ToastTitle>{title}</ToastTitle>
              <ToastDescription>{desc}</ToastDescription>
            </div>
            <ToastAction
              position={position}
              altText={actionLabel}
              variant={variant}
              onClick={() => {
                setActed(true)
                setOpen(false)
              }}
            >
              {actionLabel}
            </ToastAction>
            <ToastClose />
          </Toast>
        )}

        <ToastViewport />
      </ToastProvider>
    </div>
  )
}

export const WithAction = {
  name: 'With Action',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">ToastAction</code> to
        render a button inside the toast. The{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">position</code> prop controls
        whether the action sits inline next to the text or stacked below it.
      </p>

      <div className="flex flex-col gap-6 w-full max-w-sm">
        <ActionDemo
          position="inline"
          label='position="inline" (default)'
          triggerLabel="Delete item"
          variant="danger"
          title="Item deleted"
          desc="This action can be undone within 5 seconds."
          actionLabel="Undo"
        />

        <ActionDemo
          position="stacked-left"
          label='position="stacked-left"'
          triggerLabel="Update available"
          variant="info"
          title="Update available"
          desc="A new version is ready. Install now or later."
          actionLabel="Install now"
        />

        <ActionDemo
          position="stacked-right"
          label='position="stacked-right"'
          triggerLabel="Changes saved"
          variant="success"
          title="Changes saved"
          desc="Your draft has been saved to the cloud."
          actionLabel="View"
        />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* inline — action sits in the same row as title/description */}
<Toast variant="danger">
  <div className="flex-1 min-w-0">
    <ToastTitle>Item deleted</ToastTitle>
    <ToastDescription>This action can be undone within 5 seconds.</ToastDescription>
  </div>
  <ToastAction position="inline" altText="Undo" variant="danger">Undo</ToastAction>
  <ToastClose />
</Toast>

{/* stacked-left — action on its own row, left-aligned */}
<Toast variant="info">
  <div className="flex-1 min-w-0">
    <ToastTitle>Update available</ToastTitle>
    <ToastDescription>A new version is ready. Install now or later.</ToastDescription>
  </div>
  <ToastAction position="stacked-left" altText="Install now" variant="info">Install now</ToastAction>
  <ToastClose />
</Toast>

{/* stacked-right — action on its own row, right-aligned */}
<Toast variant="success">
  <div className="flex-1 min-w-0">
    <ToastTitle>Changes saved</ToastTitle>
    <ToastDescription>Your draft has been saved to the cloud.</ToastDescription>
  </div>
  <ToastAction position="stacked-right" altText="View" variant="success">View</ToastAction>
  <ToastClose />
</Toast>`}</code>
      </pre>
    </div>
  ),
}
