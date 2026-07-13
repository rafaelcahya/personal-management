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
  title: 'Modal/Radius',
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

export const RadiusNone = {
  name: 'none',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">radius="none"</code> — maps
          to <code className="font-mono bg-gray-100 px-1 rounded text-xs">rounded-none</code>. Sharp
          corners with no border radius. The panel looks flat and rectangular.
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
          <ModalContent radius="none">
            <ModalHeader>
              <ModalTitle>radius="none"</ModalTitle>
              <ModalDescription>rounded-none — sharp corners.</ModalDescription>
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
                title: 'Use for deliberately sharp-edged design systems',
                body: 'Trading terminals, dense data apps, and developer tools where rounded corners feel out of place with the overall aesthetic.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid in consumer-facing or mobile-first products',
                body: 'Softness is part of the visual identity in consumer apps. Sharp corners can feel clinical or abrasive next to rounded cards, buttons, and inputs.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'No accessibility impact — purely cosmetic',
                body: 'Border radius has no effect on keyboard navigation, screen readers, or focus management. The choice is entirely visual.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Works best with size="full"',
                body: 'A full-screen panel looks natural without rounding. For smaller floating panels, none can look like a rendering artifact rather than a design choice.',
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent radius="none">...</ModalContent>`}</code>
      </pre>
    </div>
  ),
}

export const RadiusXs = {
  name: 'xs',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">radius="xs"</code> — maps to{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">rounded-sm</code>. A
          barely-there corner radius. Almost flat but with just enough softness to distinguish from{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">none</code>.
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
          <ModalContent radius="xs">
            <ModalHeader>
              <ModalTitle>radius="xs"</ModalTitle>
              <ModalDescription>rounded-sm</ModalDescription>
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
                title: 'Use when the app base radius is very small',
                body: 'When buttons and cards use rounded-sm, the modal should match. Consistency in radius keeps the design system coherent.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid next to rounded-lg components',
                body: 'xs next to cards and panels that use rounded-lg will look like a rounding bug, not a design choice.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'No accessibility impact — purely cosmetic',
                body: 'Border radius has no effect on keyboard navigation, screen readers, or focus management. The choice is entirely visual.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'A hint of rounding without looking bubbly',
                body: 'xs is the smallest visible softening. It separates the modal from a perfectly flat surface without drawing attention to the corners.',
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent radius="xs">...</ModalContent>`}</code>
      </pre>
    </div>
  ),
}

export const RadiusSm = {
  name: 'sm',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">radius="sm"</code> — maps to{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">rounded</code> (4px). A
          subtle, professional radius that keeps the panel grounded without being too soft.
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
          <ModalContent radius="sm">
            <ModalHeader>
              <ModalTitle>radius="sm"</ModalTitle>
              <ModalDescription>rounded (4px)</ModalDescription>
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
                title: 'A good fit for B2B and productivity tools',
                body: 'Where professionalism matters more than personality — the modal feels clean and grounded without being sterile.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid in consumer apps with a modern rounded design language',
                body: 'Users of consumer apps expect the softness of rounded-lg or larger. sm will feel unexpectedly flat next to rounded buttons and cards.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'No accessibility impact — purely cosmetic',
                body: 'Border radius has no effect on keyboard navigation, screen readers, or focus management. The choice is entirely visual.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Match the design system base radius token',
                body: 'When the project radius token is rounded (4px), using radius="sm" keeps the modal consistent with buttons, inputs, and dropdowns.',
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent radius="sm">...</ModalContent>`}</code>
      </pre>
    </div>
  ),
}

export const RadiusBase = {
  name: 'base',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">radius="base"</code> — maps
          to <code className="font-mono bg-gray-100 px-1 rounded text-xs">rounded-md</code> (6px).
          The standard Tailwind medium radius — matches the default radius of most shadcn/ui
          components.
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
          <ModalContent radius="base">
            <ModalHeader>
              <ModalTitle>radius="base"</ModalTitle>
              <ModalDescription>rounded-md (6px)</ModalDescription>
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
                title: 'Use when the project radius token is the shadcn/ui default',
                body: 'When --radius is set to 0.375rem (6px), using radius="base" makes the modal match buttons, inputs, and dropdowns exactly — no visual inconsistency.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid mixing base with rounded-lg components',
                body: 'If other surfaces in the app use rounded-lg (8px), base will look slightly off. Consistency within the design system matters more than the exact pixel value.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'No accessibility impact — purely cosmetic',
                body: 'Border radius has no effect on keyboard navigation, screen readers, or focus management. The choice is entirely visual.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'A safe system-consistent radius without going too soft',
                body: "base is the standard Tailwind medium radius — it matches most shadcn/ui components out of the box without needing to customize the project's radius token.",
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent radius="base">...</ModalContent>`}</code>
      </pre>
    </div>
  ),
}

