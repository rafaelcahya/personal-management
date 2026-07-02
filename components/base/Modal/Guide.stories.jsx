import { useState } from 'react'
import { TriangleAlert, Trash2, Settings } from 'lucide-react'
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
  title: 'Modal',
}

export default meta

const inputClass =
  'w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground'

const labelClass = 'text-sm font-medium text-foreground'

export const Docs = {
  name: 'Docs',
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="flex flex-col gap-10 w-full max-w-3xl py-6 px-2">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Modal</h1>
          <p className="text-base text-gray-500 leading-relaxed">
            A dialog overlay that interrupts the user to present critical information or capture
            input. Supports five size options and full controlled state support.
          </p>
        </div>

        {/* Overview */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Overview</h2>
          <div>
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
                <p className="text-sm text-muted-foreground">
                  Your profile information is visible to other workspace members.
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
          <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
            <code>{`import {
  Modal, ModalTrigger, ModalContent, ModalHeader,
  ModalTitle, ModalDescription, ModalFooter, ModalClose,
} from '@/components/base/Modal/Modal'`}</code>
          </pre>
        </section>

        {/* Anatomy */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Anatomy</h2>
          <div className="overflow-x-auto w-full">
            <div className="min-w-max py-4">
              {/* Modal root */}
              <div className="relative inline-flex flex-col gap-2 border-2 border-dashed border-gray-400 rounded p-4 pt-8 min-w-[360px]">
                <span className="absolute top-1.5 left-2.5 text-[10px] font-mono text-gray-500">
                  Modal
                </span>

                {/* ModalTrigger */}
                <div className="relative border-2 border-dashed border-orange-400 rounded px-3 py-2 pt-6">
                  <span className="absolute top-1 left-1.5 text-[10px] font-mono text-orange-500 whitespace-nowrap">
                    ModalTrigger
                  </span>
                  <span className="text-xs text-gray-500">button / any element</span>
                </div>

                {/* ModalContent */}
                <div className="relative inline-flex flex-col gap-2 border-2 border-dashed border-blue-400 rounded p-3 pt-7">
                  <span className="absolute top-1 left-1.5 text-[10px] font-mono text-blue-500 whitespace-nowrap">
                    ModalContent (size)
                  </span>

                  {/* ModalHeader */}
                  <div className="relative border-2 border-dashed border-violet-400 rounded p-2 pt-6">
                    <span className="absolute top-1 left-1.5 text-[10px] font-mono text-violet-500 whitespace-nowrap">
                      ModalHeader
                    </span>
                    <div className="flex flex-col gap-1">
                      <div className="relative border-2 border-dashed border-violet-300 rounded px-2 py-1 pt-5">
                        <span className="absolute top-0.5 left-1.5 text-[10px] font-mono text-violet-400 whitespace-nowrap">
                          ModalTitle
                        </span>
                        <span className="text-xs font-semibold text-gray-700">Title</span>
                      </div>
                      <div className="relative border-2 border-dashed border-violet-300 rounded px-2 py-1 pt-5">
                        <span className="absolute top-0.5 left-1.5 text-[10px] font-mono text-violet-400 whitespace-nowrap">
                          ModalDescription
                        </span>
                        <span className="text-xs text-gray-500">Description text</span>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="relative border-2 border-dashed border-gray-300 rounded px-2 py-1.5 pt-5">
                    <span className="absolute top-0.5 left-1.5 text-[10px] font-mono text-gray-400 whitespace-nowrap">
                      children (body)
                    </span>
                    <span className="text-xs text-gray-400">content / form fields</span>
                  </div>

                  {/* ModalFooter */}
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

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-40">
                  Part
                </th>
                <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                [
                  'Modal',
                  'Root — manages open state. Accepts open + onOpenChange for controlled mode.',
                ],
                [
                  'ModalTrigger',
                  'Element that opens the modal. Use asChild to render as your own button.',
                ],
                [
                  'ModalContent',
                  'The panel itself — includes overlay, close button, and animation. Accepts size prop.',
                ],
                [
                  'ModalHeader',
                  'Wrapper for ModalTitle and ModalDescription. Stacks them vertically with a gap.',
                ],
                ['ModalTitle', 'Accessible dialog title. Required for screen readers.'],
                [
                  'ModalDescription',
                  'Optional subtitle below the title. Also read by screen readers.',
                ],
                [
                  'ModalFooter',
                  'Action area at the bottom. Stacks vertically on mobile, row on desktop.',
                ],
                ['ModalClose', 'Closes the modal. Use asChild to wrap Cancel buttons.'],
              ].map(([part, desc]) => (
                <tr key={part}>
                  <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">{part}</td>
                  <td className="py-2.5 text-xs text-gray-600">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Size */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Size</h2>
          <p className="text-sm text-gray-500">
            Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">size</code> to{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">ModalContent</code> to
            control panel width. Default is{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">md</code>.
          </p>

          <div className="flex flex-col gap-4">
            {[
              { size: 'sm', classes: 'max-w-sm', use: 'Confirmations, alerts' },
              { size: 'md', classes: 'max-w-lg — default', use: 'Edit forms, settings' },
              { size: 'lg', classes: 'max-w-2xl', use: 'Multi-column forms, editors' },
              { size: 'xl', classes: 'max-w-4xl', use: 'Tables, previews, galleries' },
              { size: 'full', classes: '100vw × 100vh', use: 'Fullscreen tasks' },
            ].map(({ size, classes, use }) => (
              <div key={size} className="flex items-center gap-4">
                <Modal>
                  <ModalTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-accent transition-colors w-20 justify-center shrink-0"
                    >
                      {size}
                    </button>
                  </ModalTrigger>
                  <ModalContent size={size}>
                    <ModalHeader>
                      <ModalTitle>Size: {size}</ModalTitle>
                      <ModalDescription>
                        {classes} — {use}
                      </ModalDescription>
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
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-gray-700">{classes}</span>
                  <span className="text-xs text-gray-400">{use}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Animation */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Animation</h2>
          <p className="text-sm text-gray-500">
            Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">animation</code> to{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">ModalContent</code> to
            control how the panel enters and exits. Default is{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">zoom</code>.
          </p>

          <div className="flex flex-col gap-4">
            {[
              {
                animation: 'zoom',
                desc: 'Scale 95%→100% + fade — default',
                use: 'Standard desktop modals',
              },
              {
                animation: 'fade',
                desc: 'Opacity only, no movement',
                use: 'Minimal UI, reduced motion',
              },
              {
                animation: 'slide-up',
                desc: 'Slides from below + fade',
                use: 'Confirmations, mobile sheets',
              },
              {
                animation: 'slide-down',
                desc: 'Slides from above + fade',
                use: 'Alerts, notifications',
              },
            ].map(({ animation, desc, use }) => (
              <div key={animation} className="flex items-center gap-4">
                <Modal>
                  <ModalTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-accent transition-colors w-24 justify-center shrink-0"
                    >
                      {animation}
                    </button>
                  </ModalTrigger>
                  <ModalContent animation={animation}>
                    <ModalHeader>
                      <ModalTitle>Animation: {animation}</ModalTitle>
                      <ModalDescription>{desc}</ModalDescription>
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
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-gray-700">{desc}</span>
                  <span className="text-xs text-gray-400">{use}</span>
                </div>
              </div>
            ))}
          </div>

          <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
            <code>{`<ModalContent animation="zoom">...</ModalContent>      {/* default */}
<ModalContent animation="fade">...</ModalContent>
<ModalContent animation="slide-up">...</ModalContent>
<ModalContent animation="slide-down">...</ModalContent>`}</code>
          </pre>
        </section>

        {/* Controlled */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Controlled State</h2>
          <p className="text-sm text-gray-500">
            Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">open</code> and{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">onOpenChange</code> to{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">Modal</code> to control it
            programmatically — no{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">ModalTrigger</code> needed.
          </p>
          <div className="flex items-center gap-3">
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
                <ModalDescription>Opened via useState, no ModalTrigger.</ModalDescription>
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
          <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
            <code>{`const [open, setOpen] = useState(false)

<Modal open={open} onOpenChange={setOpen}>
  <ModalContent>...</ModalContent>
</Modal>`}</code>
          </pre>
        </section>

        {/* Props */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Props</h2>

          <div className="flex flex-col gap-6">
            {/* Modal */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-700">Modal</h3>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                      Prop
                    </th>
                    <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                      Type
                    </th>
                    <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                      Default
                    </th>
                    <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">open</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">boolean</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">—</td>
                    <td className="py-2.5 text-xs text-gray-600">Controlled open state.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">onOpenChange</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">
                      (open: boolean) =&gt; void
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">—</td>
                    <td className="py-2.5 text-xs text-gray-600">
                      Called when open state changes.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">defaultOpen</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">boolean</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">false</td>
                    <td className="py-2.5 text-xs text-gray-600">
                      Initial open state (uncontrolled).
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ModalContent */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-700">ModalContent</h3>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                      Prop
                    </th>
                    <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                      Type
                    </th>
                    <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                      Default
                    </th>
                    <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">size</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">
                      sm | md | lg | xl | full
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">md</td>
                    <td className="py-2.5 text-xs text-gray-600">
                      Controls max-width of the panel.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">animation</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">
                      none | zoom | fade | slide-up | slide-down
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">zoom</td>
                    <td className="py-2.5 text-xs text-gray-600">
                      Controls enter/exit animation. Use none to disable animation entirely.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">duration</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">
                      fast | default | slow | slower | number
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">default</td>
                    <td className="py-2.5 text-xs text-gray-600">
                      Animation duration. Presets: fast=100ms, default=200ms, slow=400ms,
                      slower=700ms. Pass a number for custom ms.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">showCloseButton</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">boolean</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">true</td>
                    <td className="py-2.5 text-xs text-gray-600">
                      Shows the × close button in the top-right corner.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">
                      closeOnOverlayClick
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">boolean</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">true</td>
                    <td className="py-2.5 text-xs text-gray-600">
                      When false, clicking the greyed overlay does not close the modal. Pair with
                      showCloseButton={'{false}'} to force users through footer actions.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">overlayOpacity</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">number</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">50</td>
                    <td className="py-2.5 text-xs text-gray-600">
                      Opacity of the backdrop overlay as a percentage (0–100). 0 = fully
                      transparent, 100 = fully opaque.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">radius</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">
                      none | xs | sm | base | md | lg | xl | full
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">lg</td>
                    <td className="py-2.5 text-xs text-gray-600">
                      Border radius of the modal panel.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">className</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">string</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">—</td>
                    <td className="py-2.5 text-xs text-gray-600">
                      Additional CSS classes merged via cn().
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Usage Examples</h2>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">
                Confirmation — delete action
              </span>
              <div>
                <Modal>
                  <ModalTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-white text-sm font-medium hover:bg-destructive/90 transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete
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
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Form — edit settings</span>
              <div>
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
            </div>
          </div>
        </section>

        {/* Dos and Don'ts */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Dos & Don'ts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-3 p-4 rounded-lg border border-green-100 bg-green-50">
              <span className="text-sm font-semibold text-green-700">Do</span>
              <ul className="flex flex-col gap-2 text-xs text-green-800 list-disc list-inside">
                <li>
                  Always include <code className="bg-green-100 px-1 rounded">ModalTitle</code> —
                  required for accessibility.
                </li>
                <li>
                  Use <code className="bg-green-100 px-1 rounded">size="sm"</code> for confirmations
                  to keep them focused.
                </li>
                <li>Use controlled mode when the modal is triggered by an async event.</li>
                <li>
                  Put primary action on the right in{' '}
                  <code className="bg-green-100 px-1 rounded">ModalFooter</code>.
                </li>
                <li>
                  Use <code className="bg-green-100 px-1 rounded">showCloseButton={'{false}'}</code>{' '}
                  for confirmations that require an explicit choice.
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-3 p-4 rounded-lg border border-red-100 bg-red-50">
              <span className="text-sm font-semibold text-red-700">Don't</span>
              <ul className="flex flex-col gap-2 text-xs text-red-800 list-disc list-inside">
                <li>Don't nest modals — one at a time per user flow.</li>
                <li>Don't use modals for non-critical info that fits inline or in a tooltip.</li>
                <li>
                  Don't use <code className="bg-red-100 px-1 rounded">size="full"</code> for simple
                  forms — it's disorienting.
                </li>
                <li>
                  Don't put too many fields in one modal — split into steps or a dedicated page
                  instead.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    )
  },
}
