import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Accordion/Variant',
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

export const DefaultSingle = {
  name: 'Default — Single',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="default"</code> with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">type="single"</code> renders a
        flat list with border-bottom separators between items. Only one item can be open at a time —
        opening another closes the current one.
      </p>

      <div className="w-full max-w-2xl">
        <Accordion variant="default" type="single" collapsible>
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
                title: 'Best for settings pages and wizard steps inside a card layout',
                body: 'The flat separator style integrates cleanly inside an existing card boundary without adding visual weight or double borders.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid wrapping variant="default" in another Card component',
                body: 'It creates double borders and visual redundancy. Use variant="card" instead when each item needs its own distinct boundary.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Flat separators have no impact on keyboard or screen reader behavior',
                body: 'Accessibility is identical to variant="card". The variant prop only changes the visual presentation — focus order and aria-expanded are unaffected.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair with collapsible so users can fully collapse all sections',
                body: 'Without collapsible, one section is always open. Add it when users need to focus on the content surrounding the accordion without any section expanded.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Accordion variant="default" type="single" collapsible>
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

export const DefaultMultiple = {
  name: 'Default — Multiple',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="default"</code> with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">type="multiple"</code> renders
        a flat list where any number of items can be open simultaneously. Each item toggles
        independently.
      </p>

      <div className="w-full max-w-2xl">
        <Accordion variant="default" type="multiple">
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
                title: 'Use for reference content like FAQs and comparison tables',
                body: 'Users may need to read multiple sections side by side without the layout forcing them to close one to open another. The flat separator keeps everything compact.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid in forms and step-by-step flows',
                body: 'Seeing multiple open sections simultaneously can create confusion about what to focus on. Use type="single" for flows where one section should be active at a time.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'All open sections maintain correct aria-expanded state',
                body: "Screen readers correctly announce each item's state regardless of how many are open simultaneously — no extra ARIA needed.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep section content short to prevent excessive page growth',
                body: 'variant="default" has no visual gap between items, so all open content stacks flush. Long content in multiple open sections makes the page very tall and hard to navigate.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Accordion variant="default" type="multiple">
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

export const CardSingle = {
  name: 'Card — Single',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="card"</code> with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">type="single"</code> renders
        each item as a standalone card with a border, rounded corners, and a gap between items. Only
        one card can be open at a time.
      </p>

      <div className="w-full max-w-2xl">
        <Accordion variant="card" type="single" collapsible>
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
                title: 'Best for expandable list items that are visually independent',
                body: "AI analysis history, trade logs, or grouped settings where each entry is self-contained and doesn't need to reference adjacent items.",
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Don\'t nest variant="card" inside another Card component',
                body: 'The double border creates visual noise. Use variant="default" inside card content instead — it adapts to the card boundary without adding its own border.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Card borders are presentational — keyboard behavior is unchanged',
                body: 'variant="card" only adds visual separation between items. Focus order and aria-expanded behavior are identical to variant="default".',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair with collapsible to let users see a clean compact list',
                body: 'Without collapsible, the open card can only be swapped for another, not dismissed. Add it when users should be able to fully collapse all cards.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Accordion variant="card" type="single" collapsible>
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

export const CardMultiple = {
  name: 'Card — Multiple',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="card"</code> with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">type="multiple"</code> renders
        each item as a standalone card where any number can be open simultaneously. The gap between
        cards remains visible whether items are open or closed.
      </p>

      <div className="w-full max-w-2xl">
        <Accordion variant="card" type="multiple">
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
                title: 'Use when users need to compare content across sections side by side',
                body: 'Each card gets its own border and gap, making it visually easy to separate sections. Good for plan comparisons, multi-metric breakdowns, or expandable data grouped by category.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid when sections contain long content',
                body: 'If all cards expand at once, page height becomes unpredictable. Prefer type="single" to keep height predictable, or limit the number of items in the accordion.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: "Each card's trigger independently reflects its open state",
                body: "Multiple cards can be open simultaneously — screen readers announce each item's aria-expanded state independently, with no ambiguity.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pre-open the most relevant cards on mount with defaultValue',
                body: 'Starting with everything collapsed forces users to expand before seeing any content. Use defaultValue={["item-1"]} to pre-open the most useful cards on first load.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Accordion variant="card" type="multiple">
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