export const RadiusMd = {
  name: 'md',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">radius="md"</code> — maps to{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">rounded-lg</code> (8px).
          Visibly rounded — friendly and modern without feeling overly bubbly.
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
          <ModalContent radius="md">
            <ModalHeader>
              <ModalTitle>radius="md"</ModalTitle>
              <ModalDescription>rounded-lg (8px)</ModalDescription>
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
                title: 'A versatile middle ground for most product contexts',
                body: 'Works in both professional dashboards and consumer apps without feeling out of place. Friendly and modern without being overly bubbly.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid mixing md with design systems that use a strict radius token',
                body: "If the project's token is locked to 6px (base) or 12px (lg), using md creates inconsistency with buttons and cards that follow the token.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'No accessibility impact — purely cosmetic',
                body: 'Border radius has no effect on keyboard navigation, screen readers, or focus management. The choice is entirely visual.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Good companion to cards and panels that use rounded-lg',
                body: 'When the page layout uses rounded-lg surfaces, the modal at radius="md" (also rounded-lg) belongs to the same visual family without jarring contrast.',
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent radius="md">...</ModalContent>`}</code>
      </pre>
    </div>
  ),
}

export const RadiusLg = {
  name: 'lg (default)',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">radius="lg"</code> — maps to{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">rounded-xl</code> (12px). The
          default. Soft and approachable — widely used in modern SaaS products.
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
          <ModalContent radius="lg">
            <ModalHeader>
              <ModalTitle>radius="lg"</ModalTitle>
              <ModalDescription>rounded-xl (12px) — default.</ModalDescription>
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
                title: 'The right choice for most modals in this app',
                body: 'Soft but not playful — consistent with the existing card and panel design language. Pairs well with all size options.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid pairing lg with size="full"',
                body: 'Rounding on a full-screen panel creates visible corner artifacts against the dark overlay. Use radius="none" or radius="xs" for full-size modals.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'No accessibility impact — purely cosmetic',
                body: 'Border radius has no effect on keyboard navigation, screen readers, or focus management. The choice is entirely visual.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'You can omit radius entirely',
                body: 'lg is the default — no need to write radius="lg" explicitly. Only set radius when you need a different value.',
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent radius="lg">...</ModalContent>   {/* default — can be omitted */}`}</code>
      </pre>
    </div>
  ),
}

export const RadiusXl = {
  name: 'xl',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">radius="xl"</code> — maps to{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">rounded-2xl</code> (16px).
          Noticeably soft and bubbly. Best reserved for playful or marketing-style modals.
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
          <ModalContent radius="xl">
            <ModalHeader>
              <ModalTitle>radius="xl"</ModalTitle>
              <ModalDescription>rounded-2xl (16px)</ModalDescription>
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
                title: 'Use for celebratory or onboarding modals',
                body: 'Where the soft, inviting shape reinforces a positive, welcoming tone — achievement dialogs, first-run onboarding, success messages.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid for forms and data-entry dialogs',
                body: 'The exaggerated rounding can make fields near the corners feel visually cramped and the layout harder to scan.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'No accessibility impact — purely cosmetic',
                body: 'Border radius has no effect on keyboard navigation, screen readers, or focus management. The choice is entirely visual.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair with equally rounded interior elements for visual cohesion',
                body: 'xl rounding on the panel next to sharp-cornered buttons looks inconsistent. Use rounded-xl or rounded-2xl on buttons and inputs inside the modal.',
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent radius="xl">...</ModalContent>`}</code>
      </pre>
    </div>
  ),
}

export const RadiusFull = {
  name: 'full',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">radius="full"</code> — maps
          to <code className="font-mono bg-gray-100 px-1 rounded text-xs">rounded-3xl</code> (24px).
          Maximum corner rounding. The panel starts to resemble a pill shape at narrow widths.
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
          <ModalContent radius="full">
            <ModalHeader>
              <ModalTitle>radius="full"</ModalTitle>
              <ModalDescription>rounded-3xl (24px) — maximum rounding.</ModalDescription>
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
                title: 'Use only for specific brand moments',
                body: 'Achievement modals, promotions, or celebration dialogs where the exaggerated pill-like shape is a deliberate, intentional design choice.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Never use for forms, tables, or data-heavy content',
                body: "At 24px rounding, corner content gets visually clipped in the user's perception. Fields and labels near the edges look hemmed in.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'No accessibility impact — purely cosmetic',
                body: 'Border radius has no effect on keyboard navigation, screen readers, or focus management. The choice is entirely visual.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Test on size="sm" — the pill shape becomes obvious at small widths',
                body: 'At narrow widths, full rounding on both sides creates a visible pill shape. Verify it still looks like a dialog and not a tooltip or badge.',
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent radius="full">...</ModalContent>`}</code>
      </pre>
    </div>
  ),
}
