import { ScrollArea } from './ScrollArea'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'ScrollArea',
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

const listItems = Array.from({ length: 30 }, (_, i) => `List item ${i + 1}`)

const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`

// ─── Story ────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">ScrollArea</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A scrollable container with a styled custom scrollbar. Wraps content in a clipping outer
          div and a scrollable inner viewport — no Radix dependency, pure CSS.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Use <code className="font-mono text-xs bg-gray-100 px-1 rounded">ScrollArea</code>{' '}
          whenever content overflows a fixed-height container and you need a visually consistent
          scrollbar across browsers. The height is always controlled by the consumer via{' '}
          <code className="font-mono text-xs bg-gray-100 px-1 rounded">className</code>.
        </p>
        <Preview>
          <ScrollArea className="h-40 rounded-md border border-gray-200 p-2">
            <div className="flex flex-col gap-0.5">
              {listItems.slice(0, 20).map((item) => (
                <div
                  key={item}
                  className="px-3 py-1.5 text-sm rounded hover:bg-gray-50 text-gray-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </ScrollArea>
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
                ScrollArea — outer div
              </span>
              <p className="text-[10px] font-mono text-gray-400 mt-1">
                relative overflow-hidden + className
              </p>
              <div className="relative mt-3 p-3 border border-dashed border-violet-300 rounded-xl">
                <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-violet-500">
                  viewport — inner div
                </span>
                <p className="text-[10px] font-mono text-gray-400 mt-1">
                  h-full w-full overflow-y-auto + custom webkit scrollbar
                </p>
                <div className="mt-2 px-2 py-1.5 bg-white border border-gray-200 rounded text-[10px] font-mono text-gray-400">
                  children
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Element', 'data-slot', 'Role'].map((h) => (
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
                ['outer div', 'scroll-area', 'Clips overflow — receives className + all ...props'],
                [
                  'inner div',
                  'scroll-area-viewport',
                  'Scrolls — always h-full w-full overflow-y-auto',
                ],
              ].map(([el, slot, desc]) => (
                <tr key={el} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
                    {el}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400">
                    {slot}
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
          <Code>{`import { ScrollArea } from '@/components/base/ScrollArea/ScrollArea'`}</Code>
        </SubSection>

        <SubSection title="Fixed height list">
          <Preview>
            <ScrollArea className="h-48 rounded-md border border-gray-200 p-2">
              <div className="flex flex-col gap-0.5">
                {listItems.map((item) => (
                  <div
                    key={item}
                    className="px-3 py-1.5 text-sm rounded hover:bg-gray-50 text-gray-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Preview>
          <Code>{`<ScrollArea className="h-48 rounded-md border border-gray-200 p-2">
  {items.map(item => (
    <div key={item} className="px-3 py-1.5 text-sm rounded hover:bg-gray-50">
      {item}
    </div>
  ))}
</ScrollArea>`}</Code>
        </SubSection>

        <SubSection title="Long text / prose">
          <Preview>
            <ScrollArea className="h-36 rounded-md border border-gray-200 p-4">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {longText}
              </p>
            </ScrollArea>
          </Preview>
          <Code>{`<ScrollArea className="h-36 rounded-md border border-gray-200 p-4">
  <p className="text-sm text-gray-700 leading-relaxed">
    {longContent}
  </p>
</ScrollArea>`}</Code>
        </SubSection>

        <SubSection title="Full-height panel (calc)">
          <p className="text-xs text-gray-500 mb-2">
            Use <code className="font-mono bg-gray-100 px-1 rounded">h-[calc(100vh-80px)]</code>{' '}
            when the scroll area should fill the remaining viewport height minus a fixed header.
          </p>
          <Code>{`{/* Sidebar or full-height content panel */}
<ScrollArea className="h-[calc(100vh-80px)]">
  <div className="p-4">
    {/* long content */}
  </div>
