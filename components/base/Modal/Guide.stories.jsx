import { useState } from 'react'
import { TriangleAlert, Trash2, Settings } from 'lucide-react'
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalHeaderContent,
  ModalIcon,
  ModalBody,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from './Modal'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Modal',
}

export default meta

// ─── Primitives ───────────────────────────────────────────────────────────────

const Section = ({ title, description, children }) => (
  <div className="mb-12">
    <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
    {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
    <hr className="mb-5 border-gray-200" />
    {children}
  </div>
)

const SubSection = ({ title, description, children }) => (
  <div className="mb-8">
    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">{title}</h3>
    {description && <p className="text-xs text-gray-500 mb-3">{description}</p>}
    {children}
  </div>
)

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto mb-4 leading-relaxed">
    <code>{children}</code>
  </pre>
)

const Tag = ({ children, color = 'gray' }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-600',
    violet: 'bg-violet-100 text-violet-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}

const PropsTable = ({ rows }) => (
  <div className="overflow-x-auto mb-6">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-50">
          {['Prop', 'Type', 'Default', 'Description'].map((h) => (
            <th
              key={h}
              className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 text-xs uppercase tracking-wide"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(([prop, type, def, desc]) => (
          <tr key={prop} className="even:bg-gray-50">
            <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
              {prop}
            </td>
            <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500 max-w-xs">
              {type}
            </td>
            <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
              {def || '—'}
            </td>
            <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const inputClass =
  'w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground'
const labelClass = 'text-sm font-medium text-foreground'

// ─── Story ────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="flex flex-col gap-0 w-full max-w-3xl py-6 px-2">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-10">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-gray-900">Modal</h1>
            <Tag color="violet">Base Component</Tag>
          </div>
          <p className="text-base text-gray-500 leading-relaxed">
            A dialog overlay that interrupts the user to present critical information or capture
            input. Supports controlled and uncontrolled state, two layout variants, five sizes, and
            four animation styles.
          </p>
        </div>

        {/* Overview */}
        <Section title="Overview">
          <div className="mb-4">
            <Modal>
              <ModalTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                >
                  <Settings size={14} />
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
                <ModalBody>
                  <p className="text-sm text-muted-foreground">
                    Your profile information is visible to other workspace members.
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
          <Code>{`import {
  Modal, ModalTrigger, ModalContent,
  ModalHeader, ModalHeaderContent, ModalIcon, ModalBody,
  ModalTitle, ModalDescription, ModalFooter, ModalClose,
} from '@/components/base/Modal/Modal'`}</Code>
        </Section>

        {/* Anatomy */}
        <Section title="Anatomy">
          <div className="overflow-x-auto w-full mb-6">
            <div className="min-w-max py-4">
              <div className="relative inline-flex flex-col gap-2 border-2 border-dashed border-gray-400 rounded p-4 pt-8 min-w-[360px]">
                <span className="absolute top-1.5 left-2.5 text-[10px] font-mono text-gray-500">
                  Modal
                </span>

                <div className="relative border-2 border-dashed border-orange-400 rounded px-3 py-2 pt-6">
                  <span className="absolute top-1 left-1.5 text-[10px] font-mono text-orange-500 whitespace-nowrap">
                    ModalTrigger
                  </span>
                  <span className="text-xs text-gray-500">button / any element</span>
                </div>

                <div className="relative inline-flex flex-col gap-2 border-2 border-dashed border-blue-400 rounded p-3 pt-7">
                  <span className="absolute top-1 left-1.5 text-[10px] font-mono text-blue-500 whitespace-nowrap">
                    ModalContent (size, variant, animation)
                  </span>

                  <div className="relative border-2 border-dashed border-violet-400 rounded p-2 pt-6">
                    <span className="absolute top-1 left-1.5 text-[10px] font-mono text-violet-500 whitespace-nowrap">
                      ModalHeader (layout="beside")
                    </span>
                    <div className="flex flex-row gap-2 items-start">
                      <div className="relative border-2 border-dashed border-violet-300 rounded px-2 py-1 pt-5 shrink-0">
                        <span className="absolute top-0.5 left-1 text-[10px] font-mono text-violet-400 whitespace-nowrap">
                          ModalIcon
                        </span>
                        <span className="text-xs text-gray-500">icon</span>
                      </div>
                      <div className="relative border-2 border-dashed border-violet-300 rounded p-2 pt-5 flex-1">
                        <span className="absolute top-0.5 left-1 text-[10px] font-mono text-violet-400 whitespace-nowrap">
                          ModalHeaderContent
                        </span>
                        <div className="flex flex-col gap-1">
                          <div className="relative border-2 border-dashed border-violet-200 rounded px-2 py-0.5 pt-4">
                            <span className="absolute top-0.5 left-1 text-[10px] font-mono text-violet-300 whitespace-nowrap">
                              ModalTitle
                            </span>
                            <span className="text-xs font-semibold text-gray-700">Title</span>
                          </div>
                          <div className="relative border-2 border-dashed border-violet-200 rounded px-2 py-0.5 pt-4">
                            <span className="absolute top-0.5 left-1 text-[10px] font-mono text-violet-300 whitespace-nowrap">
                              ModalDescription
                            </span>
                            <span className="text-xs text-gray-500">Description</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative border-2 border-dashed border-sky-400 rounded px-2 py-1.5 pt-5">
                    <span className="absolute top-0.5 left-1.5 text-[10px] font-mono text-sky-500 whitespace-nowrap">
                      ModalBody
                    </span>
                    <span className="text-xs text-gray-400">content / form fields</span>
                  </div>

                  <div className="relative border-2 border-dashed border-green-400 rounded p-2 pt-6">
                    <span className="absolute top-1 left-1.5 text-[10px] font-mono text-green-500 whitespace-nowrap">
                      ModalFooter
                    </span>
                    <div className="flex gap-2">
                      <div className="relative border-2 border-dashed border-green-300 rounded px-2 py-1 pt-5">
                        <span className="absolute top-0.5 left-1.5 text-[10px] font-mono text-green-400 whitespace-nowrap">
                          ModalClose
                        </span>
                        <span className="text-xs text-gray-500">Cancel</span>
                      </div>
                      <div className="relative border-2 border-dashed border-gray-300 rounded px-2 py-1 pt-5">
                        <span className="absolute top-0.5 left-1.5 text-[10px] font-mono text-gray-400 whitespace-nowrap">
                          button
                        </span>
                        <span className="text-xs text-gray-700">Save</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Part', 'Element', 'Description'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 text-xs uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    'Modal',
                    'div (context)',
                    'Root — manages open/closed state. Accepts open + onOpenChange for controlled mode.',
                  ],
                  [
                    'ModalTrigger',
                    'button',
                    'Opens the modal on click. Use asChild to render as your own element.',
                  ],
                  [
                    'ModalContent',
                    'div[role="dialog"]',
                    'The panel itself — overlay, close button, animation, size, and variant are all set here.',
                  ],
                  [
                    'ModalHeader',
                    'div',
                    'Header wrapper. layout="beside" places ModalIcon on the left and ModalHeaderContent on the right.',
                  ],
                  [
                    'ModalIcon',
                    'div',
                    'Rounded icon box (size-9, rounded-lg, violet tint). Used inside ModalHeader with layout="beside".',
                  ],
                  [
                    'ModalHeaderContent',
                    'div',
                    'Flex-column wrapper for ModalTitle + ModalDescription in the beside layout.',
                  ],
                  [
                    'ModalTitle',
                    'h2',
                    'Accessible dialog title. Required — read by screen readers via aria-labelledby.',
                  ],
                  [
                    'ModalDescription',
                    'p',
                    'Optional subtitle. Also linked to the dialog via aria-describedby.',
                  ],
                  [
                    'ModalBody',
                    'div',
                    'Scrollable body between header and footer. In the bordered variant, adds flex-1 min-h-0 overflow-y-auto p-4.',
                  ],
                  [
                    'ModalFooter',
                    'div',
                    'Action area at the bottom. layout controls alignment (left/right/center). Stacks on mobile.',
                  ],
                  [
                    'ModalClose',
                    'button',
                    'Closes the modal on click. Use asChild to wrap a Cancel button.',
                  ],
                ].map(([part, el, desc]) => (
                  <tr key={part} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                      {part}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500 whitespace-nowrap">
                      {el}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Code>{`<Modal>
  <ModalTrigger asChild>
    <button type="button">Open</button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader layout="beside">
      <ModalIcon icon={Settings} />
      <ModalHeaderContent>
        <ModalTitle>Title</ModalTitle>
        <ModalDescription>Description</ModalDescription>
      </ModalHeaderContent>
    </ModalHeader>
    <ModalBody>...</ModalBody>
    <ModalFooter>
      <ModalClose asChild>
        <button type="button">Cancel</button>
      </ModalClose>
      <button type="button">Save</button>
    </ModalFooter>
  </ModalContent>
</Modal>`}</Code>
        </Section>

        {/* Variants */}
        <Section
          title="Variants"
          description="ModalContent accepts a variant prop that controls the layout structure."
        >
          <SubSection
            title="Default"
            description="Gap and padding are built into the root panel. Place ModalHeader, ModalBody, and ModalFooter as direct children."
          >
            <div className="mb-4">
              <Modal>
                <ModalTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                  >
                    Open (default)
                  </button>
                </ModalTrigger>
                <ModalContent>
                  <ModalHeader>
                    <ModalTitle>Account Settings</ModalTitle>
                    <ModalDescription>Manage your preferences.</ModalDescription>
                  </ModalHeader>
                  <ModalBody>
                    <p className="text-sm text-muted-foreground">Content goes here.</p>
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
                      Save
                    </button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
            <Code>{`<ModalContent>
  <ModalHeader>...</ModalHeader>
  <ModalBody>...</ModalBody>
  <ModalFooter>...</ModalFooter>
</ModalContent>`}</Code>
          </SubSection>

          <SubSection
            title="Bordered"
            description="Adds a divider line between header, body, and footer. Always use ModalBody to wrap the scrollable content in this variant."
          >
            <div className="mb-4">
              <Modal>
                <ModalTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                  >
                    Open (bordered)
                  </button>
                </ModalTrigger>
                <ModalContent variant="bordered">
                  <ModalHeader>
                    <ModalTitle>Terms & Conditions</ModalTitle>
                    <ModalDescription>Please read before proceeding.</ModalDescription>
                  </ModalHeader>
                  <ModalBody>
                    <p className="text-sm text-muted-foreground">
                      Scrollable body content goes here.
                    </p>
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
            <Code>{`<ModalContent variant="bordered">
  <ModalHeader>...</ModalHeader>
  <ModalBody>...</ModalBody>   {/* required in bordered */}
  <ModalFooter>...</ModalFooter>
</ModalContent>`}</Code>
          </SubSection>
        </Section>

        {/* Usage */}
        <Section title="Usage">
          <SubSection
            title="Controlled State"
            description="Pass open and onOpenChange to Modal to control it programmatically — no ModalTrigger needed."
          >
            <div className="flex items-center gap-3 mb-4">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
              >
                Open (controlled)
              </button>
              <span className="text-xs text-gray-400">
                open: <code className="font-mono bg-gray-100 px-1 rounded">{String(open)}</code>
              </span>
            </div>
            <Modal open={open} onOpenChange={setOpen}>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>Controlled Modal</ModalTitle>
                  <ModalDescription>Opened via useState — no ModalTrigger.</ModalDescription>
                </ModalHeader>
                <ModalFooter>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                  >
                    Close
                  </button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Code>{`const [open, setOpen] = useState(false)

<Modal open={open} onOpenChange={setOpen}>
  <ModalContent>...</ModalContent>
</Modal>`}</Code>
          </SubSection>

          <SubSection
            title="Confirmation Dialog"
            description="Use size='sm' and showCloseButton={false} for destructive action confirmations."
          >
            <div className="mb-4">
              <Modal>
                <ModalTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-white text-sm font-medium hover:bg-destructive/90 transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete Item
                  </button>
                </ModalTrigger>
                <ModalContent size="sm" showCloseButton={false}>
                  <ModalHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10 shrink-0">
                        <TriangleAlert size={18} className="text-destructive" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <ModalTitle>Delete Item?</ModalTitle>
                        <ModalDescription>This cannot be undone.</ModalDescription>
                      </div>
                    </div>
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
                    <ModalClose asChild>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-destructive text-white text-sm font-medium hover:bg-destructive/90 transition-colors"
                      >
                        Delete
                      </button>
                    </ModalClose>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
            <Code>{`<ModalContent size="sm" showCloseButton={false}>
  <ModalHeader>
    <ModalTitle>Delete Item?</ModalTitle>
    <ModalDescription>This cannot be undone.</ModalDescription>
  </ModalHeader>
  <ModalFooter>
    <ModalClose asChild><button>Cancel</button></ModalClose>
    <ModalClose asChild><button>Delete</button></ModalClose>
  </ModalFooter>
</ModalContent>`}</Code>
          </SubSection>

          <SubSection
            title="Form Modal"
            description="Place form fields inside ModalBody to separate them from header and footer."
          >
            <div className="mb-4">
              <Modal>
                <ModalTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                  >
                    <Settings size={14} />
                    Settings
                  </button>
                </ModalTrigger>
                <ModalContent>
                  <ModalHeader>
                    <ModalTitle>Account Settings</ModalTitle>
                    <ModalDescription>Manage your account preferences.</ModalDescription>
                  </ModalHeader>
                  <ModalBody>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className={labelClass}>Display Name</label>
                        <input type="text" defaultValue="Rafael Cahya" className={inputClass} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className={labelClass}>Currency</label>
                        <select className={inputClass}>
                          <option>IDR — Indonesian Rupiah</option>
                          <option>USD — US Dollar</option>
                        </select>
                      </div>
                    </div>
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
                      Save
                    </button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
            <Code>{`<ModalContent>
  <ModalHeader>
    <ModalTitle>Account Settings</ModalTitle>
  </ModalHeader>
  <ModalBody>
    <div className="flex flex-col gap-4">
      <input type="text" />
      <select>...</select>
    </div>
  </ModalBody>
  <ModalFooter>
    <ModalClose asChild><button>Cancel</button></ModalClose>
    <button>Save</button>
  </ModalFooter>
</ModalContent>`}</Code>
          </SubSection>
        </Section>

        {/* Best Practices */}
        <Section title="Best Practices">
          <div className="flex flex-col gap-8">
            {[
              {
                heading: 'When to use',
                items: [
                  {
                    title: 'Use Modal for blocking decisions and required input',
                    body: 'Use Modal when the user must complete or acknowledge something before the page can continue — confirmations, form submissions, critical alerts.',
                  },
                  {
                    title: 'Choose Modal over Sheet when full attention is needed',
                    body: 'Modal blocks background interactions. Use it when the content requires focused engagement and the user should not be able to interact with the page behind.',
                  },
                ],
              },
              {
                heading: 'When not to use',
                items: [
                  {
                    title: 'Avoid Modal for supplemental or contextual content',
                    body: "Filters, previews, and side panels that don't require a decision belong in a Sheet. They let users still see the page context while interacting.",
                  },
                  {
                    title: 'Never nest modals',
                    body: 'A second modal inside a modal creates disorienting UX. Chain steps inside a single modal with internal navigation, or push to a new page instead.',
                  },
                ],
              },
              {
                heading: 'Accessibility',
                items: [
                  {
                    title: 'ModalTitle is required — even if visually hidden',
                    body: 'Every modal must include ModalTitle. It is linked via aria-labelledby and read aloud by screen readers when the modal opens. Hide it with className="sr-only" if the design has no visible title.',
                  },
                  {
                    title: 'Always provide a dismiss path when the close button is hidden',
                    body: 'If showCloseButton={false}, ensure ModalClose is present in the footer. Without it, keyboard and screen reader users have no way to exit the modal.',
                  },
                ],
              },
              {
                heading: 'Advice',
                items: [
                  {
                    title: 'Use size="sm" + showCloseButton={false} for destructive confirmations',
                    body: 'Forces the user to make an explicit choice through footer buttons. Pair with closeOnOverlayClick={false} when the action is irreversible.',
                  },
                  {
                    title: 'Always use ModalBody in the bordered variant',
                    body: 'The bordered variant relies on ModalBody to apply flex-1 min-h-0 overflow-y-auto. Without it, long content will not scroll and the footer can be pushed off-screen.',
                  },
                  {
                    title: 'Prefer uncontrolled for co-located triggers',
                    body: 'Use Modal + ModalTrigger whenever the trigger and modal are in the same tree. Only reach for controlled mode (open + onOpenChange) when the trigger is remote or the modal opens from an async event.',
                  },
                ],
              },
            ].map(({ heading, items }) => (
              <div key={heading}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {heading}
                </p>
                <div className="flex flex-col gap-3">
                  {items.map(({ title, body }) => (
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
        </Section>

        {/* API Reference */}
        <Section title="API Reference">
          <SubSection title="Modal">
            <PropsTable
              rows={[
                ['open', 'boolean', '—', 'Controlled open state.'],
                ['onOpenChange', '(open: boolean) => void', '—', 'Called when open state changes.'],
                ['defaultOpen', 'boolean', 'false', 'Initial open state for uncontrolled usage.'],
              ]}
            />
          </SubSection>

          <SubSection title="ModalContent">
            <PropsTable
              rows={[
                ['size', 'sm | md | lg | xl | full', 'md', 'Controls max-width of the panel.'],
                [
                  'variant',
                  'default | bordered',
                  'default',
                  'default uses gap+padding; bordered adds dividers between header, body, and footer.',
                ],
                [
                  'animation',
                  'none | zoom | fade | slide-up | slide-down',
                  'zoom',
                  'Enter/exit animation. none disables animation entirely.',
                ],
                [
                  'duration',
                  'fast | default | slow | slower | number',
                  'default',
                  'Animation duration. Presets: fast=100ms, default=200ms, slow=400ms, slower=700ms. Pass a number for custom ms.',
                ],
                [
                  'showCloseButton',
                  'boolean',
                  'true',
                  'Shows the × close button in the top-right corner.',
                ],
                [
                  'closeOnOverlayClick',
                  'boolean',
                  'true',
                  'When false, clicking the backdrop does not close the modal.',
                ],
                ['overlayOpacity', 'number', '50', 'Backdrop opacity as a percentage (0–100).'],
                [
                  'radius',
                  'none | xs | sm | base | md | lg | xl | full',
                  'lg',
                  'Border radius of the modal panel.',
                ],
                [
                  'borderColor',
                  'string',
                  '—',
                  'Tailwind border class applied to header/footer dividers in the bordered variant (e.g. "border-violet-200").',
                ],
                ['className', 'string', '—', 'Additional CSS classes merged via cn().'],
              ]}
            />
          </SubSection>

          <SubSection title="ModalHeader">
            <PropsTable
              rows={[
                [
                  'layout',
                  'default | beside',
                  'default',
                  'beside places ModalIcon on the left and ModalHeaderContent on the right.',
                ],
                ['className', 'string', '—', 'Additional CSS classes merged via cn().'],
              ]}
            />
          </SubSection>

          <SubSection title="ModalIcon">
            <PropsTable
              rows={[
                [
                  'icon',
                  'LucideIcon',
                  '—',
                  'Required. The icon component to render inside the box.',
                ],
                [
                  'className',
                  'string',
                  '—',
                  'Overrides the icon box container classes (default: size-9 rounded-lg bg-violet-50).',
                ],
                [
                  'iconClassName',
                  'string',
                  '—',
                  'Overrides the icon element classes (default: size-4 text-violet-600).',
                ],
              ]}
            />
          </SubSection>

          <SubSection title="ModalBody">
            <PropsTable
              rows={[
                [
                  'className',
                  'string',
                  '—',
                  'Additional CSS classes merged via cn(). In the bordered variant, flex-1 min-h-0 overflow-y-auto p-4 are applied automatically.',
                ],
              ]}
            />
          </SubSection>

          <SubSection title="ModalFooter">
            <PropsTable
              rows={[
                [
                  'layout',
                  'left | right | center',
                  'right',
                  'Controls button alignment within the footer.',
                ],
                [
                  'buttonFullWidth',
                  'boolean',
                  'false',
                  'When layout="center", makes all buttons flex-1 (equal width).',
                ],
                ['className', 'string', '—', 'Additional CSS classes merged via cn().'],
              ]}
            />
          </SubSection>

          <SubSection title="ModalTitle">
            <PropsTable
              rows={[
                [
                  'className',
                  'string',
                  '—',
                  'Additional CSS classes. Default: text-base font-semibold text-slate-800.',
                ],
              ]}
            />
          </SubSection>

          <SubSection title="ModalDescription">
            <PropsTable
              rows={[
                [
                  'className',
                  'string',
                  '—',
                  'Additional CSS classes. Default: text-xs text-slate-500.',
                ],
              ]}
            />
          </SubSection>

          <SubSection title="ModalTrigger / ModalClose">
            <PropsTable
              rows={[
                [
                  'asChild',
                  'boolean',
                  'false',
                  'Merges props onto the child element instead of rendering a native button.',
                ],
              ]}
            />
          </SubSection>
        </Section>
      </div>
    )
  },
}
