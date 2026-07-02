import { useState } from 'react'
import { Zap, Shield, Star, Truck, Package, CreditCard, Banknote } from 'lucide-react'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/SelectCard',
}

export default meta

// ─── Mock components (visualization only — replaced by real components after implementation) ──

const cn = (...classes) => classes.filter(Boolean).join(' ')

const MockCard = ({
  layout = 'vertical',
  indicator = 'badge',
  selected = false,
  disabled = false,
  onClick,
  icon,
  title,
  description,
  extra,
}) => {
  const isH = layout === 'horizontal'
  const isBadge = indicator === 'badge'

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={cn(
        'relative rounded-lg transition-all select-none',
        isH
          ? cn('flex items-center gap-4', isBadge && 'pr-12')
          : cn('flex flex-col gap-2.5', isBadge && 'pr-8'),
        selected
          ? 'border border-violet-600 ring-2 ring-violet-200 bg-violet-50/40 p-4'
          : 'border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      )}
    >
      {isBadge && (
        <div
          className={cn(
            'absolute size-5 rounded-full flex items-center justify-center transition-all bg-white',
            isH ? 'right-4 top-1/2 -translate-y-1/2' : 'top-3 right-3',
            selected ? 'bg-violet-600' : 'border-2 border-gray-300'
          )}
        >
          {selected && <span className="size-2 rounded-full bg-white block" />}
        </div>
      )}

      {icon && (
        <div
          className={cn(
            'flex items-center justify-center rounded-md shrink-0',
            isH ? 'size-9' : 'size-9',
            selected ? 'bg-violet-100 text-violet-600' : 'bg-gray-100 text-gray-500'
          )}
        >
          {icon}
        </div>
      )}

      <div className={cn(isH && 'flex-1', 'flex flex-col gap-0.5')}>
        <p
          className={cn(
            'text-sm font-medium leading-snug',
            selected ? 'text-gray-900' : 'text-gray-800'
          )}
        >
          {title}
        </p>
        {description && <p className="text-xs text-muted-foreground leading-snug">{description}</p>}
        {extra && <div className="mt-1">{extra}</div>}
      </div>
    </div>
  )
}

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

// ─── Interactive demo ─────────────────────────────────────────────────────────

const OverviewDemo = () => {
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
    <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
      {plans.map((p) => (
        <MockCard
          key={p.value}
          indicator="badge"
          selected={selected === p.value}
          onClick={() => setSelected(p.value)}
          icon={p.icon}
          title={p.title}
          description={p.description}
        />
      ))}
    </div>
  )
}

