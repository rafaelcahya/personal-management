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
  title: 'Modal/Sizes',
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

export const SizeSm = {
  name: 'sm',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">size="sm"</code> —{' '}
          <code className="font-mono text-xs text-gray-600">max-w-sm (384px)</code>. The smallest
          panel size. Keeps the dialog compact and focused with minimal visual weight.
        </p>
      </div>
      <div>
        <Modal>
          <ModalTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              Open sm
            </button>
          </ModalTrigger>
          <ModalContent size="sm">
            <ModalHeader>
              <ModalTitle>Size: sm</ModalTitle>
              <ModalDescription>max-w-sm (384px)</ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <ModalClose asChild>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                >
                  Close
                </button>
              </ModalClose>
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
                title: 'Use for confirmation dialogs with binary choices',
                body: 'Delete, discard, logout — where the content is short and the user needs to make one of two choices. The compact size signals low complexity.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid placing multi-field forms in sm',
                body: 'Forms with 3 or more fields feel cramped at 384px. Use md or larger so fields and labels have room to breathe.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Confirm the focus trap lands on a meaningful element',
                body: 'Short focused modals have less content to tab through — verify that focus lands on the first interactive element, not an empty container.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Good for simple alerts needing a blocking acknowledgement',
                body: 'When the user must read and confirm before continuing, sm keeps the interruption minimal and the decision fast.',
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent size="sm">...</ModalContent>`}</code>
      </pre>
    </div>
  ),
}

export const SizeMd = {
  name: 'md (default)',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">size="md"</code> —{' '}
          <code className="font-mono text-xs text-gray-600">max-w-lg (512px)</code>. The default
          size. Balances content space with focused attention — wide enough for a standard edit
          form, narrow enough to stay out of the way.
        </p>
      </div>
      <div>
        <Modal>
          <ModalTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              Open md
            </button>
          </ModalTrigger>
          <ModalContent size="md">
            <ModalHeader>
              <ModalTitle>Size: md</ModalTitle>
              <ModalDescription>max-w-lg (512px) — default</ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <ModalClose asChild>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                >
                  Close
                </button>
              </ModalClose>
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
                title: 'The go-to size for most modals',
                body: 'Edit profile, account settings, add/edit item forms with 3–5 fields. Balances content space with focused attention.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Step up to lg if content overflows or feels cramped',
                body: 'If you find yourself fighting the width — content overflows, labels truncate, inputs stack awkwardly — move to lg rather than adding manual overrides.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Verify the modal adapts to narrow viewports',
                body: 'At 512px max-width, the modal fills most mobile screens. Confirm that labels and inputs are comfortably spaced without horizontal overflow.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'You can omit size entirely',
                body: 'md is the default — no need to write size="md" explicitly. Only set size when you need a different value.',
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent size="md">...</ModalContent>   {/* default — size can be omitted */}`}</code>
      </pre>
    </div>
  ),
}

export const SizeLg = {
  name: 'lg',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">size="lg"</code> —{' '}
          <code className="font-mono text-xs text-gray-600">max-w-2xl (672px)</code>. Extra
          horizontal room for content that would feel cramped in{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">md</code> — wide forms,
          side-by-side inputs, or rich text editors.
        </p>
      </div>
      <div>
        <Modal>
          <ModalTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              Open lg
            </button>
          </ModalTrigger>
          <ModalContent size="lg">
            <ModalHeader>
              <ModalTitle>Size: lg</ModalTitle>
              <ModalDescription>max-w-2xl (672px)</ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <ModalClose asChild>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                >
                  Close
                </button>
              </ModalClose>
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
                title: 'Use for 2-column grid forms and rich content',
                body: 'Forms with side-by-side inputs (symbol + type, lot + price, date), rich text editors, or markdown inputs that benefit from extra horizontal room.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid lg for simple 1-column forms',
                body: 'A wide panel with a single column of inputs leaves large empty margins on both sides. The sparse layout draws attention to the wasted space.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Verify tab order follows reading sequence across columns',
                body: 'Wider panels often use grid layouts — confirm the tab order follows logical reading order (left-to-right, top-to-bottom) and not raw DOM order.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'lg is the right step up from md when content needs breathing room',
                body: 'If a 2-column grid feels tight at md (512px), lg at 672px gives each column enough width to be usable without feeling overcrowded.',
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent size="lg">...</ModalContent>`}</code>
      </pre>
    </div>
  ),
}

export const SizeXl = {
  name: 'xl',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">size="xl"</code> —{' '}
          <code className="font-mono text-xs text-gray-600">max-w-4xl (896px)</code>. A wide panel
          for data-heavy content. Approaches Sheet-level width while still blocking the underlying
          page.
        </p>
      </div>
      <div>
        <Modal>
          <ModalTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              Open xl
            </button>
          </ModalTrigger>
          <ModalContent size="xl">
            <ModalHeader>
              <ModalTitle>Size: xl</ModalTitle>
              <ModalDescription>max-w-4xl (896px)</ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <ModalClose asChild>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                >
                  Close
                </button>
              </ModalClose>
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
                title: 'Use for data tables, galleries, and wide detail views',
                body: 'Inline data tables, image galleries, or detail views where the user needs to see many items at once inside a blocking overlay.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Consider Sheet if the content is purely informational',
                body: 'At 896px, xl approaches Sheet-level width. If blocking the page is not required, a Sheet lets users still see and interact with the context behind.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Verify xl does not feel overwhelming on mobile',
                body: 'On small screens xl collapses to near full-width automatically. Test that the modal does not dominate the viewport in a way that disoriients mobile users.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Only use xl when the blocking overlay is the right interaction model',
                body: 'xl is wide enough to replace a page. Only choose it when the task genuinely requires the user to be blocked from the rest of the UI.',
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent size="xl">...</ModalContent>`}</code>
      </pre>
    </div>
  ),
}

export const SizeFull = {
  name: 'full',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">size="full"</code> —{' '}
          <code className="font-mono text-xs text-gray-600">100vw × 100vh</code>. Fills the entire
          viewport. Treats the modal as a temporary full-screen page rather than a floating overlay.
        </p>
      </div>
      <div>
        <Modal>
          <ModalTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              Open full
            </button>
          </ModalTrigger>
          <ModalContent size="full">
            <ModalHeader>
              <ModalTitle>Size: full</ModalTitle>
              <ModalDescription>100vw × 100vh — fullscreen takeover.</ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <ModalClose asChild>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                >
                  Close
                </button>
              </ModalClose>
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
                title: 'Reserve for immersive multi-step tasks',
                body: 'A trade entry wizard, camera/upload flow, or step-by-step onboarding — where the user is fully committed to the task and needs a dedicated environment.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Never use full for simple forms or confirmations',
                body: "The scale is disorienting for short interactions. A confirmation that occupies the full viewport feels alarming and breaks the user's sense of place.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always include a clearly labelled close/cancel button',
                body: 'The × in the corner is easy to miss in a full-screen context. Add a visible Cancel or Back button so the exit path is obvious at any scroll position.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Treat full as a temporary page, not a modal',
                body: 'Structure its content accordingly — use a clear heading, visible progress indicator if multi-step, and a prominent exit button rather than relying on the small corner ×.',
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent size="full">...</ModalContent>`}</code>
      </pre>
    </div>
  ),
}
