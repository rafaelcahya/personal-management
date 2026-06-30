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

export const Sizes = {
  name: 'Sizes',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">size</code> prop on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">ModalContent</code> controls
        the maximum width of the panel. Default is{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">md</code>.
      </p>

      <div className="flex flex-col gap-5 w-full max-w-2xl">
        {[
          {
            size: 'sm',
            label: 'sm — max-w-sm (384px)',
            desc: 'Compact alerts, confirmations, and short prompts.',
          },
          {
            size: 'md',
            label: 'md — max-w-lg (512px) — default',
            desc: 'General purpose: edit forms, settings, detail views.',
          },
          {
            size: 'lg',
            label: 'lg — max-w-2xl (672px)',
            desc: 'Wider content: multi-column forms, rich editors.',
          },
          {
            size: 'xl',
            label: 'xl — max-w-4xl (896px)',
            desc: 'Large data previews, tables, image galleries.',
          },
          {
            size: 'full',
            label: 'full — 100vw × 100vh',
            desc: 'Fullscreen takeover for immersive tasks.',
          },
        ].map(({ size, label, desc }) => (
          <div key={size} className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">{label}</span>
            <div>
              <Modal>
                <ModalTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                  >
                    Open {size}
                  </button>
                </ModalTrigger>
                <ModalContent size={size}>
                  <ModalHeader>
                    <ModalTitle>Size: {size}</ModalTitle>
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
            </div>
          </div>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent size="sm">...</ModalContent>
<ModalContent size="md">...</ModalContent>   {/* default */}
<ModalContent size="lg">...</ModalContent>
<ModalContent size="xl">...</ModalContent>
<ModalContent size="full">...</ModalContent>`}</code>
      </pre>
    </div>
  ),
}