const HorizontalDemo = () => {
  const [selected, setSelected] = useState('standard')
  const options = [
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
    <div className="flex flex-col gap-2 w-full max-w-sm">
      {options.map((o) => (
        <MockCard
          key={o.value}
          layout="horizontal"
          indicator="badge"
          selected={selected === o.value}
          onClick={() => setSelected(o.value)}
          icon={o.icon}
          title={o.title}
          description={o.description}
        />
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
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">SelectCardIcon</code>,{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">SelectCardTitle</code>, and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">SelectCardDescription</code>{' '}
          — making the card flexible for any content layout.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <p className="text-sm text-gray-500 mb-4">Click a card to select it.</p>
        <OverviewDemo />
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="SelectCard is composed of a root and three optional sub-components."
      >
        <div className="flex flex-col gap-6 mb-6">
          {/* Vertical anatomy */}
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
              <div className="absolute top-1 right-8 text-green-600" style={{ fontSize: 9 }}>
                <span className="font-mono">indicator</span>
              </div>
            </div>
          </div>

          {/* Horizontal anatomy */}
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
                  '<div>',
                  'Root. Handles layout, indicator, selected/disabled state, and click. Accepts value, selected, onSelect, layout, indicator, disabled.',
                ],
                [
                  'SelectCardIcon',
                  '<div>',
                  'Icon slot. Colors shift automatically based on selected state.',
                ],
                ['SelectCardTitle', '<p>', 'Primary label. font-medium. Required.'],
                [
                  'SelectCardDescription',
                  '<p>',
                  'Supporting text below the title. text-muted. Optional.',
                ],
                [
                  'Indicator',
                  '<div>',
                  'Auto-rendered by SelectCard via the indicator prop ("badge" | "check"). Not composable.',
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

        <Code>{`<SelectCard
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

      {/* Layout */}
      <Section
        title="Layout"
        description="Two layout modes — vertical stacks content top-to-bottom, horizontal places icon on the left and content on the right."
      >
        <SubSection
          title="Vertical (default)"
          description="Icon on top, title and description below. Best for grid layouts like pricing or plan selection."
        >
          <div className="grid grid-cols-3 gap-3 max-w-lg mb-4">
            {[
              {
                value: 'a',
                icon: <Package className="size-5" />,
                title: 'Starter',
                description: 'For individuals.',
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
              },
            ].map((p) => (
              <MockCard
                key={p.value}
                layout="vertical"
                indicator="badge"
                selected={!!p.selected}
                icon={p.icon}
                title={p.title}
                description={p.description}
              />
            ))}
          </div>
          <Code>{`<SelectCard
  layout="vertical"
  indicator="badge"
  value="pro"
  selected={selected === 'pro'}
  onSelect={(value) => setSelected(value)}
>
  <SelectCardIcon><Zap /></SelectCardIcon>
  <SelectCardTitle>Pro</SelectCardTitle>
  <SelectCardDescription>For growing teams.</SelectCardDescription>
</SelectCard>`}</Code>
        </SubSection>

        <SubSection
          title="Horizontal"
          description="Icon on the left, title and description stacked on the right. Best for list layouts like shipping or payment methods."
        >
          <div className="flex flex-col gap-2 max-w-sm mb-4">
            {[
              {
                value: 'a',
                icon: <Package className="size-5" />,
                title: 'Standard delivery',
                description: '3–5 business days · Free',
              },
              {
                value: 'b',
                icon: <Truck className="size-5" />,
                title: 'Express delivery',
                description: '1–2 business days · Rp 25.000',
                selected: true,
              },
            ].map((o) => (
              <MockCard
                key={o.value}
                layout="horizontal"
                indicator="badge"
                selected={!!o.selected}
                icon={o.icon}
                title={o.title}
                description={o.description}
              />
            ))}
          </div>
          <Code>{`<SelectCard
  layout="horizontal"
  indicator="badge"
  value="express"
  selected={selected === 'express'}
  onSelect={(value) => setSelected(value)}
>
  <SelectCardIcon><Truck /></SelectCardIcon>
  <SelectCardTitle>Express delivery</SelectCardTitle>
  <SelectCardDescription>1–2 business days · Rp 25.000</SelectCardDescription>
</SelectCard>`}</Code>
        </SubSection>
      </Section>

      {/* Indicator */}
      <Section title="Indicator" description="Two visual styles for showing the selected state.">
        <div className="flex flex-col gap-6">
          {[
            {
              indicator: 'badge',
              label: 'Badge',
              desc: 'A circular badge in the corner — outline when unselected, filled checkmark when selected. Clear affordance for selection.',
            },
            {
              indicator: 'border',
              label: 'Border',
              desc: 'No indicator element — the border and background change color on selection. Cleaner look when the selection context is obvious.',
            },
          ].map(({ indicator, label, desc }) => (
            <div key={indicator}>
              <div className="flex items-start gap-4 mb-2">
                <div>
                  <p className="text-xs font-mono font-medium text-violet-700 mb-0.5">
                    indicator="{indicator}"
                  </p>
                  <p className="text-xs text-gray-500 max-w-sm">{desc}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 max-w-xs">
                <MockCard
                  indicator={indicator}
                  layout="vertical"
                  selected={false}
                  icon={<Zap className="size-5" />}
                  title="Unselected"
                  description="Default state"
                />
                <MockCard
                  indicator={indicator}
                  layout="vertical"
                  selected={true}
                  icon={<Zap className="size-5" />}
                  title="Selected"
                  description="Active state"
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* States */}
      <Section title="States" description="All states across both layouts.">
        {[
          { layout: 'vertical', label: 'Vertical' },
          { layout: 'horizontal', label: 'Horizontal' },
        ].map(({ layout, label }) => (
          <SubSection key={layout} title={label}>
            <div
              className={
                layout === 'vertical'
                  ? 'grid grid-cols-4 gap-3 max-w-2xl mb-4'
                  : 'flex flex-col gap-2 max-w-sm mb-4'
              }
            >
              {[
                { state: 'Default', selected: false, disabled: false },
                { state: 'Selected', selected: true, disabled: false },
                { state: 'Disabled', selected: false, disabled: true },
                { state: 'Disabled selected', selected: true, disabled: true },
              ].map(({ state, selected, disabled }) => (
                <div key={state} className="flex flex-col gap-1.5">
                  <p className="text-xs text-gray-400 font-mono">{state}</p>
                  <MockCard
                    layout={layout}
                    indicator="badge"
                    selected={selected}
                    disabled={disabled}
                    icon={<Zap className="size-5" />}
                    title="Option label"
                    description="Supporting text"
                  />
                </div>
              ))}
            </div>
          </SubSection>
        ))}
      </Section>

      {/* When to Use */}
      <Section title="When to Use">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Use SelectCard when…', 'Consider an alternative when…'].map((h) => (
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
              <tr>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                  <ul className="flex flex-col gap-1.5">
                    <li>
                      Each option benefits from a visual icon or illustration to convey its meaning
                    </li>
                    <li>
                      Options have a title plus supporting description (e.g. plan name + feature
                      summary)
                    </li>
                    <li>
                      The number of choices is small — typically 2–5 items — and worth giving visual
                      weight
                    </li>
                    <li>
                      You want the selected state to be obvious at a glance (highlighted card, not
                      just a radio dot)
                    </li>
                    <li>
                      Options are laid out in a grid (pricing tiers) or a stacked list (shipping
                      methods, payment methods)
                    </li>
                  </ul>
                </td>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                  <ul className="flex flex-col gap-1.5">
                    <li>
                      Use <strong>RadioGroup</strong> when options are text-only labels with no
                      icons or descriptions — a compact list is clearer and takes less space
                    </li>
                    <li>
                      Use <strong>Select / Combobox</strong> when there are 6+ options — a dropdown
                      scales better than a row of cards
                    </li>
                    <li>
                      Use <strong>Checkbox</strong> when users can pick multiple options
                      simultaneously — SelectCard is single-select only
                    </li>
                    <li>
                      Use <strong>ToggleGroup</strong> when options are very short labels (e.g. "S /
                      M / L") and a button-bar style fits better
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Dos & Don'ts */}
      <Section title="Dos & Don'ts">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="size-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                ✓
              </span>
              <span className="text-sm font-semibold text-green-700">Do</span>
            </div>
            <div className="space-y-3">
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Keep the number of cards small — 2 to 5 options. More than 5 cards in a row
                  becomes overwhelming and defeats the visual clarity SelectCard is meant to
                  provide.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Always provide a{' '}
                  <code className="font-mono bg-green-100 px-0.5 rounded">SelectCardTitle</code> for
                  every card. Icons and descriptions are optional, but a clear label is required so
                  users understand each option without guessing.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Pre-select a sensible default when one option is clearly the most common choice
                  (e.g. the recommended plan or the free shipping tier). Leaving all cards
                  unselected forces an extra click with no user benefit.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="size-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                ✕
              </span>
              <span className="text-sm font-semibold text-red-700">Don't</span>
            </div>
            <div className="space-y-3">
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't mix SelectCard with a separate RadioGroup or Checkbox for the same selection
                  — it creates inconsistent interaction patterns in the same form and confuses users
                  about which control is authoritative.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't put long paragraphs inside{' '}
                  <code className="font-mono bg-red-100 px-0.5 rounded">SelectCardDescription</code>
                  . It should be one short sentence or a key detail (price, ETA, feature count). If
                  you need more copy, use a tooltip or an expandable detail panel instead.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't use SelectCard for multi-select scenarios. The component is designed for
                  single-option selection — using it for multi-select requires custom state logic
                  that breaks the expected UX (only one card highlighted at a time).
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Props */}
      <Section title="Props">
        <SubSection title="SelectCard">
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    'layout',
                    '"vertical" | "horizontal"',
                    '"vertical"',
                    'Visual layout — vertical stacks content, horizontal places icon on the left.',
                  ],
                  [
                    'indicator',
                    '"badge" | "border"',
                    '"badge"',
                    'Selection indicator style — badge shows a checkmark circle, border only changes the card border.',
                  ],
                  ['selected', 'boolean', 'false', 'Whether the card is currently selected.'],
                  [
                    'onSelect',
                    '(value: string) => void',
                    '—',
                    'Called when the card is clicked. Receives the value prop.',
                  ],
                  [
                    'value',
                    'string',
                    '—',
                    'Identifier passed to onSelect — used to track which card is selected in the parent.',
                  ],
                  ['disabled', 'boolean', 'false', 'Prevents interaction and dims the card.'],
                  ['className', 'string', '—', 'Additional CSS classes on the root element.'],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                      {prop}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
                      {type}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
                      {def}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>

        <SubSection title="SelectCardIcon / SelectCardTitle / SelectCardDescription">
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['className', 'string', '—', 'Additional CSS classes.'],
                  ['children', 'ReactNode', '—', 'Content to render inside the sub-component.'],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                      {prop}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
                      {type}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400">
                      {def}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>
      </Section>

      {/* Usage examples */}
      <Section title="Usage Examples" description="Real-world patterns using SelectCard.">
        <SubSection
          title="Pricing / Plan selection"
          description="Vertical layout in a 3-column grid. One card pre-selected."
        >
          <OverviewDemo />
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

        <SubSection
          title="Shipping / Delivery method"
          description="Horizontal layout in a vertical list."
        >
          <HorizontalDemo />
          <Code>{`const [method, setMethod] = useState('standard')

const methods = [
  { value: 'standard', icon: <Package />, title: 'Standard delivery', description: '3–5 business days · Free' },
  { value: 'express',  icon: <Truck />,   title: 'Express delivery',  description: '1–2 business days · Rp 25.000' },
  { value: 'overnight',icon: <Star />,    title: 'Overnight delivery', description: 'Next business day · Rp 75.000' },
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

        <SubSection
          title="Payment method"
          description="Horizontal layout, border indicator — selection shown through border only."
        >
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
              },
            ].map((p) => (
              <MockCard
                key={p.value}
                layout="horizontal"
                indicator="border"
                selected={!!p.selected}
                icon={p.icon}
                title={p.title}
                description={p.description}
              />
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
    </div>
  ),
}
