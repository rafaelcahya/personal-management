import { useState } from 'react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible'
import { ChevronDown, ChevronUp, Calendar, TrendingUp, TrendingDown } from 'lucide-react'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Collapsible',
}

export default meta

// ─── Primitives ───────────────────────────────────────────────────────────────

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

const Preview = ({ children }) => (
  <div className="flex flex-col gap-3 p-5 bg-gray-50 border border-gray-200 rounded-lg mb-3">
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
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}

// ─── Demo helpers ─────────────────────────────────────────────────────────────

function BasicCollapsible({ label, children, className = 'w-72' }) {
  const [open, setOpen] = useState(false)
  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={`${className} border border-gray-200 rounded-lg overflow-hidden`}
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

function MobileSummaryDemo() {
  const [open, setOpen] = useState(false)
  const stats = [
    {
      label: 'Total Events',
      value: 12,
      icon: Calendar,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    { label: 'Bullish', value: 7, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Bearish', value: 5, icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' },
  ]
  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="w-full max-w-xs border border-gray-200 rounded-xl overflow-hidden shadow-sm"
    >
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-50">
              <Calendar className="size-4 text-violet-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Event Summary</p>
              <p className="text-xs text-slate-500">
                <span className="text-green-600">7 Bullish</span>
                <span className="text-slate-400 mx-1">•</span>
                <span className="text-red-600">5 Bearish</span>
              </p>
            </div>
          </div>
          {open ? (
            <ChevronUp className="size-5 text-gray-400" />
          ) : (
            <ChevronDown className="size-5 text-gray-400" />
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 pt-2 pb-4 bg-white border-t border-gray-100">
          <div className="pt-2 grid grid-cols-3 gap-2">
            {stats.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.label} className="p-3 rounded-lg border bg-slate-50/50">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className={`p-1 rounded-md ${s.bg}`}>
                      <Icon className={`size-3 ${s.color}`} />
                    </div>
                  </div>
                  <p className="text-base font-bold">{s.value}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// ─── Story ────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Collapsible</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A controlled expand/collapse container. State lives in the consumer. Animation uses the
          CSS grid height trick — no JavaScript height measurement, no layout thrashing.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          <BasicCollapsible label="Click to expand">
            This content is revealed with a smooth height animation when the trigger is clicked.
          </BasicCollapsible>
        </Preview>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy">
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide block mb-3">
            Structure
          </span>
          <div className="flex flex-col gap-3">
            <div className="relative p-3 border-2 border-dashed border-violet-400 rounded-xl">
              <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
                Collapsible — context root
              </span>
              <p className="text-[10px] font-mono text-gray-400 mt-1">
                provides open + onOpenChange via context
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <div className="px-3 py-2 bg-white border border-violet-200 rounded-lg">
                  <span className="text-[10px] font-mono text-violet-600">CollapsibleTrigger</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    calls onOpenChange(!open) on click — supports asChild
                  </p>
                </div>
                <div className="relative px-3 py-2 bg-white border border-violet-200 rounded-lg">
                  <span className="text-[10px] font-mono text-violet-600">CollapsibleContent</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    grid grid-rows-[0fr] → grid-rows-[1fr] · transition-all duration-200
                  </p>
                  <div className="mt-2 px-2 py-1.5 bg-gray-50 border border-gray-100 rounded text-[10px] font-mono text-gray-400">
                    inner div (overflow-hidden) → children
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Export', 'Element', 'Description'].map((h) => (
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
                  'Collapsible',
                  '<div>',
                  'Root — provides context. Accepts open, onOpenChange, className, id.',
                ],
                [
                  'CollapsibleTrigger',
                  '<button> or asChild',
                  'Calls onOpenChange(!open) on click. asChild merges into child element.',
                ],
                [
                  'CollapsibleContent',
                  '<div> (grid)',
                  'Animated content area. Uses CSS grid-rows trick for height transition.',
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
      </Section>

      {/* Usage */}
      <Section title="Usage">
        <SubSection title="Import">
          <Code>{`import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/base/Collapsible/Collapsible'`}</Code>
        </SubSection>

        <SubSection title="Basic controlled">
          <Code>{`const [open, setOpen] = useState(false)

<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger className="flex items-center gap-2">
    Details
    {open ? <ChevronUp /> : <ChevronDown />}
  </CollapsibleTrigger>
  <CollapsibleContent>
    <p>Hidden content revealed on open.</p>
  </CollapsibleContent>
</Collapsible>`}</Code>
        </SubSection>

        <SubSection title="asChild — custom trigger element">
          <p className="text-xs text-gray-500 mb-3">
            Use <code className="font-mono bg-gray-100 px-1 rounded">asChild</code> to merge the
            click handler into any child element — no extra button wrapper is rendered.
          </p>
          <Code>{`<CollapsibleTrigger asChild>
  <Button variant="ghost" className="w-full justify-between">
    Toggle
    {open ? <ChevronUp /> : <ChevronDown />}
  </Button>
</CollapsibleTrigger>`}</Code>
        </SubSection>

        <SubSection title="Mobile summary card (real-world pattern)">
          <p className="text-xs text-gray-500 mb-3">
            The pattern used in EventListSummary and TradeListSummary — always-visible header,
            expandable stats grid on mobile.
          </p>
          <Preview>
            <MobileSummaryDemo />
          </Preview>
          <Code>{`<Collapsible open={isOpen} onOpenChange={setIsOpen} className="sm:hidden">
  <Card className="py-2">
    <CardContent className="px-0">
      <CollapsibleTrigger asChild>
        <Button id="eventSummaryCollapsibleTrigger_eventPage" variant="ghost"
          className="w-full flex items-center justify-between">
          {/* always-visible header content */}
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent id="eventSummaryCollapsibleContent_eventPage" className="px-4 pt-2">
        <div className="pt-2 grid grid-cols-2 gap-3">
          {stats.map(stat => <StatCard key={stat.id} {...stat} />)}
        </div>
      </CollapsibleContent>
    </CardContent>
  </Card>
</Collapsible>`}</Code>
        </SubSection>
      </Section>

      {/* Animation */}
      <Section title="Animation">
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Height animation is achieved with the CSS grid trick — no JavaScript{' '}
          <code className="font-mono text-xs bg-gray-100 px-1 rounded">getBoundingClientRect</code>{' '}
          or inline style calculation needed.
        </p>
        <Code>{`{/* CollapsibleContent internal structure */}
<div
  className={cn(
    'grid transition-all duration-200 ease-in-out',
    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
  )}
>
  {/* overflow-hidden is required for the grid trick */}
  <div className="overflow-hidden">{children}</div>
</div>`}</Code>
        <p className="text-xs text-gray-400">
          The outer div transitions between{' '}
          <code className="font-mono bg-gray-100 px-1 rounded">grid-rows-[0fr]</code> (height = 0)
          and <code className="font-mono bg-gray-100 px-1 rounded">grid-rows-[1fr]</code> (height =
          natural content size). The inner{' '}
          <code className="font-mono bg-gray-100 px-1 rounded">overflow-hidden</code> clips content
          during the transition so nothing bleeds out.
        </p>
      </Section>

      {/* API Reference */}
      <Section title="API Reference">
        <SubSection title="Collapsible" description="Root context provider.">
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Prop', 'Type', 'Default', 'Description'].map((h) => (
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
                    'open',
                    'boolean',
                    '—',
                    'Controlled open state. Must be paired with onOpenChange.',
                  ],
                  [
                    'onOpenChange',
                    '(open: boolean) => void',
                    '—',
                    'Called when trigger is clicked with the next open value.',
                  ],
                  ['className', 'string', '—', 'Applied to the root div.'],
                  [
                    'id',
                    'string',
                    '—',
                    'Applied to the root div. Used for Cypress test targeting.',
                  ],
                  [
                    'children',
                    'ReactNode',
                    '—',
                    'CollapsibleTrigger + CollapsibleContent (and any other markup).',
                  ],
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

        <SubSection title="CollapsibleTrigger" description="Toggles open state on click.">
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Prop', 'Type', 'Default', 'Description'].map((h) => (
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
                    'asChild',
                    'boolean',
                    'false',
                    'Merges click handler into child element instead of rendering a <button>.',
                  ],
                  [
                    'className',
                    'string',
                    '—',
                    'Applied to the trigger button (ignored when asChild).',
                  ],
                  [
                    'children',
                    'ReactNode',
                    '—',
                    'Trigger content — typically label + chevron icon.',
                  ],
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

        <SubSection title="CollapsibleContent" description="Animated content area.">
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Prop', 'Type', 'Default', 'Description'].map((h) => (
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
                    'id',
                    'string',
                    '—',
                    'Applied to the outer grid div. Used for Cypress test targeting.',
                  ],
                  [
                    'className',
                    'string',
                    '—',
                    'Additional classes on the outer grid div (e.g. padding).',
                  ],
                  [
                    'children',
                    'ReactNode',
                    '—',
                    'Content to reveal. Placed inside an overflow-hidden inner div.',
                  ],
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
                  Keep state in the parent — pass{' '}
                  <code className="font-mono bg-green-100 px-1 rounded">open</code> and{' '}
                  <code className="font-mono bg-green-100 px-1 rounded">onOpenChange</code> from a{' '}
                  <code className="font-mono bg-green-100 px-1 rounded">useState</code> hook. This
                  makes the open state accessible for conditional rendering elsewhere in the same
                  component.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Use <code className="font-mono bg-green-100 px-1 rounded">asChild</code> when the
                  trigger should be a styled button or any other existing component — it avoids
                  nesting a button inside a button.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Always pass <code className="font-mono bg-green-100 px-1 rounded">id</code> on
                  Collapsible and CollapsibleContent when the component needs to be targeted by
                  Cypress tests.
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
                  Don't put{' '}
                  <code className="font-mono bg-red-100 px-1 rounded">overflow-hidden</code> on
                  CollapsibleContent's{' '}
                  <code className="font-mono bg-red-100 px-1 rounded">className</code> — that outer
                  div already handles the grid transition. The internal{' '}
                  <code className="font-mono bg-red-100 px-1 rounded">overflow-hidden</code> on the
                  inner div is what clips during animation.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't use Collapsible for multi-item accordion behavior — use the{' '}
                  <code className="font-mono bg-red-100 px-1 rounded">Accordion</code> base
                  component instead, which handles exclusive open state across items.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't nest a{' '}
                  <code className="font-mono bg-red-100 px-1 rounded">&lt;button&gt;</code> directly
                  inside{' '}
                  <code className="font-mono bg-red-100 px-1 rounded">CollapsibleTrigger</code>{' '}
                  without <code className="font-mono bg-red-100 px-1 rounded">asChild</code> — it
                  renders its own{' '}
                  <code className="font-mono bg-red-100 px-1 rounded">&lt;button&gt;</code> which
                  would create invalid nested interactive elements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  ),
}
