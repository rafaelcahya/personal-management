import { useState } from 'react'
import { Zap, Shield, Package, Truck, Star, CreditCard, Banknote } from 'lucide-react'
import { SelectCard, SelectCardIcon, SelectCardTitle, SelectCardDescription } from './SelectCard'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/SelectCard',
}

export default meta

// ─── Primitives ──────────────────────────────────────────────────────────────

const Section = ({ title, description, children }) => (
  <div className="mb-12">
    <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
    {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
    <hr className="mb-5 border-gray-200" />
    {children}
  </div>
)

const SubSection = ({ title, description, children }) => (
  <div className="mb-8">
    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">{title}</h3>
    {description && <p className="text-xs text-gray-500 mb-3">{description}</p>}
    {children}
  </div>
)

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto mb-4 leading-relaxed">
    <code>{children}</code>
  </pre>
)

const Tag = ({ children, color = 'gray' }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-600',
    violet: 'bg-violet-100 text-violet-700',
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}

const ApiTable = ({ headers = ['Prop', 'Type', 'Default', 'Description'], rows }) => (
  <div className="mb-6 overflow-x-auto">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-50">
          {headers.map((h) => (
            <th
              key={h}
              className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 text-xs uppercase tracking-wide"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className="even:bg-gray-50">
            {row.map((cell, ci) => (
              <td
                key={ci}
                className={`px-3 py-2 border border-gray-200 text-xs ${
                  ci === 0
                    ? 'font-mono text-violet-700 whitespace-nowrap'
                    : ci === 1
                      ? 'font-mono text-gray-500 max-w-xs'
                      : ci === 2
                        ? 'font-mono text-gray-400 whitespace-nowrap'
                        : 'text-gray-700'
                }`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

// ─── Interactive demos ────────────────────────────────────────────────────────

const PlanDemo = () => {
  const [selected, setSelected] = useState('pro')
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
  return (
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
  )
}

const ShippingDemo = () => {
  const [selected, setSelected] = useState('standard')
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
    <div className="flex flex-col gap-2 max-w-sm">
      {methods.map((m) => (
        <SelectCard
          key={m.value}
          layout="horizontal"
          value={m.value}
          selected={selected === m.value}
          onSelect={setSelected}
        >
          <SelectCardIcon>{m.icon}</SelectCardIcon>
          <SelectCardTitle>{m.title}</SelectCardTitle>
          <SelectCardDescription>{m.description}</SelectCardDescription>
        </SelectCard>
      ))}
    </div>
  )
}

// ─── Story ───────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">SelectCard</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A clickable card for single-option selection. Content is composed via sub-components —{' '}
          <code className="font-mono text-sm">SelectCardIcon</code>,{' '}
          <code className="font-mono text-sm">SelectCardTitle</code>, and{' '}
          <code className="font-mono text-sm">SelectCardDescription</code> — making the card
          flexible for any content layout. Built from scratch with keyboard support and aria-pressed
          accessibility.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <p className="text-sm text-gray-500 mb-4">Click a card to select it.</p>
        <PlanDemo />
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="SelectCard is composed of a root and three optional sub-components."
      >
        <div className="flex flex-col gap-6 mb-6">
          <div>
            <p className="text-xs font-mono text-violet-700 mb-2">layout="vertical"</p>
            <div className="relative w-40 rounded-lg border-2 border-dashed border-violet-300 p-4 flex flex-col gap-2 bg-violet-50/30">
              <div className="absolute top-2 right-2">
                <div className="border-2 border-dashed border-green-400 rounded-full size-5 bg-green-50 flex items-center justify-center">
                  <span className="text-green-600" style={{ fontSize: 8 }}>
                    ●
                  </span>
                </div>
              </div>
              <div className="text-xs font-mono text-violet-500 mb-1" style={{ fontSize: 10 }}>
                SelectCard
              </div>
              <div className="border border-dashed border-amber-400 rounded-md size-9 bg-amber-50 flex items-center justify-center">
                <span className="text-xs font-mono text-amber-600" style={{ fontSize: 9 }}>
                  Icon
                </span>
              </div>
              <div className="border border-dashed border-blue-400 rounded px-2 py-1 bg-blue-50">
                <span className="text-xs font-mono text-blue-600" style={{ fontSize: 9 }}>
                  SelectCardTitle
                </span>
              </div>
              <div className="border border-dashed border-gray-400 rounded px-2 py-1 bg-gray-50">
                <span className="text-xs font-mono text-gray-500" style={{ fontSize: 9 }}>
                  SelectCardDescription
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-violet-700 mb-2">layout="horizontal"</p>
            <div className="relative rounded-lg border-2 border-dashed border-violet-300 p-4 flex items-center gap-4 bg-violet-50/30 w-96">
              <div
                className="text-xs font-mono text-violet-500 absolute -top-3 left-3 bg-white px-1"
                style={{ fontSize: 10 }}
              >
                SelectCard
              </div>
              <div className="border border-dashed border-amber-400 rounded-md size-9 bg-amber-50 flex items-center justify-center shrink-0">
                <span className="text-xs font-mono text-amber-600" style={{ fontSize: 9 }}>
                  Icon
                </span>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="border border-dashed border-blue-400 rounded px-2 py-1 bg-blue-50">
                  <span className="text-xs font-mono text-blue-600" style={{ fontSize: 9 }}>
                    SelectCardTitle
                  </span>
                </div>
                <div className="border border-dashed border-gray-400 rounded px-2 py-1 bg-gray-50">
                  <span className="text-xs font-mono text-gray-500" style={{ fontSize: 9 }}>
                    SelectCardDescription
                  </span>
                </div>
              </div>
              <div className="border-2 border-dashed border-green-400 rounded-full size-5 bg-green-50 flex items-center justify-center shrink-0">
                <span className="text-green-600" style={{ fontSize: 8 }}>
                  ●
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Part', 'Element', 'Description'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 text-xs uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                [
                  'SelectCard',
                  '<div role="button">',
                  'Root. Handles layout, indicator, selected/disabled state, click, and keyboard (Enter/Space). Accepts value, selected, onSelect, layout, indicator, disabled.',
                ],
                [
                  'SelectCardIcon',
                  '<div>',
                  'Icon slot. Background and color shift automatically between gray (unselected) and violet (selected).',
                ],
                [
                  'SelectCardTitle',
                  '<p>',
                  'Primary label. font-medium. Required for accessibility.',
                ],
                [
                  'SelectCardDescription',
                  '<p>',
                  'Supporting text below the title. text-muted-foreground. Optional.',
                ],
                [
                  'Indicator',
                  '<div>',
                  'Auto-rendered by SelectCard via the indicator prop ("badge" | "border"). Not composable.',
                ],
              ].map(([part, el, desc]) => (
                <tr key={part} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                    {part}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
                    {el}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Code>{`import { SelectCard, SelectCardIcon, SelectCardTitle, SelectCardDescription } from '@/components/base/SelectCard/SelectCard'

<SelectCard
  value="pro"
  selected={selected === 'pro'}
  onSelect={(value) => setSelected(value)}
  layout="vertical"
  indicator="badge"
>
  <SelectCardIcon><Zap /></SelectCardIcon>
  <SelectCardTitle>Pro</SelectCardTitle>
  <SelectCardDescription>For growing teams.</SelectCardDescription>
</SelectCard>`}</Code>
      </Section>

      {/* Usage */}
      <Section title="Usage">
        <SubSection title="Layout — Vertical">
          <p className="text-xs text-gray-500 mb-3">
            Icon on top, title and description below. Best for grid layouts like pricing or plan
            selection where cards are equally weighted.
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-lg mb-4">
            {[
              {
                value: 'a',
                icon: <Package className="size-5" />,
                title: 'Starter',
                description: 'For individuals.',
                selected: false,
              },
              {
                value: 'b',
                icon: <Zap className="size-5" />,
                title: 'Pro',
                description: 'For growing teams.',
                selected: true,
              },
              {
                value: 'c',
                icon: <Shield className="size-5" />,
                title: 'Enterprise',
                description: 'Custom scale.',
                selected: false,
              },
            ].map((p) => (
              <SelectCard
                key={p.value}
                layout="vertical"
                indicator="badge"
                value={p.value}
                selected={p.selected}
                onSelect={() => {}}
              >
                <SelectCardIcon>{p.icon}</SelectCardIcon>
                <SelectCardTitle>{p.title}</SelectCardTitle>
                <SelectCardDescription>{p.description}</SelectCardDescription>
              </SelectCard>
            ))}
          </div>
          <Code>{`<div className="grid grid-cols-3 gap-3">
  <SelectCard layout="vertical" value="pro" selected={selected === 'pro'} onSelect={setSelected}>
    <SelectCardIcon><Zap /></SelectCardIcon>
    <SelectCardTitle>Pro</SelectCardTitle>
    <SelectCardDescription>For growing teams.</SelectCardDescription>
  </SelectCard>
</div>`}</Code>
        </SubSection>

        <SubSection title="Layout — Horizontal">
          <p className="text-xs text-gray-500 mb-3">
            Icon on the left, title and description stacked on the right. Best for list layouts like
            shipping or payment methods where cards are in a vertical stack.
          </p>
          <div className="flex flex-col gap-2 max-w-sm mb-4">
            {[
              {
                value: 'a',
                icon: <Package className="size-5" />,
                title: 'Standard delivery',
                description: '3–5 business days · Free',
                selected: false,
              },
              {
                value: 'b',
                icon: <Truck className="size-5" />,
                title: 'Express delivery',
                description: '1–2 business days · Rp 25.000',
                selected: true,
              },
            ].map((o) => (
              <SelectCard
                key={o.value}
                layout="horizontal"
                indicator="badge"
                value={o.value}
                selected={o.selected}
                onSelect={() => {}}
              >
                <SelectCardIcon>{o.icon}</SelectCardIcon>
                <SelectCardTitle>{o.title}</SelectCardTitle>
                <SelectCardDescription>{o.description}</SelectCardDescription>
              </SelectCard>
            ))}
          </div>
          <Code>{`<div className="flex flex-col gap-2">
  <SelectCard layout="horizontal" value="express" selected={selected === 'express'} onSelect={setSelected}>
    <SelectCardIcon><Truck /></SelectCardIcon>
    <SelectCardTitle>Express delivery</SelectCardTitle>
    <SelectCardDescription>1–2 business days · Rp 25.000</SelectCardDescription>
  </SelectCard>
</div>`}</Code>
        </SubSection>

        <SubSection title="Indicator">
          <p className="text-xs text-gray-500 mb-3">
            Two visual styles for showing the selected state. Default is{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">badge</code>.
          </p>
          <div className="flex flex-col gap-6 mb-4">
            {[
              {
                indicator: 'badge',
                desc: 'Circular badge in the corner — outline when unselected, filled when selected. Clear affordance.',
              },
              {
                indicator: 'border',
                desc: 'No indicator element — border and background change color. Cleaner when the selection context is obvious.',
              },
            ].map(({ indicator, desc }) => (
              <div key={indicator}>
                <p className="text-xs font-mono font-medium text-violet-700 mb-1">
                  indicator="{indicator}"
                </p>
                <p className="text-xs text-gray-500 mb-3 max-w-sm">{desc}</p>
                <div className="grid grid-cols-2 gap-3 max-w-xs">
                  {[false, true].map((sel) => (
                    <SelectCard
                      key={String(sel)}
                      indicator={indicator}
                      layout="vertical"
                      value="x"
                      selected={sel}
                      onSelect={() => {}}
                    >
                      <SelectCardIcon>
                        <Zap className="size-5" />
                      </SelectCardIcon>
                      <SelectCardTitle>{sel ? 'Selected' : 'Unselected'}</SelectCardTitle>
                      <SelectCardDescription>Active state</SelectCardDescription>
                    </SelectCard>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Code>{`{/* Badge indicator (default) */}
<SelectCard indicator="badge" value="pro" selected={selected === 'pro'} onSelect={setSelected}>
  ...
</SelectCard>

{/* Border only — no badge element */}
<SelectCard indicator="border" value="card" selected={selected === 'card'} onSelect={setSelected}>
  ...
</SelectCard>`}</Code>
        </SubSection>

        <SubSection title="Disabled">
          <p className="text-xs text-gray-500 mb-3">
            Pass <code className="font-mono bg-gray-100 px-1 rounded">disabled</code> to prevent
            interaction. The card dims and cursor becomes not-allowed. Selected state is preserved
            visually even when disabled.
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-lg mb-4">
            <SelectCard value="a" layout="vertical" selected={false} disabled onSelect={() => {}}>
              <SelectCardIcon>
                <Package className="size-5" />
              </SelectCardIcon>
              <SelectCardTitle>Starter</SelectCardTitle>
              <SelectCardDescription>Disabled unselected</SelectCardDescription>
            </SelectCard>
            <SelectCard value="b" layout="vertical" selected={true} disabled onSelect={() => {}}>
              <SelectCardIcon>
                <Zap className="size-5" />
              </SelectCardIcon>
              <SelectCardTitle>Pro</SelectCardTitle>
              <SelectCardDescription>Disabled selected</SelectCardDescription>
            </SelectCard>
            <SelectCard value="c" layout="vertical" selected={false} onSelect={() => {}}>
              <SelectCardIcon>
                <Shield className="size-5" />
              </SelectCardIcon>
              <SelectCardTitle>Enterprise</SelectCardTitle>
              <SelectCardDescription>Active</SelectCardDescription>
            </SelectCard>
          </div>
          <Code>{`<SelectCard value="starter" disabled selected={false} onSelect={setSelected}>
  ...
</SelectCard>`}</Code>
        </SubSection>

        <SubSection title="Pricing / Plan selection">
          <p className="text-xs text-gray-500 mb-3">
            Vertical layout in a 3-column grid. One card pre-selected as the recommended plan.
          </p>
          <div className="mb-4">
            <PlanDemo />
          </div>
          <Code>{`const [plan, setPlan] = useState('pro')

const plans = [
  { value: 'starter', icon: <Package />, title: 'Starter', description: 'For individuals and small projects.' },
  { value: 'pro',     icon: <Zap />,     title: 'Pro',     description: 'For growing teams and businesses.' },
  { value: 'enterprise', icon: <Shield />, title: 'Enterprise', description: 'Custom scale for large orgs.' },
]

<div className="grid grid-cols-3 gap-3">
  {plans.map((p) => (
    <SelectCard
      key={p.value}
      layout="vertical"
      indicator="badge"
      value={p.value}
      selected={plan === p.value}
      onSelect={setPlan}
    >
      <SelectCardIcon>{p.icon}</SelectCardIcon>
      <SelectCardTitle>{p.title}</SelectCardTitle>
      <SelectCardDescription>{p.description}</SelectCardDescription>
    </SelectCard>
  ))}
</div>`}</Code>
        </SubSection>

        <SubSection title="Shipping / Delivery method">
          <p className="text-xs text-gray-500 mb-3">
            Horizontal layout in a vertical list. Each card shows the delivery option, ETA, and
            price as the description.
          </p>
          <div className="mb-4">
            <ShippingDemo />
          </div>
          <Code>{`const [method, setMethod] = useState('standard')

const methods = [
  { value: 'standard',  icon: <Package />, title: 'Standard delivery',  description: '3–5 business days · Free' },
  { value: 'express',   icon: <Truck />,   title: 'Express delivery',   description: '1–2 business days · Rp 25.000' },
  { value: 'overnight', icon: <Star />,    title: 'Overnight delivery', description: 'Next business day · Rp 75.000' },
]

<div className="flex flex-col gap-2">
  {methods.map((m) => (
    <SelectCard
      key={m.value}
      layout="horizontal"
      indicator="badge"
      value={m.value}
      selected={method === m.value}
      onSelect={setMethod}
    >
      <SelectCardIcon>{m.icon}</SelectCardIcon>
      <SelectCardTitle>{m.title}</SelectCardTitle>
      <SelectCardDescription>{m.description}</SelectCardDescription>
    </SelectCard>
  ))}
</div>`}</Code>
        </SubSection>

        <SubSection title="Payment method — border indicator">
          <p className="text-xs text-gray-500 mb-3">
            Horizontal layout with{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">indicator="border"</code> — no
            badge element, selection shown through border and background only.
          </p>
          <div className="flex flex-col gap-2 max-w-sm mb-4">
            {[
              {
                value: 'card',
                icon: <CreditCard className="size-5" />,
                title: 'Credit / Debit card',
                description: 'Visa, Mastercard, JCB',
                selected: true,
              },
              {
                value: 'transfer',
                icon: <Banknote className="size-5" />,
                title: 'Bank transfer',
                description: 'Manual transfer via ATM or m-banking',
                selected: false,
              },
            ].map((p) => (
              <SelectCard
                key={p.value}
                layout="horizontal"
                indicator="border"
                value={p.value}
                selected={p.selected}
                onSelect={() => {}}
              >
                <SelectCardIcon>{p.icon}</SelectCardIcon>
                <SelectCardTitle>{p.title}</SelectCardTitle>
                <SelectCardDescription>{p.description}</SelectCardDescription>
              </SelectCard>
            ))}
          </div>
          <Code>{`<SelectCard
  layout="horizontal"
  indicator="border"
  value="card"
  selected={payment === 'card'}
  onSelect={setPayment}
>
  <SelectCardIcon><CreditCard /></SelectCardIcon>
  <SelectCardTitle>Credit / Debit card</SelectCardTitle>
  <SelectCardDescription>Visa, Mastercard, JCB</SelectCardDescription>
</SelectCard>`}</Code>
        </SubSection>
      </Section>

      {/* Best Practices */}
      <Section title="Best Practices">
        <div className="flex flex-col gap-8">
          {[
            {
              heading: 'When to use',
              items: [
                {
                  title:
                    'Use SelectCard when each option benefits from a visual icon and supporting description',
                  body: 'Pricing plans, shipping methods, and payment options all have a title plus context. SelectCard surfaces that context directly — no need to expand or hover to understand each choice.',
                },
                {
                  title:
                    'Use vertical layout for grid arrangements, horizontal for list arrangements',
                  body: 'Vertical works well in 2–3 column grids (pricing). Horizontal fits vertical lists (shipping methods) where the label scans left-to-right.',
                },
                {
                  title:
                    'Pre-select a sensible default when one option is clearly the recommended choice',
                  body: 'Leaving all cards unselected forces an extra click with no user benefit. Pre-select the most common plan, the free tier, or the safest default.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: "Don't use SelectCard for text-only options — use RadioGroup",
                  body: 'If the options have no icons or descriptions worth showing, a compact RadioGroup is clearer and takes less space. SelectCard adds visual weight that should be earned.',
                },
                {
                  title: "Don't use SelectCard for 6 or more options — use Select or Combobox",
                  body: 'A dropdown scales better than a row of cards when the option list grows long. More than 5 cards in a row becomes overwhelming.',
                },
                {
                  title: "Don't use SelectCard for multiple selection — use Checkbox Group",
                  body: 'SelectCard is designed for single-select only. Using it for multi-select requires custom state logic that breaks the expected UX of only one card highlighted at a time.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title:
                    'Always provide a SelectCardTitle — it is the accessible label for the card',
                  body: 'SelectCard uses role="button" with aria-pressed. The title text is what screen readers announce when the card receives focus. Icons and descriptions are supplementary.',
                },
                {
                  title: 'Keyboard users can select cards with Enter or Space',
                  body: 'SelectCard handles onKeyDown internally for Enter and Space. No additional keyboard wiring is needed.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: "Don't put long paragraphs in SelectCardDescription",
                  body: 'The description should be one short sentence or a key detail (price, ETA, feature count). If you need more copy, use a tooltip or expandable detail panel instead.',
                },
                {
                  title:
                    "Don't mix SelectCard with RadioGroup or Checkbox for the same selection group",
                  body: 'Mixing component types for the same choice creates inconsistent interaction patterns and confuses users about which control is authoritative.',
                },
              ],
            },
          ].map(({ heading, items }) => (
            <div key={heading}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {heading}
              </p>
              <div className="flex flex-col gap-3">
                {items.map(({ title, body }) => (
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
      </Section>

      {/* API Reference */}
      <Section title="API Reference">
        <SubSection title="SelectCard">
          <ApiTable
            rows={[
              ['value', 'string', '—', 'Identifier passed to onSelect when the card is clicked.'],
              [
                'selected',
                'boolean',
                'false',
                'Whether the card is currently selected. Drives all visual state changes.',
              ],
              [
                'onSelect',
                '(value: string) => void',
                '—',
                'Called when the card is clicked or activated via keyboard. Receives the value prop.',
              ],
              [
                'layout',
                '"vertical" | "horizontal"',
                '"vertical"',
                'Card content layout — vertical stacks content top-to-bottom; horizontal places icon on the left.',
              ],
              [
                'indicator',
                '"badge" | "border"',
                '"badge"',
                'Selection indicator style — badge shows a filled circle; border changes only the card border and background.',
              ],
              [
                'disabled',
                'boolean',
                'false',
                'Prevents interaction and dims the card. Selected state is preserved visually.',
              ],
              ['className', 'string', '—', 'Additional Tailwind classes on the root element.'],
            ]}
          />
        </SubSection>

        <SubSection title="SelectCardIcon">
          <ApiTable
            rows={[
              [
                'children',
                'ReactNode',
                '—',
                'Icon element to render (typically a lucide-react icon at size-5).',
              ],
              [
                'className',
                'string',
                '—',
                'Additional Tailwind classes. Applied alongside the auto-generated selected/unselected color classes.',
              ],
            ]}
          />
        </SubSection>

        <SubSection title="SelectCardTitle">
          <ApiTable
            rows={[
              ['children', 'ReactNode', '—', 'Primary label text. Required for accessibility.'],
              ['className', 'string', '—', 'Additional Tailwind classes.'],
            ]}
          />
        </SubSection>

        <SubSection title="SelectCardDescription">
          <ApiTable
            rows={[
              [
                'children',
                'ReactNode',
                '—',
                'Supporting text below the title. Keep to one short sentence or a key detail.',
              ],
              ['className', 'string', '—', 'Additional Tailwind classes.'],
            ]}
          />
        </SubSection>
      </Section>
    </div>
  ),
}
