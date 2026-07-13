import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from './Modal'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Modal/Bordered',
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

export const Bordered = {
  name: 'Bordered',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="text-xs bg-gray-100 px-1 py-0.5 rounded font-mono">
            variant="bordered"
          </code>{' '}
          adds a horizontal divider below the header and above the footer, visually separating the
          three sections. Requires{' '}
          <code className="text-xs bg-gray-100 px-1 py-0.5 rounded font-mono">ModalBody</code> to
          wrap the scrollable body content — without it, the dividers have nothing to divide.
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
          <ModalContent variant="bordered">
            <ModalHeader>
              <ModalTitle>Edit Profile</ModalTitle>
              <ModalDescription>
                Make changes to your profile here. Click save when you're done.
              </ModalDescription>
            </ModalHeader>
            <ModalBody>
              <p className="text-sm text-muted-foreground">
                Your profile information is visible to other members of your workspace. Keep it up
                to date so teammates can reach you.
              </p>
            </ModalBody>
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
                title: 'Use when the modal has three distinct sections needing visual separation',
                body: 'Settings panels, terms agreements, multi-field forms — where header, body, and footer benefit from clear dividers to help users orient themselves.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Use the default variant for simple modals with minimal content',
                body: 'Extra dividers add visual noise when there are only 2–3 lines of body text. The default variant is cleaner for short confirmations and simple alerts.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Visual section separation helps users with cognitive disabilities',
                body: 'The dividers between header, body, and footer make the modal structure scannable at a glance, reducing cognitive load for users who process visual hierarchy.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always wrap body content in ModalBody',
                body: 'ModalBody provides the overflow-y-auto scrolling container required for the bordered layout to work. Without it, long content pushes the footer off-screen.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent variant="bordered">
  <ModalHeader>
    <ModalTitle>Title</ModalTitle>
    <ModalDescription>Description</ModalDescription>
  </ModalHeader>
  <ModalBody>...</ModalBody>
  <ModalFooter>
    <ModalClose asChild><button>Cancel</button></ModalClose>
    <button>Save</button>
  </ModalFooter>
</ModalContent>`}</code>
      </pre>
    </div>
  ),
}

export const BorderedScrollable = {
  name: 'Bordered — Scrollable Body',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          Add{' '}
          <code className="text-xs bg-gray-100 px-1 py-0.5 rounded font-mono">
            className="max-h-[80vh]"
          </code>{' '}
          to <code className="text-xs bg-gray-100 px-1 py-0.5 rounded font-mono">ModalContent</code>{' '}
          to cap the total panel height at 80% of the viewport.{' '}
          <code className="text-xs bg-gray-100 px-1 py-0.5 rounded font-mono">ModalBody</code>{' '}
          handles the overflow scroll automatically. The header and footer remain fixed in view
          while the body scrolls.
        </p>
      </div>

      <div>
        <Modal>
          <ModalTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              Open Modal (Long Content)
            </button>
          </ModalTrigger>
          <ModalContent variant="bordered" className="max-h-[80vh]">
            <ModalHeader>
              <ModalTitle>Terms & Conditions</ModalTitle>
              <ModalDescription>Please read the full terms before proceeding.</ModalDescription>
            </ModalHeader>
            <ModalBody>
              {Array.from({ length: 10 }).map((_, i) => (
                <p key={i} className="text-sm text-muted-foreground mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              ))}
            </ModalBody>
            <ModalFooter>
              <ModalClose asChild>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                >
                  Decline
                </button>
              </ModalClose>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Accept
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
                title: 'Use for terms, audit logs, and unbounded content',
                body: 'Any content that can grow to arbitrary length — terms & conditions, long detail views, audit logs — needs a height cap to prevent the modal from breaking viewport height.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Do not skip the bordered variant for scrollable content',
                body: 'This pattern requires variant="bordered" and ModalBody together. Without bordered, the header and footer scroll out of view with the body content.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Scrollable regions should have a visible scrollbar',
                body: "ModalBody's overflow-y-auto shows the browser's native scrollbar, which signals to users that there is more content below.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'max-h-[80vh] is the recommended height cap',
                body: 'Leaves a small visible margin at top and bottom so the modal does not feel wall-to-wall. Adjust the percentage if the design requires more or less breathing room.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent variant="bordered" className="max-h-[80vh]">
  <ModalHeader>...</ModalHeader>
  <ModalBody>
    {/* long content — ModalBody scrolls automatically */}
  </ModalBody>
  <ModalFooter>...</ModalFooter>
</ModalContent>`}</code>
      </pre>
    </div>
  ),
}

