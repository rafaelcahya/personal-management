import { Filter, Info, Pencil, X } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from './Popover'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Popover' }
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
  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-100 text-violet-700">
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
        <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-52">
          Type
        </th>
        <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-20">
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

// ─── Overview Demo ────────────────────────────────────────────────────────────

function OverviewDemo() {
  return (
    <div className="flex gap-3 flex-wrap">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Info</Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4">
          <div className="flex gap-2 items-start">
            <Info className="size-4 text-violet-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-gray-800">Did you know?</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Popover content can be anything — text, forms, tables, or custom components.
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Filter className="size-3.5" />
            Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-3">
          <p className="text-xs font-semibold text-gray-700 mb-2">Filter by type</p>
          {['Buy', 'Sell', 'Dividend'].map((t) => (
            <label
              key={t}
              className="flex items-center gap-2 text-xs text-gray-600 py-1 cursor-pointer"
            >
              <input type="checkbox" className="accent-violet-600" />
              {t}
            </label>
          ))}
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Edit">
            <Pencil className="size-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-800">Quick edit</p>
            <PopoverClose>
              <X className="size-4" />
            </PopoverClose>
          </div>
          <div className="flex flex-col gap-2">
            <input
              className="h-8 rounded border border-gray-200 px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600"
              defaultValue="BBCA"
            />
            <Button size="sm">Save</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// ─── Docs ─────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-3xl py-6 px-2">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Tag>Base Component</Tag>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Popover</h1>
        <p className="text-base text-gray-500 leading-relaxed">
          A floating panel anchored to a trigger element. Unlike{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">DropdownMenu</code>, the
          content is fully open — any ReactNode can go inside. Renders via Portal so it is never
          clipped by overflow. Closes on click-outside and Escape.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <OverviewDemo />
        </div>
        <Code>{`import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from '@/components/base/Popover/Popover'

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open</Button>
  </PopoverTrigger>
  <PopoverContent side="bottom" align="start" sideOffset={6} className="w-64 p-4">
    <p>Content goes here.</p>
    <PopoverClose><X className="size-4" /></PopoverClose>
  </PopoverContent>
</Popover>`}</Code>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy">
        <div className="flex flex-col gap-6">
          {/* Visual box */}
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-4 font-mono text-xs text-gray-600 leading-relaxed">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-gray-400">
                Popover (root)
              </span>
              <div className="pl-4 border-l-2 border-gray-200 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400">
                    PopoverTrigger
                  </span>
                  <div className="pl-4 border-l-2 border-violet-200">
                    <span className="inline-flex px-3 py-1.5 bg-white border border-gray-300 rounded text-gray-700 shadow-sm">
                      Button — click to open
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400">
                    PopoverContent (Portal — floats above page)
                  </span>
                  <div className="pl-4 border-l-2 border-violet-200">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-3 flex flex-col gap-2 w-56">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 text-xs font-medium">Any content here</span>
                        <span className="text-[10px] text-gray-400 border border-dashed border-gray-300 rounded px-1 py-0.5">
                          PopoverClose
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        form · filter · info · table
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code tree */}
          <Code>{`<Popover open? onOpenChange? defaultOpen?>    ← root — manages open state
  <PopoverTrigger asChild?>                    ← toggles open on click
    <Button>Open</Button>
  </PopoverTrigger>
  <PopoverContent side? align? sideOffset?>    ← floating panel via Portal
    {/* any content */}
    <PopoverClose asChild?>                    ← closes popover on click
      <button>×</button>
    </PopoverClose>
  </PopoverContent>
</Popover>`}</Code>

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
                  'Popover',
                  'Root. Manages open state. Supports controlled (open + onOpenChange) and uncontrolled (defaultOpen).',
                ],
                [
                  'PopoverTrigger',
                  'Toggles the panel on click. Use asChild to forward props onto a custom element instead of adding a wrapper.',
                ],
                [
                  'PopoverContent',
                  'The floating panel. Rendered via Portal — never clipped by parent overflow. Flips automatically near viewport edges.',
                ],
                [
                  'PopoverClose',
                  'Closes the popover when clicked. Use asChild to use any element as the close trigger.',
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

      {/* Keyboard Behavior */}
      <Section title="Keyboard Behavior">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-36">
                Key
              </th>
              <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                Behavior
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              ['Enter / Space', 'Opens or closes the popover when focus is on the trigger.'],
              ['Escape', 'Closes the popover and returns focus to the trigger.'],
              [
                'Tab',
                'Moves focus through interactive elements inside the panel. Focus does not trap — Tab out closes nothing.',
              ],
              ['Click outside', 'Closes the popover (click-outside detection via Portal).'],
            ].map(([key, behavior]) => (
              <tr key={key}>
                <td className="py-2.5 pr-4">
                  <kbd className="font-mono text-xs bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5">
                    {key}
                  </kbd>
                </td>
                <td className="py-2.5 text-xs text-gray-600">{behavior}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {/* Best Practices */}
      <Section title="Best Practices">
        <div className="flex flex-col gap-8">
          {[
            {
              heading: 'When to use',
              items: [
                {
                  title: 'Content is freeform — form, filter panel, date picker, or rich layout',
                  body: 'Use Popover when the content is not just a list of links or actions. Any ReactNode can go inside — the panel stays open while the user interacts.',
                },
                {
                  title: 'The user must interact inside the panel without it closing',
                  body: 'Typing in a field, checking checkboxes, or clicking buttons inside the panel should not dismiss it. Popover keeps open until click-outside, Escape, or an explicit close.',
                },
                {
                  title: 'Need programmatic open/close control from outside the trigger',
                  body: 'Use controlled mode (open + onOpenChange) when sibling components, form submits, or route changes need to open or close the panel.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: 'Content is a list of actions or links → use DropdownMenu',
                  body: 'DropdownMenu has built-in keyboard navigation (arrow keys), auto-close on select, and proper ARIA roles for action lists. Popover has none of that.',
                },
                {
                  title: 'Content is read-only text → use Tooltip',
                  body: 'Tooltip is hover-triggered and requires no interaction — the right choice for labels, hints, and descriptions that need no user input.',
                },
                {
                  title: 'Content needs blocking focus → use Dialog',
                  body: 'Popover does not trap focus. If the user must complete the interaction before continuing, use Dialog which traps focus and blocks the rest of the page.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'Focus does NOT trap — Tab moves normally through the panel',
                  body: 'This is intentional. Use Dialog if you need a focus trap. Tab out of the panel does not close it — only click-outside, Escape, or PopoverClose does.',
                },
                {
                  title: 'Always provide a close mechanism inside multi-step panels',
                  body: 'Keyboard users rely on PopoverClose — add it on a Cancel or × button so they can always dismiss without reaching for Escape.',
                },
                {
                  title: 'Use aria-label on icon-only triggers',
                  body: 'A pencil icon button with no text label is meaningless to screen readers. Add aria-label="Edit" so the action is announced correctly.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: 'Keep content focused — one task per Popover',
                  body: 'Use Popover for a quick edit, a filter set, or a detail peek — not as a catch-all drawer. If the content is complex enough to need a title bar and full scroll, use a Sheet or Dialog instead.',
                },
                {
                  title: 'Set an explicit width on PopoverContent',
                  body: 'Without a width class (e.g. className="w-64") the panel collapses to the narrowest child\'s width. Always set it explicitly.',
                },
                {
                  title: 'Use asChild on PopoverTrigger and never nest floating panels',
                  body: 'asChild avoids an extra wrapper span and preserves trigger semantics. Never nest a Popover or DropdownMenu inside a Popover — overlapping floating panels break click-outside detection.',
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
        <SubSection title="Popover">
          <ApiTable
            rows={[
              ['open', 'boolean', '—', 'Controlled open state.'],
              ['onOpenChange', '(open: boolean) => void', '—', 'Called when open state changes.'],
              ['defaultOpen', 'boolean', 'false', 'Initial open state for uncontrolled mode.'],
            ]}
          />
        </SubSection>

        <SubSection title="PopoverTrigger">
          <ApiTable
            rows={[
              [
                'asChild',
                'boolean',
                'false',
                'Forward props onto the single child element instead of wrapping in a span.',
              ],
            ]}
          />
        </SubSection>

        <SubSection title="PopoverContent">
          <ApiTable
            rows={[
              [
                'side',
                '"top" | "right" | "bottom" | "left"',
                '"bottom"',
                'Which side to render on. Flips automatically near viewport edges.',
              ],
              ['align', '"start" | "center" | "end"', '"start"', 'Alignment along the side axis.'],
              ['sideOffset', 'number', '6', 'Gap in pixels between trigger and panel.'],
              [
                'className',
                'string',
                '—',
                'Additional classes on the panel div. Always include a width (e.g. w-64).',
              ],
            ]}
          />
        </SubSection>

        <SubSection title="PopoverClose">
          <ApiTable
            rows={[
              [
                'asChild',
                'boolean',
                'false',
                'Forward the close handler onto the single child element.',
              ],
              ['className', 'string', '—', 'Additional classes on the default close button.'],
            ]}
          />
        </SubSection>
      </Section>
    </div>
  ),
}
