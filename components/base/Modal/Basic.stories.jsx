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

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        A basic modal with a trigger button, header, description, and footer actions. The close
        button in the top-right and the overlay click both dismiss the modal by default.
      </p>

      <div className="flex flex-col gap-5 w-full max-w-2xl">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">default</span>
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
                  Your profile information is visible to other members of your workspace. Keep it up
                  to date so teammates can reach you.
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
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">
            closeOnOverlayClick={'{false}'} — overlay click disabled
          </span>
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
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">without close button</span>
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
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">radius — compare levels</span>
          <div className="flex flex-wrap gap-2">
            {['none', 'xs', 'sm', 'base', 'md', 'lg', 'xl', 'full'].map((radius) => (
              <Modal key={radius}>
                <ModalTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-accent transition-colors"
                  >
                    {radius}
                  </button>
                </ModalTrigger>
                <ModalContent radius={radius}>
                  <ModalHeader>
                    <ModalTitle>Radius: {radius}</ModalTitle>
                    <ModalDescription>Modal panel with radius="{radius}".</ModalDescription>
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
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">overlayOpacity — compare levels</span>
          <div className="flex flex-wrap gap-2">
            {[0, 25, 50, 75, 90].map((opacity) => (
              <Modal key={opacity}>
                <ModalTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-accent transition-colors"
                  >
                    {opacity}%
                  </button>
                </ModalTrigger>
                <ModalContent overlayOpacity={opacity}>
                  <ModalHeader>
                    <ModalTitle>Overlay opacity: {opacity}%</ModalTitle>
                    <ModalDescription>
                      The grey area behind this modal is at {opacity}% opacity.
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
            ))}
          </div>
        </div>
      </div>

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
