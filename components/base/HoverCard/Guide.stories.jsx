import { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'HoverCard',
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

const Preview = ({ children }) => (
  <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 w-80">
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
    red: 'bg-red-100 text-red-700',
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}

const ApiTable = ({ rows }) => (
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
        {rows.map(([prop, type, def, desc]) => (
          <tr key={prop} className="even:bg-gray-50">
            <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
              {prop}
            </td>
            <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500 max-w-xs">
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
)

// ─── Story ───────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">HoverCard</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A rich floating preview panel triggered on hover. Unlike Tooltip, HoverCard content can
          contain interactive elements (links, buttons, structured data) and stays open when the
          mouse moves into the panel itself. Built from scratch using{' '}
          <code className="font-mono text-sm">createPortal</code>.
        </p>
      </div>

      {/* ── Overview ───────────────────────────────────────────────────────── */}
      <Section title="Overview">
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          HoverCard renders in a Portal so it is never clipped by overflow containers. It opens
          after <code className="font-mono text-xs bg-gray-100 px-1 rounded">openDelay</code> ms and
          stays open while the mouse is over the trigger or the panel. Use it for tickers, inventory
          items, user profiles — any context that benefits from a hover-activated preview with
          interactive content.
        </p>
        <Preview>
          <HoverCard openDelay={0}>
            <HoverCardTrigger asChild>
              <span className="text-sm underline decoration-dotted cursor-default text-slate-700 w-fit">
                BBCA
              </span>
            </HoverCardTrigger>
            <HoverCardContent side="bottom" align="start" className="p-3 min-w-48">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm">Bank BCA</span>
                  <span className="text-green-600 text-xs">+2.4%</span>
                </div>
                <div className="flex flex-col gap-1 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Open</span>
                    <span className="text-slate-700">9.250</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current</span>
                    <span className="text-slate-700">9.472</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volume</span>
                    <span className="text-slate-700">142.3M</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-xs border border-slate-200 rounded-lg px-2 py-1 hover:bg-gray-50 transition-colors"
                >
                  View trades
                </button>
              </div>
            </HoverCardContent>
          </HoverCard>
        </Preview>
      </Section>

      {/* ── Anatomy ────────────────────────────────────────────────────────── */}
      <Section title="Anatomy">
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide mb-1">
                Structure
              </span>
              <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl inline-block">
                <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
                  HoverCard
                </span>
                <div className="relative p-3 border border-dashed border-violet-300 rounded-lg mb-2">
                  <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-violet-500">
                    HoverCardTrigger
                  </span>
                  <div className="mt-1 px-3 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-500 whitespace-nowrap">
                    trigger element
                  </div>
                </div>
                <div className="relative p-3 border border-dashed border-blue-300 rounded-lg">
                  <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-blue-500">
                    HoverCardContent
                  </span>
                  <div className="mt-1 flex flex-col gap-1.5">
                    <div className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-500 whitespace-nowrap">
                      children (any ReactNode)
                    </div>
                    <div className="relative p-2 border border-dashed border-green-300 rounded-lg">
                      <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                        interactive elements (optional)
                      </span>
                      <div className="mt-0.5 text-[10px] text-gray-400 font-mono">
                        links, buttons, forms
                      </div>
                    </div>
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
                  'HoverCard',
                  '<div> (Context Root)',
                  'Root component. Manages open state and timer refs for open/close delay.',
                ],
                [
                  'HoverCardTrigger',
                  '<span> or asChild',
                  'The element that opens the card on mouseenter. Use asChild to merge onto a custom element.',
                ],
                [
                  'HoverCardContent',
                  '<div> (Portal)',
                  'The floating panel. Renders in a Portal — never clipped by parent overflow. Stays open on mouseenter.',
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

        <Code>{`<HoverCard openDelay={300} closeDelay={150}>
  <HoverCardTrigger asChild>
    <span>Hover me</span>
  </HoverCardTrigger>
  <HoverCardContent side="bottom" align="center" sideOffset={8}>
    <div>Rich content here</div>
  </HoverCardContent>
</HoverCard>`}</Code>
      </Section>

      {/* ── Timing ─────────────────────────────────────────────────────────── */}
      <Section title="Timing">
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          The open/close flow uses a timer-based &quot;grace period&quot; so the mouse can travel
          from the trigger into the panel without the panel closing.
        </p>
        <SubSection title="Timer flow">
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Event', 'Action'].map((h) => (
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
                  ['Trigger mouseenter', 'Clear close timer → start open timer (openDelay)'],
                  ['Trigger mouseleave', 'Clear open timer → start close timer (closeDelay)'],
                  ['Content mouseenter', 'Clear close timer → panel stays open'],
                  ['Content mouseleave', 'Start close timer (closeDelay)'],
                ].map(([event, action]) => (
                  <tr key={event} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                      {event}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                      {action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>
      </Section>

      {/* ── Best Practices ─────────────────────────────────────────────────── */}
      <Section title="Best Practices">
        <div className="flex flex-col gap-8">
          {[
            {
              heading: 'When to use',
              items: [
                {
                  title: 'Use for hover-triggered previews with rich, structured content',
                  body: 'Ticker details, inventory item specs, user profile snapshots — these benefit from a hover-activated panel with a header, key-value rows, and an optional action button.',
                },
                {
                  title: 'Use when the preview may contain interactive elements',
                  body: 'HoverCard supports links and buttons inside the panel — it stays open when the mouse moves into it. This is intentional and is the key difference from Tooltip.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: "Don't use for plain-text labels — use Tooltip instead",
                  body: 'If the preview is a single non-interactive string, Tooltip is the correct component. HoverCard is for structured, potentially interactive content.',
                },
                {
                  title: "Don't use for forms, destructive confirmations, or multi-step flows",
                  body: 'Hover is an unreliable trigger for high-stakes interactions. Use Popover for form-like content and Dialog for destructive confirmations — both require an intentional click to open.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'HoverCard is hover-only — never put critical data exclusively behind it',
                  body: 'Hover is not available on touch devices. Always ensure the same information is reachable through a visible link, table cell, or click interaction — not only through the HoverCard.',
                },
                {
                  title: 'Set openDelay 200–400ms to prevent accidental triggers',
                  body: 'In dense layouts, openDelay=0 causes panels to flash open on every accidental mouse-over. A 200–400ms delay still feels responsive for intentional hovers and prevents visual noise.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: 'Use asChild on HoverCardTrigger to avoid extra DOM wrappers',
                  body: 'asChild merges hover props directly onto your element — ticker badge, item name, user handle. Without it, an extra <span> wrapper is added to the DOM that may affect layout or styling.',
                },
                {
                  title: 'side="bottom" + align="start" is the most common combination',
                  body: 'Anchors to the left edge of the trigger and opens downward — matches reading direction for inline text triggers like ticker symbols. The panel flips automatically near viewport edges.',
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

      {/* ── API Reference ──────────────────────────────────────────────────── */}
      <Section title="API Reference">
        <SubSection title="HoverCard" description="Root component. Manages open state and timers.">
          <ApiTable
            rows={[
              [
                'openDelay',
                'number',
                '300',
                'Milliseconds before the panel opens after trigger hover.',
              ],
              [
                'closeDelay',
                'number',
                '150',
                'Milliseconds before the panel closes after mouse leaves.',
              ],
              ['open', 'boolean', '—', 'Controlled open state.'],
              ['onOpenChange', '(open: boolean) => void', '—', 'Called when open state changes.'],
            ]}
          />
        </SubSection>

        <SubSection
          title="HoverCardTrigger"
          description="The element that triggers the card on mouseenter."
        >
          <ApiTable
            rows={[
              [
                'asChild',
                'boolean',
                'false',
                'Merge hover props onto the child element instead of wrapping in a span.',
              ],
            ]}
          />
        </SubSection>

        <SubSection
          title="HoverCardContent"
          description="The floating panel. Renders in a Portal — never clipped by parent overflow."
        >
          <ApiTable
            rows={[
              [
                'children',
                'ReactNode',
                '—',
                'Any content — strings, icons, buttons, forms, structured data.',
              ],
              [
                'side',
                "'top' | 'right' | 'bottom' | 'left'",
                "'bottom'",
                'Which side of the trigger the panel appears on. Flips automatically near viewport edges.',
              ],
              ['align', "'start' | 'center' | 'end'", "'center'", 'Alignment along the side axis.'],
              ['sideOffset', 'number', '8', 'Gap in pixels between trigger and panel.'],
              ['className', 'string', '—', 'Extra classes merged onto the panel.'],
            ]}
          />
        </SubSection>
      </Section>
    </div>
  ),
}
