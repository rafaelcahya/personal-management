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
  title: 'Modal/OverlayOpacity',
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

export const Opacity0 = {
  name: '0%',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">overlayOpacity={'{0}'}</code>{' '}
          — fully transparent backdrop. The dark scrim behind the modal panel is invisible. The page
          content behind the modal remains fully visible.
        </p>
      </div>
      <div>
        <Modal>
          <ModalTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              Open
            </button>
          </ModalTrigger>
          <ModalContent overlayOpacity={0}>
            <ModalHeader>
              <ModalTitle>overlayOpacity={0}</ModalTitle>
              <ModalDescription>Fully transparent backdrop.</ModalDescription>
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
                title:
                  'Use for lightweight in-page dialogs where full page visibility is intentional',
                body: 'Small floating action prompts that appear without disrupting reading context — the user should still be able to see the page while interacting with the dialog.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid for confirmations and destructive actions',
                body: 'The absent backdrop fails to signal that a blocking decision is required. Users may not realize the page is locked.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'At 0% opacity the overlay is invisible — users cannot see it as a dismiss target',
                body: 'Pair with closeOnOverlayClick={false} so users are not confused by a clickable-but-invisible overlay. Make the close path explicit through footer buttons.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair with closeOnOverlayClick={false} to avoid invisible dismiss traps',
                body: 'Without a visible backdrop, users have no affordance that clicking the background will close the dialog. Disable it to prevent accidental dismissal.',
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent overlayOpacity={0}>...</ModalContent>`}</code>
      </pre>
    </div>
  ),
}

export const Opacity25 = {
  name: '25%',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">
            overlayOpacity={'{25}'}
          </code>{' '}
          — light backdrop. Applies a subtle scrim that hints at blocking without strongly dimming
          the page. The page behind the modal is still largely visible.
        </p>
      </div>
      <div>
        <Modal>
          <ModalTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              Open
            </button>
          </ModalTrigger>
          <ModalContent overlayOpacity={25}>
            <ModalHeader>
              <ModalTitle>overlayOpacity={25}</ModalTitle>
              <ModalDescription>Light backdrop — subtle dimming.</ModalDescription>
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
                title: 'Good for non-critical supplemental dialogs',
                body: 'Quick-view panels, popover details — where the user might still want to see the page context while reading the dialog.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid for destructive or high-stakes modals',
                body: 'A stronger visual break from the page signals importance. Low opacity fails to communicate that a serious decision is required.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Verify contrast on both light and dark modes',
                body: 'A subtle scrim at 25% may look almost invisible on very light themes. Test that the modal panel still has sufficient contrast against the dimmed page.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Works best on light backgrounds',
                body: 'On very light themes, 25% opacity is barely visible. On dark backgrounds it reads more clearly. Check both modes before deploying.',
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent overlayOpacity={25}>...</ModalContent>`}</code>
      </pre>
    </div>
  ),
}

export const Opacity50 = {
  name: '50% (default)',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">
            overlayOpacity={'{50}'}
          </code>{' '}
          — the default. Balanced dimming — clearly signals that the page is blocked while keeping
          enough background visibility to provide spatial context.
        </p>
      </div>
      <div>
        <Modal>
          <ModalTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              Open
            </button>
          </ModalTrigger>
          <ModalContent overlayOpacity={50}>
            <ModalHeader>
              <ModalTitle>overlayOpacity={50}</ModalTitle>
              <ModalDescription>Default — balanced backdrop.</ModalDescription>
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
                title: 'The right choice for most modals',
                body: 'Forms, settings, confirmations. Clearly signals the page is blocked while keeping enough background visibility to provide spatial context.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Step up to 75% or 90% for maximum-urgency situations',
                body: 'Session expiry, critical payment steps — where you want the user fully separated from the page, not just blocked.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Provides sufficient dimming to indicate the page is blocked',
                body: 'Keeps the user oriented in space while making it clear that background interactions are unavailable.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'You can omit overlayOpacity entirely',
                body: '50 is the default — no need to set it explicitly. Only change overlayOpacity when the standard dimming is intentionally too strong or too weak for the context.',
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent overlayOpacity={50}>...</ModalContent>   {/* default — can be omitted */}`}</code>
      </pre>
    </div>
  ),
}

export const Opacity75 = {
  name: '75%',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">
            overlayOpacity={'{75}'}
          </code>{' '}
          — heavy backdrop. Strong visual separation from the page. The content behind the modal is
          significantly dimmed and harder to read.
        </p>
      </div>
      <div>
        <Modal>
          <ModalTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              Open
            </button>
          </ModalTrigger>
          <ModalContent overlayOpacity={75}>
            <ModalHeader>
              <ModalTitle>overlayOpacity={75}</ModalTitle>
              <ModalDescription>Heavy backdrop — strong visual separation.</ModalDescription>
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
                title: 'Use for critical blocking actions needing full user focus',
                body: 'Delete confirmations, payment gateways, session expiry alerts — where you want the user completely separated from the dimmed page.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid for frequent or lightweight dialogs',
                body: 'A heavy backdrop applied repeatedly creates visual fatigue. Reserve 75% for situations that genuinely warrant strong visual weight.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Strong dimming reduces visual noise for users with cognitive load issues',
                body: 'The darker backdrop can make complex form content easier to read by removing visual interference from the page behind.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: "Good for complex forms requiring the user's complete attention",
                body: 'When the form has many fields or steps, a darker overlay reduces the temptation to look at the page behind and keeps the user focused.',
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent overlayOpacity={75}>...</ModalContent>`}</code>
      </pre>
    </div>
  ),
}

export const Opacity90 = {
  name: '90%',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">
            overlayOpacity={'{90}'}
          </code>{' '}
          — near-opaque backdrop. The page behind is almost completely hidden. The experience
          approaches a full-screen takeover while the panel itself stays floating.
        </p>
      </div>
      <div>
        <Modal>
          <ModalTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              Open
            </button>
          </ModalTrigger>
          <ModalContent overlayOpacity={90}>
            <ModalHeader>
              <ModalTitle>overlayOpacity={90}</ModalTitle>
              <ModalDescription>Near-opaque backdrop.</ModalDescription>
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
                title: 'Reserve for maximum-urgency situations',
                body: 'Session expiry, data loss warnings, or critical payment steps — where the user must act before continuing and no page context should be visible.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Do not use routinely — a near-black backdrop is alarming',
                body: 'It should only appear when severity genuinely warrants that visual weight. Using it for standard dialogs desensitizes users to the signal.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Near-opaque backdrops can be disorienting for users with low vision',
                body: 'For users with contrast sensitivity issues, a near-black overlay can make spatial orientation difficult. Use sparingly and only when the urgency justifies it.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Consider size="full" if total isolation is the goal',
                body: 'When the panel itself should fill the screen, use size="full" — the panel covers everything and the overlay behind it becomes redundant.',
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent overlayOpacity={90}>...</ModalContent>`}</code>
      </pre>
    </div>
  ),
}
