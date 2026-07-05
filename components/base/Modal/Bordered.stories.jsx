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

export const Bordered = {
  name: 'Bordered',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        The <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">bordered</code> variant adds a
        divider between the header, body, and footer. Use{' '}
        <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">ModalBody</code> to wrap the
        scrollable body content.
      </p>

      <div className="flex flex-col gap-5 w-full max-w-2xl">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">bordered — header + body + footer</span>
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
                    Your profile information is visible to other members of your workspace. Keep it
                    up to date so teammates can reach you.
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
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">
            bordered — with scrollable body (long content)
          </span>
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
                      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                      nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
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
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">bordered — without footer</span>
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
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <p className="text-xs text-gray-500">
            Use <code className="bg-gray-100 px-1 py-0.5 rounded">borderColor</code> to customize
            the divider color (any Tailwind border color class).
          </p>

          <div className="flex flex-wrap gap-3">
            {[
              {
                label: 'violet-200 (default)',
                color: 'border-violet-200',
                btn: 'border-violet-300 text-violet-700 hover:bg-violet-50',
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
                        The header and footer borders use the{' '}
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
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Modal>
  <ModalTrigger asChild>
    <button type="button">Open Modal</button>
  </ModalTrigger>
  <ModalContent variant="bordered" borderColor="border-violet-200">
    <ModalHeader>
      <ModalTitle>Title</ModalTitle>
      <ModalDescription>Description</ModalDescription>
    </ModalHeader>
    <ModalBody>
      {/* scrollable body content */}
    </ModalBody>
    <ModalFooter>
      <ModalClose asChild>
        <button type="button">Cancel</button>
      </ModalClose>
      <button type="button">Save</button>
    </ModalFooter>
  </ModalContent>
</Modal>`}</code>
      </pre>
    </div>
  ),
}
