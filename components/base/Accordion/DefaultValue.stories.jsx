import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Accordion/Default Value',
}

export default meta

const ITEMS = [
  {
    value: 'item-1',
    trigger: 'Personal Information',
    content: 'Update your name, email address, and profile photo. Changes are saved automatically.',
  },
  {
    value: 'item-2',
    trigger: 'Notification Preferences',
    content: 'Choose which notifications you want to receive — push, email, or in-app alerts.',
  },
  {
    value: 'item-3',
    trigger: 'Security & Privacy',
    content: 'Manage your password, two-factor authentication, and connected devices.',
  },
]

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

export const SingleDefaultValue = {
  name: 'Single Default Value',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass a string to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">defaultValue</code> on a{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">type="single"</code> accordion
        to pre-open a specific item on mount. The accordion is still uncontrolled — the user can
        freely open and close items after that.
      </p>

      <div className="w-full max-w-2xl">
        <Accordion type="single" collapsible defaultValue="item-2">
          {ITEMS.map(({ value, trigger, content }) => (
            <AccordionItem key={value} value={value}>
              <AccordionTrigger>{trigger}</AccordionTrigger>
              <AccordionContent>{content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use to highlight the most contextually relevant section on first load',
                body: 'Open "Profile" by default on a settings page so users land where they most commonly start, without requiring an extra click.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't pre-open a section when the choice should be the user's",
                body: 'If no section is more important than another, leave all items closed. Forcing a section open can feel disorienting when users arrive with a specific section already in mind.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Pre-opened sections are announced as expanded on initial render',
                body: 'Screen readers read aria-expanded="true" on mount. Pre-opening a section communicates priority — use it intentionally, not as a default for every accordion.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use value + onValueChange instead when syncing with external state',
                body: 'defaultValue is uncontrolled (initial state only). For URL params, step indicators, or external components that need to drive the open state, use controlled mode.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* item-2 opens on mount */}
<Accordion type="single" collapsible defaultValue="item-2">
  <AccordionItem value="item-1">
    <AccordionTrigger>Personal Information</AccordionTrigger>
    <AccordionContent>Update your name and email.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Notification Preferences</AccordionTrigger>
    <AccordionContent>Choose your notification channels.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger>Security & Privacy</AccordionTrigger>
    <AccordionContent>Manage your password.</AccordionContent>
  </AccordionItem>
</Accordion>`}</code>
      </pre>
    </div>
  ),
}

export const MultipleDefaultValue = {
  name: 'Multiple Default Value',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        For <code className="font-mono bg-gray-100 px-1 rounded text-xs">type="multiple"</code>,
        pass an array to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">defaultValue</code> to pre-open
        multiple items on mount. Each element in the array must match a valid{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">AccordionItem</code> value.
      </p>

      <div className="w-full max-w-2xl">
        <Accordion type="multiple" defaultValue={['item-1', 'item-3']}>
          {ITEMS.map(({ value, trigger, content }) => (
            <AccordionItem key={value} value={value}>
              <AccordionTrigger>{trigger}</AccordionTrigger>
              <AccordionContent>{content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use to pre-open the sections users are most likely to compare',
                body: 'For example, open "Plan details" and "Current usage" together in a billing section so users can compare without extra clicks.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't pre-open too many items at once",
                body: 'If all items start open, the accordion provides no value over a plain always-visible list. Only pre-open what is contextually relevant on first load.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Multiple pre-opened items can be noisy for screen reader users',
                body: 'Each open item is announced as expanded on page load. Keep it to 1–2 pre-opened items — opening too many creates an overwhelming amount of announced state on mount.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pass an array to defaultValue — not a string — for type="multiple"',
                body: 'Use defaultValue={["item-1", "item-2"]}. A string value will not match any item and nothing will open.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* item-1 and item-3 open on mount */}
<Accordion type="multiple" defaultValue={['item-1', 'item-3']}>
  <AccordionItem value="item-1">
    <AccordionTrigger>Personal Information</AccordionTrigger>
    <AccordionContent>Update your name and email.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Notification Preferences</AccordionTrigger>
    <AccordionContent>Choose your notification channels.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger>Security & Privacy</AccordionTrigger>
    <AccordionContent>Manage your password.</AccordionContent>
  </AccordionItem>
</Accordion>`}</code>
      </pre>
    </div>
  ),
}
