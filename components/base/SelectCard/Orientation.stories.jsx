import { useState } from 'react'
import { Zap, Shield, Package, Truck, Star } from 'lucide-react'
import { SelectCard, SelectCardIcon, SelectCardTitle, SelectCardDescription } from './SelectCard'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/SelectCard/Orientation',
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

export const Orientation = {
  name: 'Orientation',
  render: () => {
    const [verticalSelected, setVerticalSelected] = useState('pro')
    const [horizontalSelected, setHorizontalSelected] = useState('express')

    const plans = [
      {
        value: 'starter',
        icon: <Package className="size-5" />,
        title: 'Starter',
        description: 'For individuals.',
      },
      {
        value: 'pro',
        icon: <Zap className="size-5" />,
        title: 'Pro',
        description: 'For growing teams.',
      },
      {
        value: 'enterprise',
        icon: <Shield className="size-5" />,
        title: 'Enterprise',
        description: 'Custom scale.',
      },
    ]

    const methods = [
      {
        value: 'standard',
        icon: <Package className="size-5" />,
        title: 'Standard delivery',
        description: '3–5 business days · Free',
      },
      {
        value: 'express',
        icon: <Truck className="size-5" />,
        title: 'Express delivery',
        description: '1–2 business days · Rp 25.000',
      },
      {
        value: 'overnight',
        icon: <Star className="size-5" />,
        title: 'Overnight delivery',
        description: 'Next business day · Rp 75.000',
      },
    ]

    return (
      <div className="flex flex-col gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
          Two layout orientations controlled by the{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">layout</code> prop. Default
          is <code className="font-mono bg-gray-100 px-1 rounded text-xs">vertical</code>.
        </p>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">
            layout="vertical" — icon on top, grid layout
          </span>
          <div className="grid grid-cols-3 gap-3 max-w-lg">
            {plans.map((p) => (
              <SelectCard
                key={p.value}
                layout="vertical"
                value={p.value}
                selected={verticalSelected === p.value}
                onSelect={setVerticalSelected}
              >
                <SelectCardIcon>{p.icon}</SelectCardIcon>
                <SelectCardTitle>{p.title}</SelectCardTitle>
                <SelectCardDescription>{p.description}</SelectCardDescription>
              </SelectCard>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">
            layout="horizontal" — icon on left, list layout
          </span>
          <div className="flex flex-col gap-2 max-w-sm">
            {methods.map((m) => (
              <SelectCard
                key={m.value}
                layout="horizontal"
                value={m.value}
                selected={horizontalSelected === m.value}
                onSelect={setHorizontalSelected}
              >
                <SelectCardIcon>{m.icon}</SelectCardIcon>
                <SelectCardTitle>{m.title}</SelectCardTitle>
                <SelectCardDescription>{m.description}</SelectCardDescription>
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
                  title: 'Use vertical layout for grid arrangements like pricing or plan selection',
                  body: 'Icon on top, title and description below. Works well in 2–3 column grids where cards are equally weighted and the layout is symmetrical.',
                },
                {
                  title:
                    'Use horizontal layout for list arrangements like shipping or payment methods',
                  body: 'Icon on the left, title and description stacked on the right. Scans naturally in a vertical list and fits narrower containers like form sidebars.',
                },
              ],
            },
            {
              heading: 'Advice',
              cards: [
                {
                  title: "Don't mix vertical and horizontal cards in the same selection group",
                  body: 'Mixing layouts in a single group creates visual inconsistency and makes it harder for users to compare options. Pick one layout per group.',
                },
                {
                  title: 'Prefer horizontal layout when descriptions are longer than 5 words',
                  body: 'Vertical cards have less horizontal space for description text. If the description is a full sentence, horizontal layout gives it room to breathe.',
                },
              ],
            },
          ]}
        />

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`{/* Vertical — default */}
<SelectCard layout="vertical" value="pro" selected={selected === 'pro'} onSelect={setSelected}>
  <SelectCardIcon><Zap /></SelectCardIcon>
  <SelectCardTitle>Pro</SelectCardTitle>
  <SelectCardDescription>For growing teams.</SelectCardDescription>
</SelectCard>

{/* Horizontal */}
<SelectCard layout="horizontal" value="express" selected={selected === 'express'} onSelect={setSelected}>
  <SelectCardIcon><Truck /></SelectCardIcon>
  <SelectCardTitle>Express delivery</SelectCardTitle>
  <SelectCardDescription>1–2 business days · Rp 25.000</SelectCardDescription>
</SelectCard>`}</code>
        </pre>
      </div>
    )
  },
}