export const BorderedNoFooter = {
  name: 'Bordered — No Footer',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="text-xs bg-gray-100 px-1 py-0.5 rounded font-mono">ModalFooter</code> is
          optional. Omitting it removes the bottom divider and footer section entirely — the body
          content extends to the panel's bottom edge. Useful for read-only detail views where no
          action is required.
        </p>
      </div>

      <div>
        <Modal>
          <ModalTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              Open Modal (No Footer)
            </button>
          </ModalTrigger>
          <ModalContent variant="bordered">
            <ModalHeader>
              <ModalTitle>Activity Details</ModalTitle>
              <ModalDescription>Read-only view of the selected activity.</ModalDescription>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-3">
                {['Distance', 'Duration', 'Pace', 'Heart Rate'].map((label) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">—</span>
                  </div>
                ))}
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use for read-only detail views and info panels',
                body: 'Activity previews, detail records, or info panels where the user only needs to read — no action is required and the × close button is the only exit path.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid omitting the footer for forms or confirmations',
                body: 'Users expect an explicit primary action button when there is a decision to be made. Without a footer, the intent of the modal is ambiguous.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Ensure showCloseButton remains active when there is no footer',
                body: 'Without a footer, the × close button is the only visible dismiss control. Do not hide it — keyboard and screen reader users need it to exit.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Verify that overlay click and Escape key are both enabled',
                body: 'Without a footer, the overlay click and Escape key are the secondary exit paths. Confirm that closeOnOverlayClick is true (the default) before deploying.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent variant="bordered">
  <ModalHeader>...</ModalHeader>
  <ModalBody>...</ModalBody>
  {/* no ModalFooter */}
</ModalContent>`}</code>
      </pre>
    </div>
  ),
}

export const BorderColor = {
  name: 'borderColor',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">borderColor</code>{' '}
          customizes the divider color in the{' '}
          <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">bordered</code>{' '}
          variant. Pass any Tailwind border class as a string. The default is{' '}
          <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">
            border-slate-100
          </code>
          .
        </p>
      </div>

      <div className="flex flex-wrap gap-3 w-full max-w-2xl">
        {[
          {
            label: 'slate-100 (default)',
            color: 'border-slate-100',
            btn: 'border-slate-300 text-slate-700 hover:bg-slate-50',
          },
          {
            label: 'blue-200',
            color: 'border-blue-200',
            btn: 'border-blue-300 text-blue-700 hover:bg-blue-50',
          },
          {
            label: 'red-200',
            color: 'border-red-200',
            btn: 'border-red-300 text-red-700 hover:bg-red-50',
          },
          {
            label: 'slate-200',
            color: 'border-slate-200',
            btn: 'border-slate-300 text-slate-700 hover:bg-slate-50',
          },
        ].map(({ label, color, btn }) => (
          <div key={color} className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">{label}</span>
            <Modal>
              <ModalTrigger asChild>
                <button
                  type="button"
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${btn}`}
                >
                  Open
                </button>
              </ModalTrigger>
              <ModalContent variant="bordered" borderColor={color} size="sm">
                <ModalHeader>
                  <ModalTitle>Example</ModalTitle>
                  <ModalDescription>borderColor=&quot;{color}&quot;</ModalDescription>
                </ModalHeader>
                <ModalBody>
                  <p className="text-sm text-muted-foreground">
                    The header and footer dividers use the{' '}
                    <code className="text-xs bg-gray-100 px-1 rounded">{color}</code> class.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <ModalClose asChild>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-accent transition-colors"
                    >
                      Close
                    </button>
                  </ModalClose>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        ))}
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use a semantic color when the divider reinforces meaning',
                body: 'border-red-200 for destructive modals, border-amber-200 for warnings — only when the color adds information, not just visual variety.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid high-contrast border colors',
                body: 'Colors like border-slate-900 compete with content and make dividers feel like table section breaks rather than a subtle layout guide.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Divider color is purely decorative — never the only separation signal',
                body: 'Ensure section separation is also communicated through spacing, not color alone. Users with color blindness should still be able to distinguish the sections.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'The default border-slate-100 is right for most modals',
                body: "It matches the panel's outer border color so the dividers feel part of the same surface rather than prominent separators.",
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent variant="bordered" borderColor="border-violet-200">
  ...
</ModalContent>`}</code>
      </pre>
    </div>
  ),
}
