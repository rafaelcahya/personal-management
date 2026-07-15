import { ScrollArea } from './ScrollArea'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'ScrollArea' }
export default meta

// ─── Primitives ───────────────────────────────────────────────────────────────

const Section = ({ title, children }) => (
  <section className="flex flex-col gap-4">
    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">{title}</h2>
    {children}
  </section>
)

const SubSection = ({ title, children }) => (
  <div className="flex flex-col gap-3">
    <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
    {children}
  </div>
)

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
    <code>{children}</code>
  </pre>
)

const Tag = ({ children }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-100 text-violet-700 w-max">
    {children}
  </span>
)

const ApiTable = ({ rows }) => (
  <table className="w-full text-sm border-collapse">
    <thead>
      <tr className="border-b">
        <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-36">
          Prop
        </th>
        <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-64">
          Type
        </th>
        <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-24">
          Default
        </th>
        <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
          Description
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      {rows.map(([prop, type, def, desc]) => (
        <tr key={prop}>
          <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">{prop}</td>
          <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">{type}</td>
          <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">{def}</td>
          <td className="py-2.5 text-xs text-gray-600">{desc}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

// ─── Data ─────────────────────────────────────────────────────────────────────

const listItems = Array.from({ length: 30 }, (_, i) => `List item ${i + 1}`)

// ─── Docs ─────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-3xl py-6 px-2">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Tag>Base Component</Tag>
        <h1 className="text-3xl font-bold text-gray-900">ScrollArea</h1>
        <p className="text-base text-gray-500 leading-relaxed">
          A scrollable container with a styled custom scrollbar. Wraps content in a clipping outer
          div and a scrollable inner viewport — no Radix dependency, pure CSS webkit scrollbar
          styling via Tailwind.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <ScrollArea className="h-40 rounded-md border border-gray-200 p-2">
            <div className="flex flex-col gap-0.5">
              {listItems.slice(0, 20).map((item) => (
                <div
                  key={item}
                  className="px-3 py-1.5 text-sm rounded hover:bg-white text-gray-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <Code>{`import { ScrollArea } from '@/components/base/ScrollArea/ScrollArea'

<ScrollArea className="h-48 rounded-md border border-gray-200 p-2">
  {items.map(item => (
    <div key={item} className="px-3 py-1.5 text-sm">{item}</div>
  ))}
</ScrollArea>`}</Code>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy">
        <div className="flex flex-col gap-6">
          {/* Visual box */}
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-3 font-mono text-xs text-gray-600">
            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              ScrollArea (outer div — clipping + className)
            </span>
            <div className="pl-4 border-l-2 border-gray-200">
              <div className="relative border-2 border-dashed border-violet-300 rounded-lg p-3">
                <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-semibold text-violet-600">
                  outer div · data-slot=&quot;scroll-area&quot;
                </span>
                <p className="text-[10px] text-gray-400 mb-3 mt-1">
                  relative overflow-hidden + className (sets height, border, padding)
                </p>
                <div className="relative border border-dashed border-violet-200 rounded-lg p-3">
                  <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] text-violet-500">
                    inner div · data-slot=&quot;scroll-area-viewport&quot;
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1 mb-2">
                    h-full w-full overflow-y-auto + webkit scrollbar styles
                  </p>
                  <div className="bg-white border border-gray-200 rounded px-2 py-1.5 text-[10px] text-gray-400">
                    children
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code tree */}
          <Code>{`<ScrollArea className="h-48 ...">   ← outer div — clips overflow, receives all props
  {/* inner viewport div — always h-full w-full overflow-y-auto */}
  {children}
</ScrollArea>`}</Code>

          {/* Parts table */}
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-48">
                  Element
                </th>
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-52">
                  data-slot
                </th>
                <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                [
                  'outer div',
                  'scroll-area',
                  'Clips overflow. Receives className, id, style, and all other props.',
                ],
                [
                  'inner div',
                  'scroll-area-viewport',
                  'Scrolls. Always h-full w-full. Overflow axis set by orientation prop.',
                ],
              ].map(([el, slot, desc]) => (
                <tr key={el}>
                  <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">{el}</td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">{slot}</td>
                  <td className="py-2.5 text-xs text-gray-600">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Orientation */}
      <Section title="Orientation">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
          The <code className="font-mono bg-gray-100 px-1 rounded text-xs">orientation</code> prop
          controls which axis scrolls and which scrollbar appears. Defaults to{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">&quot;vertical&quot;</code>.
        </p>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-28">
                Value
              </th>
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-28">
                Scrolls
              </th>
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-36">
                overflow applied
              </th>
              <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                Scrollbar
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              ['"vertical"', 'Up / down', 'overflow-y-auto', 'Vertical — 6px wide thumb'],
              ['"horizontal"', 'Left / right', 'overflow-x-auto', 'Horizontal — 6px tall thumb'],
              ['"both"', 'Both axes', 'overflow-auto', 'Both axes'],
            ].map(([val, axis, overflow, bar]) => (
              <tr key={val}>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">{val}</td>
                <td className="py-2.5 pr-4 text-xs text-gray-600">{axis}</td>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">{overflow}</td>
                <td className="py-2.5 text-xs text-gray-600">{bar}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <SubSection title="Common patterns">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-gray-400">fixed height list — vertical (default)</span>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <ScrollArea className="h-36 rounded-md border border-gray-200 p-2">
                  <div className="flex flex-col gap-0.5">
                    {listItems.slice(0, 15).map((item) => (
                      <div
                        key={item}
                        className="px-3 py-1.5 text-sm rounded hover:bg-white text-gray-700"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs text-gray-400">wide content — horizontal</span>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <ScrollArea
                  orientation="horizontal"
                  className="w-full rounded-md border border-gray-200 p-2"
                >
                  <div className="flex gap-2" style={{ width: 'max-content' }}>
                    {Array.from({ length: 16 }, (_, i) => (
                      <div
                        key={i}
                        className="w-28 shrink-0 px-3 py-1.5 text-sm rounded bg-gray-100 text-center text-gray-700"
                      >
                        Column {i + 1}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs text-gray-400">full height minus header — calc</span>
              <Code>{`{/* fills remaining viewport height after a fixed 64px header */}
<ScrollArea className="h-[calc(100vh-64px)]">
  <div className="p-4">{/* long content */}</div>
</ScrollArea>`}</Code>
            </div>
          </div>
        </SubSection>
      </Section>

      {/* Scrollbar Styling */}
      <Section title="Scrollbar Styling">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
          The scrollbar is styled via Tailwind webkit arbitrary properties on the inner viewport
          div. The thumb color uses{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">bg-border</code> — the{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">--border</code> CSS variable
          — so it follows the active theme automatically.
        </p>
        <Code>{`/* applied to the inner viewport — do not override these on children */
[&::-webkit-scrollbar]:w-1.5           /* vertical — 6px wide */
[&::-webkit-scrollbar]:h-1.5           /* horizontal — 6px tall */
[&::-webkit-scrollbar-track]:bg-transparent
[&::-webkit-scrollbar-thumb]:rounded-full
[&::-webkit-scrollbar-thumb]:bg-border  /* follows --border CSS variable */`}</Code>
      </Section>

      {/* Best Practices */}
      <Section title="Best Practices">
        <div className="flex flex-col gap-8">
          {[
            {
              heading: 'When to use',
              items: [
                {
                  title: 'Fixed-height containers with overflowing content',
                  body: 'Use ScrollArea when a container has a fixed or max height and its content may overflow — lists, logs, prose, notification panels, or any bounded region like a card, modal, sidebar, or drawer.',
                },
                {
                  title: 'Consistent custom scrollbar without external CSS',
                  body: 'Use when you need a styled scrollbar that looks the same across browsers without adding external CSS or a Radix dependency. The thumb follows the active theme via --border automatically.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: 'No custom scrollbar needed — use overflow-y-auto directly',
                  body: "If you don't need a styled scrollbar, apply overflow-y-auto on a plain div and skip the extra wrapper. ScrollArea adds DOM nodes for a visual feature you aren't using.",
                },
                {
                  title: 'No fixed height set — nothing will scroll',
                  body: 'Without a height on the outer div, ScrollArea expands to fit its content and never shows a scrollbar. Always set h-48, h-full, or h-[calc(...)] via className.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'Add aria-label when the scroll region needs a label',
                  body: 'ScrollArea spreads all div props onto the outer element. Pass aria-label="..." when screen readers need to distinguish this scroll region from others on the page.',
                },
                {
                  title: "Don't nest ScrollArea inside another ScrollArea",
                  body: 'Double-nested scroll containers confuse users — wheel input may scroll the wrong layer. If content needs to scroll inside a scrollable panel, reconsider the layout.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: 'Set height on ScrollArea, layout classes on the children wrapper',
                  body: 'Apply h-*, border, padding, and border-radius to ScrollArea className — these style the outer clipping div. Apply flex, gap, and divide to a wrapper div inside children — the inner viewport is always h-full w-full.',
                },
                {
                  title: 'For horizontal and both: children must be wider than the container',
                  body: "Overflow only triggers when the children are wider than the ScrollArea. Use style={{ width: 'max-content' }} on the wrapper and shrink-0 on each child item. For orientation='both', set both a height and a wider-than-container child width.",
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
        <SubSection title="ScrollArea">
          <ApiTable
            rows={[
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
                'Applied to the outer clipping div. Use to set height, border-radius, border, padding.',
              ],
              ['children', 'ReactNode', '—', 'Content to scroll. Can be any markup.'],
              [
                '...props',
                'HTMLAttributes<div>',
                '—',
                'Spread onto the outer div — e.g. id, style, aria-label.',
              ],
            ]}
          />
          <p className="text-xs text-gray-400 mt-2">
            The inner viewport div is not exposed — it always fills the outer container and handles
            scrolling. Apply layout classes to children, not to the viewport.
          </p>
        </SubSection>
      </Section>
    </div>
  ),
}
