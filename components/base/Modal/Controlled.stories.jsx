import { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from './Modal'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Modal/Controlled',
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
        <div className="flex flex-col gap-2 max-w-2xl">
          <p className="text-sm text-gray-500 leading-relaxed">
            Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">open</code> and{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">onOpenChange</code> to{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">Modal</code> to control
            open state externally. In this mode,{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">ModalTrigger</code> is
            omitted — the modal is opened and closed entirely through parent state. This is the
            controlled pattern, as opposed to the uncontrolled pattern where{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">ModalTrigger</code> manages
            state internally.
          </p>
        </div>

        <div className="flex flex-col gap-5 w-full max-w-2xl">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">controlled via useState</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
              >
                Open Modal
              </button>
              <span className="text-xs text-gray-400">
                state: <code className="font-mono bg-gray-100 px-1 rounded">{String(open)}</code>
              </span>
            </div>

            <Modal open={open} onOpenChange={setOpen}>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>Controlled Modal</ModalTitle>
                  <ModalDescription>
                    This modal has no{' '}
                    <code className="bg-gray-100 px-1 rounded text-xs">ModalTrigger</code> — it is
                    opened programmatically via{' '}
                    <code className="bg-gray-100 px-1 rounded text-xs">setOpen(true)</code>.
                  </ModalDescription>
                </ModalHeader>
                <p className="text-sm text-muted-foreground">
                  Use this pattern when you need to open the modal after a form submission, API
                  response, or any async event outside the modal's own trigger.
                </p>
                <ModalFooter>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Confirm
                  </button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </div>

        <BestPractices
          items={[
            {
              heading: 'When to use',
              cards: [
                {
                  title: 'Use when the trigger lives in a different part of the component tree',
                  body: 'A toolbar button that opens a modal rendered in a different section of the page — the trigger and modal cannot share the same Modal root in the tree.',
                },
                {
                  title: 'Use for programmatic open events',
                  body: 'After a successful API call, validation error, or timer expiry. The uncontrolled ModalTrigger pattern has no way to handle events that originate outside the modal tree.',
                },
              ],
            },
            {
              heading: 'When not to use',
              cards: [
                {
                  title: 'Use uncontrolled when trigger and modal are co-located',
                  body: 'If the trigger and modal live in the same component, the uncontrolled pattern (Modal + ModalTrigger) requires less state management and is easier to reason about.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              cards: [
                {
                  title: 'Always pass onOpenChange so dismiss paths still work',
                  body: 'Without onOpenChange, the × button, overlay click, and Escape key cannot update the external state. The modal appears stuck open to the user.',
                },
              ],
            },
            {
              heading: 'Advice',
              cards: [
                {
                  title: 'onOpenChange receives false when the user dismisses — handle it',
                  body: "The handler is called with false when the user presses Escape, clicks the overlay, or clicks ×. Make sure setOpen(false) is what you want — don't open a second modal or run side effects on every dismiss.",
                },
              ],
            },
          ]}
        />

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`const [open, setOpen] = useState(false)

{/* Trigger can live anywhere */}
<button onClick={() => setOpen(true)}>Open</button>

<Modal open={open} onOpenChange={setOpen}>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Controlled Modal</ModalTitle>
    </ModalHeader>
    <ModalFooter>
      <button onClick={() => setOpen(false)}>Cancel</button>
      <button onClick={() => setOpen(false)}>Confirm</button>
    </ModalFooter>
  </ModalContent>
</Modal>`}</code>
        </pre>
      </div>
    )
  },
}