</ScrollArea>`}</Code>
        </SubSection>

        <SubSection title="Inside a card with padding">
          <Preview>
            <div className="rounded-lg border border-gray-200 overflow-hidden w-72">
              <div className="px-4 py-3 border-b border-gray-100 text-sm font-semibold text-gray-700">
                Notifications
              </div>
              <ScrollArea className="h-40">
                <div className="flex flex-col divide-y divide-gray-100">
                  {listItems.slice(0, 12).map((item) => (
                    <div key={item} className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
                      {item}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </Preview>
          <Code>{`<div className="rounded-lg border border-gray-200 overflow-hidden">
  <div className="px-4 py-3 border-b border-gray-100 text-sm font-semibold">
    Notifications
  </div>
  <ScrollArea className="h-40">
    <div className="flex flex-col divide-y divide-gray-100">
      {items.map(item => (
        <div key={item} className="px-4 py-2.5 text-sm hover:bg-gray-50">
          {item}
        </div>
      ))}
    </div>
  </ScrollArea>
</div>`}</Code>
        </SubSection>
      </Section>

      {/* Orientation */}
      <Section title="Orientation">
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          The <code className="font-mono text-xs bg-gray-100 px-1 rounded">orientation</code> prop
          controls which axis scrolls. The default is{' '}
          <code className="font-mono text-xs bg-gray-100 px-1 rounded">"vertical"</code>.
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Value', 'Scrolls', 'overflow applied', 'Scrollbar axis'].map((h) => (
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
                ['"vertical"', 'Up / down', 'overflow-y-auto', 'Vertical (width 6px)'],
                ['"horizontal"', 'Left / right', 'overflow-x-auto', 'Horizontal (height 6px)'],
                ['"both"', 'Both axes', 'overflow-auto', 'Both'],
              ].map(([val, axis, overflow, bar]) => (
                <tr key={val} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
                    {val}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{axis}</td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
                    {overflow}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-500">{bar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SubSection title="Horizontal — wide table columns">
          <Preview>
            <ScrollArea
              orientation="horizontal"
              className="w-full rounded-md border border-gray-200 p-2"
            >
              <div className="flex gap-2" style={{ width: 'max-content' }}>
                {Array.from({ length: 16 }, (_, i) => (
                  <div
                    key={i}
                    className="w-28 shrink-0 px-3 py-1.5 text-sm rounded bg-gray-50 text-center text-gray-700"
                  >
                    Column {i + 1}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Preview>
          <Code>{`<ScrollArea orientation="horizontal" className="w-full rounded-md border p-2">
  {/* children must have explicit width so overflow triggers */}
  <div className="flex gap-2" style={{ width: 'max-content' }}>
    {columns.map(col => (
      <div key={col} className="w-28 shrink-0">{col}</div>
    ))}
  </div>
</ScrollArea>`}</Code>
        </SubSection>

        <SubSection title="Both — 2D data grid">
          <Preview>
            <ScrollArea
              orientation="both"
              className="h-40 w-full rounded-md border border-gray-200 p-2"
            >
              <div
                className="flex flex-col gap-1"
                style={{ width: 'max-content', minWidth: '700px' }}
              >
                {Array.from({ length: 15 }, (_, i) => (
                  <div key={i} className="flex gap-4 px-3 py-1.5 text-sm rounded hover:bg-gray-50">
                    <span className="w-24 shrink-0 text-gray-400">Row {i + 1}</span>
                    <span className="w-40 shrink-0">Value A</span>
                    <span className="w-40 shrink-0">Value B</span>
                    <span className="w-32 shrink-0 text-right text-gray-500">100.00</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Preview>
          <Code>{`<ScrollArea orientation="both" className="h-40 w-full rounded-md border p-2">
  <div style={{ width: 'max-content', minWidth: '700px' }}>
    {rows.map(row => <Row key={row.id} {...row} />)}
  </div>
