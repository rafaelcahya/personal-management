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

export const Controlled = {
  name: 'Controlled',
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
          Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">open</code> and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">onOpenChange</code> to{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">Modal</code> to control open
          state externally — useful when the trigger is elsewhere in the tree, or when the modal
          opens from a programmatic event (e.g., after an API call).
        </p>

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
