import { useState } from 'react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible'
import { ChevronDown, ChevronUp } from 'lucide-react'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Collapsible/Basic',
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

function Demo({ label, children }) {
  const [open, setOpen] = useState(false)
  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="w-72 border border-gray-200 rounded-lg overflow-hidden"
    >
      <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium bg-white hover:bg-gray-50 transition-colors">
        {label}
        {open ? (
          <ChevronUp className="size-4 text-gray-400" />
        ) : (
          <ChevronDown className="size-4 text-gray-400" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 py-3 text-sm text-gray-600 bg-gray-50 border-t border-gray-100">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">Collapsible</code> is a
        controlled expand/collapse container. State lives in the consumer — pass{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">open</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onOpenChange</code> from a{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">useState</code> hook. Animation
        uses the CSS grid height trick — no JavaScript height measurement.
      </p>

      <Demo label="What is a collapsible?">
        A collapsible reveals or hides content when the trigger is clicked. The animation uses a CSS
        grid height trick — no JavaScript height measurement.
      </Demo>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use Collapsible for a single toggleable panel',
                body: 'Filter sections, "show more" details, mobile summary rows — anywhere you need a smooth height animation for one panel without reaching for a third-party library.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use Collapsible for multiple mutually-exclusive panels",
                body: 'Use Accordion instead — it manages exclusive open state across items. Collapsible is for a single panel.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'CollapsibleTrigger renders aria-expanded automatically',
                body: 'Screen readers announce open/closed state without extra work. No need to add aria-expanded manually to the trigger.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep state in the parent with useState',
                body: 'Passing open and onOpenChange from a useState hook makes the open state accessible for conditional rendering elsewhere in the same component.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`const [open, setOpen] = useState(false)

<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger className="flex items-center justify-between">
    Details
    {open ? <ChevronUp /> : <ChevronDown />}
  </CollapsibleTrigger>
  <CollapsibleContent>
    Hidden content revealed on open
  </CollapsibleContent>
</Collapsible>`}</code>
      </pre>
    </div>
  ),
}

export const AsChild = {
  name: 'asChild trigger',
  render: () => {
    function AsChildDemo() {
      const [open, setOpen] = useState(false)
      return (
        <Collapsible
          open={open}
          onOpenChange={setOpen}
          className="w-72 border border-gray-200 rounded-lg overflow-hidden"
        >
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-colors">
              Custom Trigger Button
              {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 py-3 text-sm text-gray-600 bg-gray-50 border-t border-gray-100">
              The trigger is a fully custom element — styles, icons, anything goes.
            </div>
          </CollapsibleContent>
        </Collapsible>
      )
    }
    return (
      <div className="flex flex-col gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">asChild</code> merges the
          click handler and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">aria-expanded</code> into the
          child element — no extra{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">&lt;button&gt;</code> wrapper
          is rendered.
        </p>

        <AsChildDemo />

        <BestPractices
          items={[
            {
              heading: 'When to use',
              cards: [
                {
                  title: 'Use asChild when the trigger already exists as a styled element',
                  body: 'Card header rows, list items, custom buttons — asChild merges the click handler in and avoids nesting a <button> inside another interactive element.',
                },
              ],
            },
            {
              heading: 'When not to use',
              cards: [
                {
                  title: "Don't merge asChild into a non-interactive element like a <div>",
                  body: "Merging into a <div> breaks keyboard navigation and screen reader behavior. The child must be a <button> or an element with role='button'.",
                },
              ],
            },
            {
              heading: 'Accessibility',
              cards: [
                {
                  title: 'aria-expanded is applied to the child automatically',
                  body: "You don't need to add aria-expanded manually — CollapsibleTrigger applies it to the child element when using asChild.",
                },
              ],
            },
            {
              heading: 'Advice',
              cards: [
                {
                  title: 'Include a chevron icon in the trigger that swaps based on open state',
                  body: 'ChevronDown/ChevronUp is the clearest visual affordance that more content exists. Swap it based on the open state for instant visual feedback.',
                },
              ],
            },
          ]}
        />

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`<CollapsibleTrigger asChild>
  <button className="w-full flex items-center justify-between px-4 py-3">
    Custom Trigger
    {open ? <ChevronUp /> : <ChevronDown />}
  </button>
</CollapsibleTrigger>`}</code>
        </pre>
      </div>
    )
  },
}
