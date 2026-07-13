import { Info } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from './Tooltip'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tooltip',
}

export default meta

// ─── Primitives ──────────────────────────────────────────────────────────────

function ApiTable({ rows }) {
  return (
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
}

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

// ─── Story ───────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Tooltip</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A popup that displays information when a user hovers or focuses a trigger element. Renders
          in a Portal — auto-positions to stay within the viewport.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Tooltip renders in a Portal so it is never clipped by overflow containers. The content
          auto-positions to stay within the viewport. Use it for supplemental info — labels,
          keyboard shortcuts, stat breakdowns — not for critical content that must always be
          visible.
        </p>
        <Preview>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
              >
                <Info className="size-4" />
                Hover me
              </button>
            </TooltipTrigger>
            <TooltipContent>Displays helpful context</TooltipContent>
          </Tooltip>
        </Preview>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy">
        {/* Box diagram */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide mb-1">
                Structure
              </span>

              {/* Root: Tooltip */}
              <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl inline-block">
                <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
                  Tooltip
                </span>

                {/* Interactive: TooltipTrigger */}
                <div className="relative p-3 border border-dashed border-violet-300 rounded-lg mb-2">
                  <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-violet-500">
                    TooltipTrigger
                  </span>
                  <div className="mt-1 px-3 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-500 whitespace-nowrap">
                    trigger element
                  </div>
                </div>

                {/* Core: TooltipContent */}
                <div className="relative p-3 border border-dashed border-blue-300 rounded-lg">
                  <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-blue-500">
                    TooltipContent
                  </span>
                  <div className="mt-1 flex flex-col gap-1.5">
                    <div className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-500 whitespace-nowrap">
                      children (any ReactNode)
                    </div>
                    {/* Optional: Arrow */}
                    <div className="relative p-2 border border-dashed border-green-300 rounded-lg">
                      <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                        Arrow (optional)
                      </span>
                      <div className="mt-0.5 text-[10px] text-gray-400 font-mono">showArrow</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parts table */}
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
                  'Tooltip',
                  '<div> (Provider + Root)',
                  'Root component. Wraps TooltipProvider internally — no separate Provider needed.',
                ],
                [
                  'TooltipTrigger',
                  '<button>',
                  'The element that opens the tooltip on hover/focus. Use asChild to merge onto a custom element.',
                ],
                [
                  'TooltipContent',
                  '<div> (Portal)',
                  'The tooltip panel. Renders in a Portal so it is never clipped by parent overflow.',
                ],
                [
                  'Arrow',
                  '<svg>',
                  'Optional caret arrow pointing toward the trigger. Shown when showArrow={true}.',
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

        {/* Source code */}
        <Code>{`<Tooltip delayDuration={300}>
  <TooltipTrigger asChild>
    <button type="button">Hover me</button>
  </TooltipTrigger>
  <TooltipContent side="top" align="center" showArrow>
    Tooltip text
  </TooltipContent>
</Tooltip>`}</Code>
      </Section>

      {/* Usage */}
      <Section title="Usage">
        <SubSection title="Import">
          <Code>{`import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/base/Tooltip/Tooltip'`}</Code>
        </SubSection>

        <SubSection title="Basic example">
          <Code>{`<Tooltip>
  <TooltipTrigger asChild>
    <button type="button">Hover me</button>
  </TooltipTrigger>
  <TooltipContent>Tooltip text</TooltipContent>
</Tooltip>`}</Code>
        </SubSection>

        <SubSection title="Controlled">
          <Code>{`const [open, setOpen] = useState(false)

<Tooltip open={open} onOpenChange={setOpen}>
  <TooltipTrigger asChild>
    <button type="button">Target</button>
  </TooltipTrigger>
  <TooltipContent>Controlled tooltip</TooltipContent>
</Tooltip>`}</Code>
        </SubSection>

        <SubSection title="Rich content">
          <Code>{`<TooltipContent>
  <div className="flex flex-col gap-1 min-w-36">
    <div className="flex justify-between gap-4">
      <span className="text-slate-400">Open</span>
      <span>9.250</span>
    </div>
    <div className="flex justify-between gap-4">
      <span className="text-slate-400">Current</span>
      <span>9.472</span>
    </div>
  </div>
</TooltipContent>`}</Code>
        </SubSection>
      </Section>

      {/* Animation */}
      <Section
        title="Animation"
        description="Five animation types via the animation prop. Duration accepts named presets or a raw integer in milliseconds."
      >
        <SubSection title="Animation types">
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Value', 'Effect'].map((h) => (
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
                  ['none', 'Appears instantly with no transition'],
                  ['fade', 'Fades in and out (default)'],
                  ['zoom', 'Scales from 95% while fading'],
                  ['slide-up', 'Slides in from below while fading'],
                  ['slide-down', 'Slides in from above while fading'],
                ].map(([val, desc]) => (
                  <tr key={val} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                      {val}
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

        <SubSection title="Duration presets">
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Preset', 'Milliseconds'].map((h) => (
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
                  ['fast', '100ms'],
                  ['default', '150ms'],
                  ['slow', '300ms'],
                  ['slower', '500ms'],
                ].map(([preset, ms]) => (
                  <tr key={preset} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                      {preset}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-700">
                      {ms}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Code>{`<TooltipContent animation="zoom" duration="slow">...</TooltipContent>
<TooltipContent animation="fade" duration={250}>...</TooltipContent>
<TooltipContent animation="none">...</TooltipContent>`}</Code>
        </SubSection>
      </Section>

      {/* API Reference */}
      <Section title="API Reference">
        <SubSection
          title="Tooltip"
          description="Root component. Manages open state, delay timer, and passes context to children."
        >
          <ApiTable
            rows={[
              [
                'delayDuration',
                'number',
                '700',
                'Milliseconds before the tooltip opens after hover.',
              ],
              ['open', 'boolean', '—', 'Controlled open state.'],
              ['defaultOpen', 'boolean', 'false', 'Uncontrolled initial open state — starts open.'],
              ['onOpenChange', '(open: boolean) => void', '—', 'Called when open state changes.'],
            ]}
          />
        </SubSection>

        <SubSection
          title="TooltipTrigger"
          description="Wraps the trigger element in a relative span. Use asChild to merge onto an existing element."
        >
          <ApiTable
            rows={[
              [
                'asChild',
                'boolean',
                'false',
                'Merge hover/focus handlers onto the child element instead of wrapping in a span.',
              ],
            ]}
          />
        </SubSection>

        <SubSection
          title="TooltipContent"
          description="The tooltip panel. Positions relative to the trigger using absolute CSS."
        >
          <ApiTable
            rows={[
              [
                'children',
                'ReactNode',
                '—',
                'Any content — string, icons, key-value layouts, etc.',
              ],
              [
                'side',
                "'top' | 'right' | 'bottom' | 'left'",
                "'top'",
                'Which side of the trigger the tooltip appears on.',
              ],
              ['align', "'start' | 'center' | 'end'", "'center'", 'Alignment along the side axis.'],
              ['sideOffset', 'number', '6', 'Distance in pixels between trigger and tooltip.'],
              [
                'animation',
                "'none' | 'fade' | 'zoom' | 'slide-up' | 'slide-down'",
                "'fade'",
                'Enter/exit animation type.',
              ],
              [
                'duration',
                "'fast' | 'default' | 'slow' | 'slower' | number",
                "'default'",
                'Animation duration. Presets: fast=100ms, default=150ms, slow=300ms, slower=500ms.',
              ],
              [
                'variant',
                "'default' | 'info' | 'success' | 'warning' | 'danger'",
                "'default'",
                'Semantic color variant — changes background, border, and text color.',
              ],
              ['showArrow', 'boolean', 'false', 'Show a caret arrow pointing toward the trigger.'],
              ['className', 'string', '—', 'Extra classes merged onto the tooltip panel.'],
            ]}
          />
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
                  title: 'Use Tooltip for brief supplemental labels on icon-only buttons',
                  body: 'When a button has no visible text, a tooltip provides the accessible name and helps mouse users understand the action without adding permanent UI noise.',
                },
                {
                  title: 'Use Tooltip to surface keyboard shortcuts and stat breakdowns on hover',
                  body: 'Showing a shortcut like "Save (⌘S)" or a quick key-value stat panel keeps the interface clean while providing power-user context exactly when needed.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: "Don't put critical information only inside a Tooltip",
                  body: 'Tooltips are invisible until hover and completely inaccessible on touch devices. If the information is essential to the task, place it inline or in a persistent help text element.',
                },
                {
                  title: "Don't place interactive elements inside TooltipContent",
                  body: 'Users cannot reliably move their cursor into the tooltip before it closes. For content with buttons, inputs, or links, use Popover. For richer hover content, use HoverCard.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'Always use asChild for button-like triggers',
                  body: 'asChild merges hover/focus handlers directly onto your button. Without it, an extra span wrapper is inserted which can break flex layouts and cause unexpected stacking.',
                },
                {
                  title: 'Wrap disabled elements in a span before using TooltipTrigger',
                  body: "Disabled buttons don't fire pointer events, so the tooltip will never open. Wrap the button in a <span> and apply asChild to the span — the tooltip then receives hover events reliably.",
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: 'Keep tooltip text short — under 12 words',
                  body: 'Tooltips are hints, not documentation. If you need a paragraph of explanation, use a Popover or HoverCard. The ideal tooltip is a phrase the user can read in a glance.',
                },
                {
                  title: 'Use delayDuration={0} in dense UI areas like toolbars',
                  body: 'The 700ms default prevents accidental tooltips while the cursor passes over the page. Set it to 0 only in dense areas where quick context-switching is expected.',
                },
                {
                  title: "Use showArrow when the tooltip's trigger isn't obvious",
                  body: 'In grids or tightly packed layouts, an arrow connecting the tooltip to its trigger prevents confusion. Skip it for isolated triggers where the spatial connection is already clear.',
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
    </div>
  ),
}