</ScrollArea>`}</Code>
        </SubSection>
      </Section>

      {/* API Reference */}
      <Section title="API Reference">
        <div className="overflow-x-auto mb-4">
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
                  'orientation',
                  '"vertical" | "horizontal" | "both"',
                  '"vertical"',
                  'Controls which axis scrolls and which scrollbar appears.',
                ],
                [
                  'className',
                  'string',
                  '—',
                  'Applied to the outer clipping div. Use this to set height (h-48, h-[calc(...)]), border-radius, border, padding, etc.',
                ],
                ['children', 'ReactNode', '—', 'Content to scroll. Can be any markup.'],
                [
                  '...props',
                  'HTMLAttributes<div>',
                  '—',
                  'All other props are spread onto the outer div (e.g. id, style, aria-*).',
                ],
              ].map(([prop, type, def, desc]) => (
                <tr key={prop} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                    {prop}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500 whitespace-nowrap">
                    {type}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400">
                    {def}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          The inner viewport div is not customizable — it always fills the outer container and
          handles scrolling. Apply layout classes to the children instead of the viewport.
        </p>
      </Section>

      {/* Scrollbar Styling */}
      <Section title="Scrollbar Styling">
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          The scrollbar is styled via Tailwind arbitrary webkit properties — no external CSS needed.
          It renders a narrow (2.5px) rounded thumb against a transparent track.
        </p>
        <Code>{`/* applied to the inner viewport div — do not override these */
[&::-webkit-scrollbar]:w-1.5          /* vertical — 6px wide */
[&::-webkit-scrollbar]:h-1.5          /* horizontal — 6px tall */
[&::-webkit-scrollbar-track]:bg-transparent
[&::-webkit-scrollbar-thumb]:rounded-full
[&::-webkit-scrollbar-thumb]:bg-border`}</Code>
        <p className="text-xs text-gray-400 mt-1">
          Note: <code className="font-mono bg-gray-100 px-1 rounded">bg-border</code> resolves to
          the <code className="font-mono bg-gray-100 px-1 rounded">--border</code> CSS variable, so
          the scrollbar thumb automatically follows the active theme.
        </p>
      </Section>

      {/* When to Use */}
      <Section title="When to Use">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Use ScrollArea when…', 'Consider an alternative when…'].map((h) => (
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
                    <li>A container has a fixed or max height and its content may overflow</li>
                    <li>You need a consistent custom scrollbar appearance across all browsers</li>
                    <li>The content area is inside a card, modal, or sidebar panel</li>
                    <li>
                      You are scrolling a long list, log, or prose block within a bounded region
                    </li>
                  </ul>
                </td>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                  <ul className="flex flex-col gap-1.5">
                    <li>
                      Use native{' '}
                      <code className="font-mono bg-gray-100 px-1 rounded">overflow-y-auto</code>{' '}
                      directly when consistent scrollbar styling is not a requirement and you don't
                      need the outer clipping wrapper
                    </li>
                    <li>
                      Use horizontal scrolling (
                      <code className="font-mono bg-gray-100 px-1 rounded">overflow-x-auto</code>)
                      for wide tables — ScrollArea only scrolls vertically
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
                  Always set a height on the ScrollArea via{' '}
                  <code className="font-mono bg-green-100 px-1 rounded">className</code> (e.g.{' '}
                  <code className="font-mono bg-green-100 px-1 rounded">h-48</code>,{' '}
                  <code className="font-mono bg-green-100 px-1 rounded">h-[calc(100vh-80px)]</code>
                  ). Without a height the outer div has no bounds and nothing will scroll.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Apply padding, border-radius, and border to the ScrollArea className. These style
                  the outer clip container as expected.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Apply layout classes (flex, gap, divide) to the children wrapper inside ScrollArea
                  — not to the ScrollArea itself.
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
                  Don't use ScrollArea without a height — the outer div will expand to fit its
                  content and no scrollbar will appear.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't set{' '}
                  <code className="font-mono bg-red-100 px-1 rounded">overflow-y-auto</code> or{' '}
                  <code className="font-mono bg-red-100 px-1 rounded">overflow-hidden</code>{' '}
                  directly on children — the inner viewport already manages overflow.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't nest ScrollArea inside another ScrollArea — double-nested scroll containers
                  cause confusing UX where it's unclear which container will scroll.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  ),
}
