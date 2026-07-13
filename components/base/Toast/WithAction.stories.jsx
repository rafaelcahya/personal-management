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

function ActionDemo({ position, variant, title, desc, actionLabel, triggerLabel }) {
  const [open, setOpen] = useState(false)
  const [acted, setActed] = useState(false)

  const handleShow = () => {
    setActed(false)
    setOpen(true)
  }

  return (
    <ToastProvider position="bottom-right">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">position=&quot;{position}&quot;</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-2">
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
  )
}

export const Inline = {
  name: 'Inline',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          position=&quot;inline&quot;
        </code>{' '}
        (the default) on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">ToastAction</code> to render
        the action button in the same row as the title and description. Best for short single-word
        labels like &quot;Undo&quot; or &quot;View&quot;.
      </p>

      <ActionDemo
        position="inline"
        variant="danger"
        title="Item deleted"
        desc="This action can be undone within 5 seconds."
        actionLabel="Undo"
        triggerLabel="Delete item"
      />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use inline for short, single-word action labels',
                body: 'Inline works well for labels like "Undo", "View", or "Dismiss". It keeps the toast compact and the action immediately visible alongside the message.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use inline for multi-word labels",
                body: 'Labels like "Install now" or "View changelog" make the toast feel cramped inline. Use stacked-left or stacked-right to give the action its own row.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always include altText — write it as a short imperative',
                body: 'altText is the accessible label for screen readers. "Undo delete" or "Install update" is more descriptive than just "Undo" or "Install" when read in isolation.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always match ToastAction variant to the parent Toast variant',
                body: 'ToastAction has its own variant prop that controls border and hover color. If the parent is danger, set variant="danger" on the action too — mismatched colors look like a bug.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{open && (
  <Toast onOpenChange={(o) => !o && setOpen(false)} variant="danger">
    <div className="flex-1 min-w-0">
      <ToastTitle>Item deleted</ToastTitle>
      <ToastDescription>This action can be undone within 5 seconds.</ToastDescription>
    </div>
    {/* inline — sits in the same row */}
    <ToastAction position="inline" altText="Undo delete" variant="danger">
      Undo
    </ToastAction>
    <ToastClose />
  </Toast>
)}`}</code>
      </pre>
    </div>
  ),
}

export const StackedLeft = {
  name: 'Stacked Left',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          position=&quot;stacked-left&quot;
        </code>{' '}
        to render the action button on its own row below the title and description, left-aligned.
        Best for multi-word labels where inline would make the toast too wide.
      </p>

      <ActionDemo
        position="stacked-left"
        variant="info"
        title="Update available"
        desc="A new version is ready. Install now or later."
        actionLabel="Install now"
        triggerLabel="Update available"
      />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use stacked-left for multi-word action labels',
                body: 'When the action label is longer than one word (e.g., "Install now", "View changelog"), stacked layout prevents the toast from becoming too wide on smaller screens.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use stacked-left for very short single-word labels",
                body: 'Labels like "Undo" or "View" fit perfectly inline. Stacking them adds visual weight and extra height to the toast for no real gain.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'stacked-left reads naturally for left-to-right layouts',
                body: 'In LTR contexts, the eye scans left to right. A left-aligned action under the text follows the natural reading order and feels less jarring than stacked-right for primary actions.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use stacked-left for primary or destructive actions',
                body: 'Left alignment gives the action visual prominence and draws the eye first after the message text. For critical actions like "Install now" or "Undo delete", stacked-left signals urgency better than stacked-right.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{open && (
  <Toast onOpenChange={(o) => !o && setOpen(false)} variant="info">
    <div className="flex-1 min-w-0">
      <ToastTitle>Update available</ToastTitle>
      <ToastDescription>A new version is ready. Install now or later.</ToastDescription>
    </div>
    {/* stacked-left — action on its own row, left-aligned */}
    <ToastAction position="stacked-left" altText="Install update now" variant="info">
      Install now
    </ToastAction>
    <ToastClose />
  </Toast>
)}`}</code>
      </pre>
    </div>
  ),
}

export const StackedRight = {
  name: 'Stacked Right',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          position=&quot;stacked-right&quot;
        </code>{' '}
        to render the action button on its own row below the title and description, right-aligned.
        Use this when the action is a secondary follow-up rather than a primary next step.
      </p>

      <ActionDemo
        position="stacked-right"
        variant="success"
        title="Changes saved"
        desc="Your draft has been saved to the cloud."
        actionLabel="View"
        triggerLabel="Save changes"
      />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use stacked-right for optional follow-up actions',
                body: 'Right-aligned actions feel secondary and optional — appropriate for "View", "Open", or "Details" where the primary message is a confirmation and the action is a convenience shortcut.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid stacked-right for destructive or urgent actions',
                body: 'Right alignment implies "secondary". If the action is critical — like "Undo" on a delete — use stacked-left or inline so it receives the visual prominence it deserves.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Right alignment implies secondary importance — use it intentionally',
                body: "Don't use stacked-right for actions the user needs to notice. It reads as an afterthought. If the action is important, left-align it or keep it inline so it sits in the natural reading path.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'stacked-right pairs well with success toasts',
                body: 'A success confirmation followed by a right-aligned "View" button is a common and natural pattern — the toast confirms completion, the action offers a shortcut to see the result.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{open && (
  <Toast onOpenChange={(o) => !o && setOpen(false)} variant="success">
    <div className="flex-1 min-w-0">
      <ToastTitle>Changes saved</ToastTitle>
      <ToastDescription>Your draft has been saved to the cloud.</ToastDescription>
    </div>
    {/* stacked-right — action on its own row, right-aligned */}
    <ToastAction position="stacked-right" altText="View saved file" variant="success">
      View
    </ToastAction>
    <ToastClose />
  </Toast>
)}`}</code>
      </pre>
    </div>
  ),
}
