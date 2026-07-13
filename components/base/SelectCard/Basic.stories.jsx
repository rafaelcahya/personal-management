import { useState } from 'react'
import { Zap, Shield, Package } from 'lucide-react'
import { SelectCard, SelectCardIcon, SelectCardTitle, SelectCardDescription } from './SelectCard'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/SelectCard/Basic',
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

const plans = [
  {
    value: 'starter',
    icon: <Package className="size-5" />,
    title: 'Starter',
    description: 'For individuals and small projects.',
  },
  {
    value: 'pro',
    icon: <Zap className="size-5" />,
    title: 'Pro',
    description: 'For growing teams and businesses.',
  },
  {
    value: 'enterprise',
    icon: <Shield className="size-5" />,
    title: 'Enterprise',
    description: 'Custom scale for large orgs.',
  },
]

export const Basic = {
  name: 'Basic',
  render: () => {
    const [selected, setSelected] = useState('pro')
    return (
      <div className="flex flex-col gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
          Default layout is{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">vertical</code> with a{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">badge</code> indicator.
          Manage selection state in the parent — pass{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">selected</code> and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">onSelect</code> to each card.
          Click a card to select it.
        </p>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">vertical grid — badge indicator</span>
          <div className="grid grid-cols-3 gap-3 max-w-lg">
            {plans.map((p) => (
              <SelectCard
                key={p.value}
                value={p.value}
                selected={selected === p.value}
                onSelect={setSelected}
              >
                <SelectCardIcon>{p.icon}</SelectCardIcon>
                <SelectCardTitle>{p.title}</SelectCardTitle>
                <SelectCardDescription>{p.description}</SelectCardDescription>
              </SelectCard>
            ))}
          </div>
        </div>

        <BestPractices
          items={[
            {
              heading: 'When to use',
              cards: [
                {
                  title:
                    'Use SelectCard when each option benefits from a visual icon and supporting description',
                  body: 'Pricing plans, shipping methods, and payment options all have a title plus context (features, ETA, details). SelectCard surfaces that context directly — no need to expand or hover.',
                },
                {
                  title: 'Keep the number of cards small — 2 to 5 options',
                  body: 'SelectCard gives each option visual weight. More than 5 cards in a row becomes overwhelming and defeats the clarity the component is meant to provide.',
                },
              ],
            },
            {
              heading: 'When not to use',
              cards: [
                {
                  title: "Don't use SelectCard for text-only options — use RadioGroup instead",
                  body: 'If the options have no icons or descriptions worth showing, a compact RadioGroup is clearer and takes less space.',
                },
                {
                  title: "Don't use SelectCard for 6 or more options — use Select or Combobox",
                  body: 'A dropdown scales better than a row of cards when the option list grows long.',
                },
              ],
            },
            {
              heading: 'Advice',
              cards: [
                {
                  title:
                    'Pre-select a sensible default when one option is clearly the recommended choice',
                  body: 'Leaving all cards unselected forces an extra click with no user benefit. Pre-select the most common plan, the free shipping tier, or the safest default.',
                },
              ],
            },
          ]}
        />

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`const [selected, setSelected] = useState('pro')

<div className="grid grid-cols-3 gap-3">
  {plans.map((p) => (
    <SelectCard
      key={p.value}
      value={p.value}
      selected={selected === p.value}
      onSelect={setSelected}
    >
      <SelectCardIcon>{p.icon}</SelectCardIcon>
      <SelectCardTitle>{p.title}</SelectCardTitle>
      <SelectCardDescription>{p.description}</SelectCardDescription>
    </SelectCard>
  ))}
</div>`}</code>
        </pre>
      </div>
    )
  },
}
