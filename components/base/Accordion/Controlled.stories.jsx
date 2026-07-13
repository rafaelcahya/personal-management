import { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Accordion/Controlled',
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

export const Controlled = {
  name: 'Controlled',
  render: () => {
    const [open, setOpen] = useState('')

    return (
      <div className="flex flex-col gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
          Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">value</code> and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">onValueChange</code> together
          to take full control of the open state from outside the accordion. The accordion no longer
          manages its own state — you drive it with your own{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">useState</code> or external
          store.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-2xl">
          <div className="flex flex-wrap gap-2">
            {ITEMS.map(({ value, trigger }) => (
              <button
                key={value}
                onClick={() => setOpen(open === value ? '' : value)}
                className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                  open === value
                    ? 'bg-violet-600 border-violet-600 text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {open === value ? 'Close' : 'Open'} {trigger}
              </button>
            ))}
          </div>

          <Accordion type="single" collapsible value={open} onValueChange={setOpen}>
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
                  title: 'Use controlled mode to sync the open state with external state',
                  body: 'URL params, step indicators, sidebar selections, or any state that lives outside the accordion and needs to drive which item is open.',
                },
              ],
            },
            {
              heading: 'When not to use',
              cards: [
                {
                  title: "Don't use controlled mode for local-only open state",
                  body: 'If nothing outside the accordion needs to know which item is open, defaultValue is simpler and avoids managing extra state.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              cards: [
                {
                  title: 'Controlled state changes are reflected in aria-expanded automatically',
                  body: 'No extra ARIA needed. The component reads from value and updates aria-expanded on every render — external and internal triggers are handled the same way.',
                },
              ],
            },
            {
              heading: 'Advice',
              cards: [
                {
                  title: 'Always pair value with onValueChange — never one without the other',
                  body: 'Providing value alone creates a read-only accordion the user cannot interact with. onValueChange is required to allow user-triggered toggling.',
                },
              ],
            },
          ]}
        />

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`const [open, setOpen] = useState('')

<Accordion type="single" collapsible value={open} onValueChange={setOpen}>
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
    )
  },
}
