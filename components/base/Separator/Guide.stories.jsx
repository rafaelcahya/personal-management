import { Separator } from './Separator'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Separator' }
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
        <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-32">
          Prop
        </th>
        <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-52">
          Type
        </th>
        <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-28">
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

// ─── Docs ─────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-3xl py-6 px-2">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Tag>Base Component</Tag>
        <h1 className="text-3xl font-bold text-gray-900">Separator</h1>
        <p className="text-base text-gray-500 leading-relaxed">
          A lightweight visual divider. Supports horizontal and vertical orientations, three line
          styles (solid, dashed, dotted), and an optional centered label. Built from scratch — no
          Radix dependency.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-4">
          <p className="text-sm text-gray-600">Section A</p>
          <Separator />
          <p className="text-sm text-gray-600">Section B</p>
          <Separator label="or" variant="dashed" />
          <p className="text-sm text-gray-600">Section C</p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Left</span>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm text-gray-600">Right</span>
          </div>
        </div>
        <Code>{`import { Separator } from '@/components/base/Separator/Separator'

<Separator />
<Separator label="or" variant="dashed" />
<Separator orientation="vertical" className="h-5" />`}</Code>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy">
        <div className="flex flex-col gap-6">
          {/* Visual box */}
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-4 font-mono text-xs text-gray-600">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-gray-400">
                Without label
              </span>
              <div className="pl-4 border-l-2 border-gray-200">
                <div className="inline-flex items-center gap-2 px-2 py-1 bg-white border border-dashed border-violet-300 rounded text-[10px] text-gray-500">
                  <span className="text-violet-600 font-semibold">div</span>
                  role=&quot;separator&quot; aria-orientation=&quot;horizontal&quot;
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-gray-400">
                With label
              </span>
              <div className="pl-4 border-l-2 border-gray-200 flex flex-col gap-1">
                <div className="inline-flex items-center gap-2 px-2 py-1 bg-white border border-dashed border-violet-300 rounded text-[10px] text-gray-500">
                  <span className="text-violet-600 font-semibold">div</span>
                  role=&quot;separator&quot; — flex container
                </div>
                <div className="pl-4 border-l-2 border-violet-200 flex flex-col gap-1">
                  <div className="text-[10px] text-gray-400 px-2 py-0.5">
                    div — left line (flex-1)
                  </div>
                  <div className="text-[10px] text-gray-400 px-2 py-0.5">
                    span — label text (shrink-0)
                  </div>
                  <div className="text-[10px] text-gray-400 px-2 py-0.5">
                    div — right line (flex-1)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code tree */}
          <Code>{`{/* without label — single div */}
<div role="separator" aria-orientation="horizontal" />

{/* with label — three-part flex row */}
<div role="separator" aria-orientation="horizontal" className="flex items-center gap-3">
  <div className="flex-1 border-t border-current" />   ← left line
  <span className="text-xs text-gray-400">{label}</span>  ← centered text
  <div className="flex-1 border-t border-current" />   ← right line
</div>`}</Code>

          {/* Parts table */}
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-40">
                  Part
                </th>
                <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                [
                  'root div',
                  'Outer element. Renders role="separator" and aria-orientation. Receives className and all other props.',
                ],
                [
                  'left / right line',
                  'Two flex-1 divs flanking the label. Visible only when label is provided.',
                ],
                [
                  'label span',
                  'Centered text between the two lines. Always shrink-0 so it never wraps or collapses.',
                ],
              ].map(([part, desc]) => (
                <tr key={part}>
                  <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">{part}</td>
                  <td className="py-2.5 text-xs text-gray-600">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Best Practices */}
      <Section title="Best Practices">
        <div className="flex flex-col gap-8">
          {[
            {
              heading: 'When to use',
              items: [
                {
                  title: 'Between semantically related but visually distinct sections',
                  body: 'Use between form groups, card regions, or list category breaks where content is related but benefits from a visual boundary — e.g. shipping vs. billing fields.',
                },
                {
                  title: 'Inline between nav links, toolbar actions, or breadcrumb items',
                  body: 'Use vertical orientation inside a flex items-center row to separate grouped controls — nav links, action buttons, or breadcrumb segments.',
                },
                {
                  title: 'Between two mutually exclusive options with a short label',
                  body: 'The label prop renders centered text like "or" between two lines — ideal for login forms with multiple auth methods or toggle patterns.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: "Don't use as a layout spacer",
                  body: 'Separator carries role="separator" and announces itself to assistive technology. For spacing only, use margin or padding — not a semantic divider.',
                },
                {
                  title: "Don't stack Separators back-to-back",
                  body: 'Each Separator implies a content group exists on both sides. Back-to-back separators with nothing between them break that semantic contract.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'role="separator" and aria-orientation are set automatically',
                  body: 'Both attributes are derived from the orientation prop — no manual overrides needed. Never remove or override role on the Separator element.',
                },
                {
                  title: 'Keep labels to 1–3 words',
                  body: 'The label is rendered in a visible span and read by screen readers in context. It is not a heading — keep it to short conjunctions like "or", "and", or "More options". Use a heading element for longer labels.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: 'Vertical separators require an explicit height',
                  body: 'Vertical separators have no intrinsic height. Always pass a height class via className — e.g. h-4 for inline icons or h-full when the parent flex container controls height. Without it, the separator renders at 0px and is invisible.',
                },
                {
                  title: 'Change line color via a text-* class, not border-*',
                  body: 'The line uses border-current and inherits from the text color. Pass a text color class on className (e.g. text-violet-300) to change it — overriding border-* directly on children will not work.',
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
        <SubSection title="Separator">
          <ApiTable
            rows={[
              [
                'orientation',
                '"horizontal" | "vertical"',
                '"horizontal"',
                'Direction of the divider.',
              ],
              ['variant', '"solid" | "dashed" | "dotted"', '"solid"', 'Visual style of the line.'],
              [
                'label',
                'string',
                '—',
                'Text centered between two lines. Horizontal only. Use short conjunctions ("or", "and").',
              ],
              [
                'className',
                'string',
                '—',
                'Extra classes on the root div. Use text-* to change line color. Required for height on vertical separators.',
              ],
              [
                '...props',
                'HTMLAttributes<div>',
                '—',
                'Spread onto the root div — e.g. id, style, aria-label.',
              ],
            ]}
          />
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700 leading-relaxed mt-2">
            <strong>Vertical height:</strong> Vertical separators have no intrinsic height. Always
            pass a height class: <code className="font-mono">className=&quot;h-4&quot;</code> or{' '}
            <code className="font-mono">className=&quot;h-full&quot;</code>.
          </div>
        </SubSection>
      </Section>
    </div>
  ),
}
