import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Accordion/Disabled',
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

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> on an{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">AccordionItem</code> to prevent
        that item from being opened. The trigger becomes non-interactive and visually dimmed.
      </p>

      <div className="w-full max-w-2xl">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Personal Information</AccordionTrigger>
            <AccordionContent>
              Update your name, email address, and profile photo. Changes are saved automatically.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" disabled>
            <AccordionTrigger>Notification Preferences</AccordionTrigger>
            <AccordionContent>
              Choose which notifications you want to receive — push, email, or in-app alerts.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Security & Privacy</AccordionTrigger>
            <AccordionContent>
              Manage your password, two-factor authentication, and connected devices.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use disabled for items locked behind a prerequisite',
                body: '"Complete step 1 to unlock step 2", "upgrade plan to access this section". It signals "not yet available" — use it only when the item will eventually become accessible after an action.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use disabled to permanently hide items",
                body: 'Remove them from the DOM entirely instead. A disabled item is still visible and takes up layout space — it communicates that something exists but is inaccessible, not that it should be ignored.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'A disabled trigger with no explanation is confusing for all users',
                body: 'Add a visible hint near the trigger explaining what action will unlock it. Keyboard-only and screen reader users rely on this context just as much as sighted users.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Disabled state is visual only — content is still in the DOM',
                body: 'Do not use disabled to hide sensitive content. The content inside AccordionContent is rendered in the DOM when disabled; it just cannot be opened interactively.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<AccordionItem value="item-2" disabled>
  <AccordionTrigger>Notification Preferences</AccordionTrigger>
  <AccordionContent>...</AccordionContent>
</AccordionItem>`}</code>
      </pre>
    </div>
  ),
}
