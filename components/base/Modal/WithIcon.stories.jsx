import { Settings, AlertTriangle, Info } from 'lucide-react'
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
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Modal/WithIcon',
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

export const WithIconTitleDescription = {
  name: 'With Icon — Title + Description',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">layout="beside"</code> on{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">ModalHeader</code> with{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">ModalIcon</code> and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">ModalHeaderContent</code> to
          place an icon on the left with the title and description stacked on the right. Wrap both
          title and description inside{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">ModalHeaderContent</code> to
          maintain proper vertical alignment.
        </p>
      </div>

      <div>
        <Modal>
          <ModalTrigger asChild>
            <Button variant="outline">Open Modal</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader layout="beside">
              <ModalIcon icon={Settings} />
              <ModalHeaderContent>
                <ModalTitle>Settings</ModalTitle>
                <ModalDescription>Manage your account preferences.</ModalDescription>
              </ModalHeaderContent>
            </ModalHeader>
            <ModalBody>
              <p className="text-sm text-slate-600">Modal body content goes here.</p>
            </ModalBody>
            <ModalFooter>
              <ModalClose asChild>
                <Button variant="outline">Cancel</Button>
              </ModalClose>
              <Button>Save</Button>
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
                title: 'Use icons to communicate the modal category at a glance',
                body: 'A gear for settings, warning triangle for destructive actions, lock for security prompts. The icon should reinforce the title, not replace it.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use an icon just for visual decoration",
                body: 'If the icon adds no semantic meaning beyond what the title already says, omit it. Decorative icons increase visual complexity without adding information.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'ModalIcon applies aria-hidden automatically',
                body: 'The icon is hidden from screen readers — the accessible label comes from ModalTitle via aria-labelledby. Never rely on the icon alone to communicate meaning.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use ModalHeaderContent to wrap title and description together',
                body: 'When using layout="beside", wrapping both ModalTitle and ModalDescription inside ModalHeaderContent is the only way to keep the two-line block aligned with the icon center.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalHeader layout="beside">
  <ModalIcon icon={Settings} />
  <ModalHeaderContent>
    <ModalTitle>Settings</ModalTitle>
    <ModalDescription>Manage your account preferences.</ModalDescription>
  </ModalHeaderContent>
</ModalHeader>`}</code>
      </pre>
    </div>
  ),
}

export const WithIconTitleOnly = {
  name: 'With Icon — Title Only',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          When there is no description, place{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">ModalTitle</code> directly
          inside <code className="font-mono bg-gray-100 px-1 rounded text-xs">ModalHeader</code>{' '}
          alongside <code className="font-mono bg-gray-100 px-1 rounded text-xs">ModalIcon</code>.
          There is no need for{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">ModalHeaderContent</code>{' '}
          when there is only a single line of text to align.
        </p>
      </div>

      <div>
        <Modal>
          <ModalTrigger asChild>
            <Button variant="outline">Open Modal</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader layout="beside">
              <ModalIcon icon={Info} />
              <ModalTitle>Information</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <p className="text-sm text-slate-600">Modal body content goes here.</p>
            </ModalBody>
            <ModalFooter>
              <ModalClose asChild>
                <Button>Got it</Button>
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
                title: 'Use title-only when the body provides full context',
                body: 'When the body content already explains everything, a description line in the header is redundant. A single clean title + icon header keeps it minimal.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Add a description if the modal has complex or multi-step content',
                body: 'If the user needs orientation before reading the body, a description helps them understand the purpose of the modal before engaging with the content.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always keep ModalTitle — required for aria-labelledby',
                body: 'Even when there is no description, ModalTitle is required. It provides the accessible name announced by screen readers when the modal opens.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Works best for short, focused acknowledgement dialogs',
                body: 'A single-line icon header is ideal for "Got it", info, and one-tap dismissal prompts where the user reads the body and immediately closes.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalHeader layout="beside">
  <ModalIcon icon={Info} />
  <ModalTitle>Information</ModalTitle>
</ModalHeader>`}</code>
      </pre>
    </div>
  ),
}

export const WithIconDescriptionOnly = {
  name: 'With Icon — Description Only',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          For compact alerts, place{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">ModalDescription</code>{' '}
          directly inside{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">ModalHeader</code> without a
          title. The dialog still uses the description text for{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">aria-describedby</code>{' '}
          accessibility. Use{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">className</code> and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">iconClassName</code> on{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">ModalIcon</code> to apply a
          semantic color.
        </p>
      </div>

      <div>
        <Modal>
          <ModalTrigger asChild>
            <Button variant="outline">Open Modal</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader layout="beside">
              <ModalIcon
                icon={AlertTriangle}
                className="bg-amber-50"
                iconClassName="text-amber-600"
              />
              <ModalDescription>This action cannot be undone.</ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <ModalClose asChild>
                <Button variant="outline">Cancel</Button>
              </ModalClose>
              <Button variant="destructive">Delete</Button>
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
                title: 'Use for ultra-compact confirmation dialogs with a single-sentence message',
                body: '"This action cannot be undone." — when the message is short enough that a formal title would feel redundant. Works best with size="sm" and a two-button footer.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid for complex scenarios needing full context',
                body: 'If the user needs title + body content to make an informed decision, use the standard header pattern with ModalTitle and ModalDescription.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'When omitting ModalTitle, aria-labelledby will not be set',
                body: 'The description text via aria-describedby partially compensates, but the dialog may not be announced with a clear title by screen readers. Use with caution.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Color the icon to communicate severity before the user reads the text',
                body: 'Amber for warning, red/destructive for irreversible actions — the icon color should tell the story immediately, before the user processes the description text.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalHeader layout="beside">
  <ModalIcon
    icon={AlertTriangle}
    className="bg-amber-50"
    iconClassName="text-amber-600"
  />
  <ModalDescription>This action cannot be undone.</ModalDescription>
</ModalHeader>`}</code>
      </pre>
    </div>
  ),
}
