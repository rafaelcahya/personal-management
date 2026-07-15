import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Accordion/Basic',
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

export const Single = {
  name: 'Single',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">type="single"</code> allows
        only one item to be open at a time. Opening a different item automatically closes the
        current one. The open item cannot be closed by clicking its trigger again — add{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">collapsible</code> to allow
        that.
      </p>

      <div className="w-full max-w-2xl">
        <Accordion type="single">
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
                title: 'Use for settings pages and wizard steps',
                body: 'Only one section active at a time keeps the layout predictable and avoids overwhelming users with too much simultaneous content.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid when users need to reference multiple sections at once',
                body: 'type="single" hides inactive sections. If users need to compare content across sections simultaneously, use type="multiple" instead.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Triggers are keyboard navigable out of the box',
                body: 'AccordionTrigger renders as a <button> and supports Tab, Enter, and Space. aria-expanded updates automatically on every toggle.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always give each AccordionItem a unique, stable value',
                body: 'Duplicate or numeric index values cause unpredictable open/close behavior and break controlled mode.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Accordion type="single">
  <AccordionItem value="item-1">
    <AccordionTrigger>Personal Information</AccordionTrigger>
    <AccordionContent>Update your name and email.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Notification Preferences</AccordionTrigger>
    <AccordionContent>Choose your notification channels.</AccordionContent>
  </AccordionItem>
</Accordion>`}</code>
      </pre>
    </div>
  ),
}

export const Collapsible = {
  name: 'Collapsible',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Adding <code className="font-mono bg-gray-100 px-1 rounded text-xs">collapsible</code> to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">type="single"</code> lets the
        currently open item be closed by clicking its trigger again — so all items can be collapsed
        simultaneously.
      </p>

      <div className="w-full max-w-2xl">
        <Accordion type="single" collapsible>
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
                title: 'Use when users should be able to dismiss all sections',
                body: 'Good for FAQ lists, AI history cards, or "More details" sections where the user might want a completely clean view with nothing expanded.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid in forms where hidden fields have no default value',
                body: 'Collapsing hides form fields that are still submitted. An empty hidden field can cause silent validation failures the user never sees.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'All-collapsed state is valid and screen reader-friendly',
                body: 'When all items are collapsed, aria-expanded="false" on every trigger. Screen readers correctly announce there is nothing expanded — no extra ARIA needed.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair with defaultValue to guide users to the most relevant section on load',
                body: 'Without defaultValue all items start closed. Use it when context matters — e.g. open the section most relevant to why the user is on this page.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Clicking the open trigger closes it — all items can be collapsed */}
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Personal Information</AccordionTrigger>
    <AccordionContent>Update your name and email.</AccordionContent>
  </AccordionItem>
</Accordion>

{/* Pre-open item-1 on mount */}
<Accordion type="single" collapsible defaultValue="item-1">
  ...
</Accordion>`}</code>
      </pre>
    </div>
  ),
}

export const Multiple = {
  name: 'Multiple',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">type="multiple"</code> allows
        any number of items to be open simultaneously. Each item toggles independently.
      </p>

      <div className="w-full max-w-2xl">
        <Accordion type="multiple">
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
                title: 'Use for FAQ lists, reference docs, and comparison views',
                body: 'type="multiple" is appropriate when users need to read multiple sections side by side without the layout forcing them to close one to open another.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid for settings pages and step-by-step flows',
                body: 'Seeing multiple open sections in a form or wizard creates confusion about what to complete first. Use type="single" so users focus on one section at a time.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Each item has its own independent aria-expanded state',
                body: 'Screen readers correctly announce the state of every item regardless of how many are open simultaneously — no extra ARIA needed.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pass defaultValue as an array to pre-open items on mount',
                body: 'type="multiple" does not have a collapsible prop — each item always toggles independently. Use defaultValue={["item-1", "item-2"]} (not a string) to pre-open specific items.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Accordion type="multiple">
  <AccordionItem value="item-1">
    <AccordionTrigger>Personal Information</AccordionTrigger>
    <AccordionContent>Update your name and email.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Notification Preferences</AccordionTrigger>
    <AccordionContent>Choose your notification channels.</AccordionContent>
  </AccordionItem>
</Accordion>`}</code>
      </pre>
    </div>
  ),
}
