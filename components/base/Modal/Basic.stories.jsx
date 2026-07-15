import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from './Modal'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Modal/Basic',
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
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          The base Modal pattern — a{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">ModalTrigger</code> opens the
          panel, <code className="font-mono bg-gray-100 px-1 rounded text-xs">ModalContent</code>{' '}
          renders the overlay and dialog, and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">ModalClose</code> or the ×
          button dismisses it. The close button and overlay click are both enabled by default.
        </p>
      </div>

      <div>
        <Modal>
          <ModalTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              Open Modal
            </button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Edit Profile</ModalTitle>
              <ModalDescription>
                Make changes to your profile here. Click save when you're done.
              </ModalDescription>
            </ModalHeader>
            <p className="text-sm text-muted-foreground">
              Your profile information is visible to other members of your workspace.
            </p>
            <ModalFooter>
              <ModalClose asChild>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
              </ModalClose>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use Modal for blocking decisions and required input',
                body: 'Use Modal when the user must complete or acknowledge something before the page can continue — confirmations, forms, critical alerts.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Prefer Sheet for supplemental content',
                body: "Filters, previews, and side panels that don't require a decision belong in a Sheet. They let users still see the page context while interacting.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'ModalTitle is required for screen reader support',
                body: 'Always include ModalTitle — it is linked to the dialog via aria-labelledby and announced by screen readers when the modal opens.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Put the primary action on the right inside ModalFooter',
                body: 'Place the primary action (Save, Confirm) on the right and Cancel/secondary on the left. This matches standard web and OS button placement conventions.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Modal>
  <ModalTrigger asChild>
    <button type="button">Open Modal</button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Edit Profile</ModalTitle>
      <ModalDescription>Make changes to your profile.</ModalDescription>
    </ModalHeader>
    <ModalFooter>
      <ModalClose asChild>
        <button type="button">Cancel</button>
      </ModalClose>
      <button type="button">Save Changes</button>
    </ModalFooter>
  </ModalContent>
</Modal>`}</code>
      </pre>
    </div>
  ),
}

export const CloseOnOverlayClick = {
  name: 'closeOnOverlayClick',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">closeOnOverlayClick</code>{' '}
          controls whether clicking the dark backdrop dismisses the modal. Default is{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">true</code>. Set to{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">false</code> to lock the
          modal so users must use the footer buttons to proceed.
        </p>
      </div>

      <div>
        <Modal>
          <ModalTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              Open Modal
            </button>
          </ModalTrigger>
          <ModalContent closeOnOverlayClick={false} showCloseButton={false}>
            <ModalHeader>
              <ModalTitle>Locked Modal</ModalTitle>
              <ModalDescription>
                Clicking the grey overlay will not close this modal. Users must use the footer
                buttons to proceed.
              </ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <ModalClose asChild>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
              </ModalClose>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Confirm
              </button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use closeOnOverlayClick={false} for irreversible actions',
                body: 'Set this for destructive or irreversible actions — delete, clear data, submit forms — where an accidental overlay click could lose user progress.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Do not lock informational modals',
                body: 'Modals that show non-critical content (help text, previews) should always be dismissible via the overlay. Locking them frustrates users.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Ensure ModalClose is present in the footer when locking the overlay',
                body: 'When closeOnOverlayClick={false}, keyboard and screen reader users still need an explicit dismiss path — provide ModalClose in the footer.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair with showCloseButton={false} to force an explicit choice',
                body: 'When you lock the overlay, also hide the corner × button. This ensures the user must read the footer options before closing.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent closeOnOverlayClick={false} showCloseButton={false}>
  ...
</ModalContent>`}</code>
      </pre>
    </div>
  ),
}

export const ShowCloseButton = {
  name: 'showCloseButton',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">showCloseButton</code>{' '}
          toggles the × icon in the top-right corner of the panel. Default is{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">true</code>. Hiding it
          removes the shortcut dismiss so users must engage with the footer actions.
        </p>
      </div>

      <div>
        <Modal>
          <ModalTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              Open Modal
            </button>
          </ModalTrigger>
          <ModalContent showCloseButton={false}>
            <ModalHeader>
              <ModalTitle>Confirm Action</ModalTitle>
              <ModalDescription>
                This modal has no close button — users must use the footer actions.
              </ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <ModalClose asChild>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
              </ModalClose>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Confirm
              </button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Hide the close button for confirmation dialogs',
                body: 'For delete, discard, and submit dialogs where the footer Cancel button already covers the dismiss case — hiding the × reduces escape paths on purpose.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Keep the close button visible for forms and informational modals',
                body: 'Users expect to exit forms quickly without scrolling to the footer. The × is the first thing they reach for — do not remove it unless the flow requires explicit commitment.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Ensure ModalClose is in the footer when hiding the × button',
                body: 'Without the corner close button, keyboard and screen reader users must have an explicit dismiss path through the footer. Always provide ModalClose.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Pair showCloseButton={false} with closeOnOverlayClick={false} for full lock-in',
                body: 'For maximum commitment on destructive flows, remove both the × button and the overlay dismiss. The user must then choose an explicit footer action.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent showCloseButton={false}>
  ...
</ModalContent>`}</code>
      </pre>
    </div>
  ),
}
