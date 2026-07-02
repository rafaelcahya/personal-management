'use client'
import { useState } from 'react'
import { Filter, Info, Pencil, X } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from './Popover'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Popover' }
export default meta

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-3xl py-6 px-2">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Popover</h1>
        <p className="text-base text-gray-500 leading-relaxed">
          A floating panel anchored to a trigger element. Unlike{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">DropdownMenu</code>, the
          content is fully open — any ReactNode can go inside. Built from scratch with Portal
          rendering, auto-flip positioning, click-outside and Escape-to-close.
        </p>
      </div>

      {/* Overview */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Overview</h2>
        <div className="flex gap-3 flex-wrap py-4 justify-center">
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
        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
          <code>{`import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from '@/components/base/Popover/Popover'

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open</Button>
  </PopoverTrigger>
  <PopoverContent side="bottom" align="start" sideOffset={6} className="w-64 p-4">
    <p>Content goes here.</p>
    <PopoverClose><X className="size-4" /></PopoverClose>
  </PopoverContent>
</Popover>`}</code>
        </pre>
      </section>

      {/* Anatomy */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Anatomy</h2>
        <pre className="bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 text-xs text-gray-700 leading-relaxed">
          <code>{`<Popover open? onOpenChange? defaultOpen?>   ← root — manages open state
  <PopoverTrigger asChild?>                   ← wraps trigger; toggles open on click
    <Button>Open</Button>
  </PopoverTrigger>
  <PopoverContent side? align? sideOffset?>   ← floating panel (Portal)
    {/* any content */}
    <PopoverClose asChild?>                   ← closes the popover on click
      <button>×</button>
    </PopoverClose>
  </PopoverContent>
</Popover>`}</code>
        </pre>

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
                'Root. Holds open state. Supports controlled (open + onOpenChange) and uncontrolled (defaultOpen).',
              ],
              [
                'PopoverTrigger',
                'Toggles the panel on click. Pass asChild to forward props onto a custom element.',
              ],
              [
                'PopoverContent',
                'The floating panel. Rendered via Portal — never clipped by overflow. Flips near viewport edges.',
              ],
              [
                'PopoverClose',
                'Closes the popover when clicked. Pass asChild to use a custom element as the close trigger.',
              ],
            ].map(([part, desc]) => (
              <tr key={part}>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">{part}</td>
                <td className="py-2.5 text-xs text-gray-600">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Positioning */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Positioning</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">side</code> controls which
          side the panel appears on.{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">align</code> controls how it
          aligns along that axis.{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">sideOffset</code> sets the
          gap in pixels. The panel flips automatically when it would overflow the viewport.
        </p>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-32">
                Prop
              </th>
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-48">
                Values
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
            {[
              [
                'side',
                '"top" | "right" | "bottom" | "left"',
                '"bottom"',
                'Which side of the trigger to render on.',
              ],
              ['align', '"start" | "center" | "end"', '"start"', 'Alignment along the side axis.'],
              ['sideOffset', 'number', '6', 'Gap in px between trigger and panel.'],
            ].map(([prop, type, def, desc]) => (
              <tr key={prop}>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">{prop}</td>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">{type}</td>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">{def}</td>
                <td className="py-2.5 text-xs text-gray-600">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Usage */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Usage</h2>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Uncontrolled (default)</span>
          <div className="py-6 flex justify-center border border-gray-200 rounded-xl">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open</Button>
              </PopoverTrigger>
              <PopoverContent className="w-52 p-4">
                <p className="text-sm text-gray-700">Uncontrolled popover.</p>
              </PopoverContent>
            </Popover>
          </div>
          <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
            <code>{`<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open</Button>
  </PopoverTrigger>
  <PopoverContent className="w-52 p-4">
    <p>Content.</p>
  </PopoverContent>
</Popover>`}</code>
          </pre>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Controlled</span>
          <ControlledInline />
          <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
            <code>{`const [open, setOpen] = useState(false)

<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button>Open</Button>
  </PopoverTrigger>
  <PopoverContent>...</PopoverContent>
</Popover>`}</code>
          </pre>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">
            PopoverClose — close from inside content
          </span>
          <div className="py-6 flex justify-center border border-gray-200 rounded-xl">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open</Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-4">
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-gray-700">Confirm this action?</p>
                  <div className="flex gap-2">
                    <PopoverClose asChild>
                      <Button size="sm" className="flex-1">
                        Confirm
                      </Button>
                    </PopoverClose>
                    <PopoverClose asChild>
                      <Button size="sm" variant="ghost" className="flex-1">
                        Cancel
                      </Button>
                    </PopoverClose>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
            <code>{`<PopoverContent>
  <PopoverClose asChild>
    <Button size="sm">Confirm</Button>
  </PopoverClose>
  <PopoverClose asChild>
    <Button size="sm" variant="ghost">Cancel</Button>
  </PopoverClose>
</PopoverContent>`}</code>
          </pre>
        </div>
      </section>

      {/* When to use */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">When to use</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3 p-4 rounded-xl border border-violet-200 bg-violet-50">
            <p className="text-sm font-semibold text-gray-800">
              Use{' '}
              <code className="font-mono bg-white border border-violet-200 px-1.5 py-0.5 rounded text-xs">
                Popover
              </code>{' '}
              when…
            </p>
            <ul className="flex flex-col gap-1.5 text-xs text-gray-600 leading-relaxed list-none">
              {[
                'Content is freeform — a form, a table, a date picker, a filter panel.',
                'You need a floating info bubble or tooltip-like panel with rich content.',
                'You need programmatic open/close control from outside the trigger.',
                'Content should not close when the user clicks inside it.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-violet-500 shrink-0">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50">
            <p className="text-sm font-semibold text-gray-800">
              Use{' '}
              <code className="font-mono bg-white border border-gray-200 px-1.5 py-0.5 rounded text-xs">
                DropdownMenu
              </code>{' '}
              instead when…
            </p>
            <ul className="flex flex-col gap-1.5 text-xs text-gray-600 leading-relaxed list-none">
              {[
                'Content is a list of actions, links, or menu items.',
                'You need keyboard navigation between items (Arrow keys, Enter).',
                'You need checkbox items, radio groups, or nested submenus.',
                'Clicking an item should close the menu automatically.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-gray-400 shrink-0">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* When to Use */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">When to Use</h2>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Use Popover when…', 'Consider an alternative when…'].map((h) => (
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
                      The content is freeform — a form, date picker, filter panel, or rich layout
                      that cannot fit in a menu item.
                    </li>
                    <li>
                      The user must interact with the content (type, check, click buttons) without
                      the panel closing.
                    </li>
                    <li>
                      You need programmatic control over open/close state from outside the trigger
                      element.
                    </li>
                  </ul>
                </td>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                  <ul className="flex flex-col gap-1.5">
                    <li>
                      Use <strong>Tooltip</strong> when the content is read-only and no user
                      interaction is needed inside the panel.
                    </li>
                    <li>
                      Use <strong>DropdownMenu</strong> when the content is a list of actions or
                      links that close the panel on selection.
                    </li>
                    <li>
                      Use <strong>Dialog</strong> when the content is complex enough to warrant a
                      modal — blocking focus and requiring an explicit dismiss.
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Dos & Don'ts */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Dos & Don'ts</h2>
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
                  Keep popover content focused and scoped. Use it for a single task — a quick edit
                  form, a filter set, or a detail peek — not as a catch-all drawer.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Provide a clear close mechanism inside the panel when interactions are multi-step.
                  Use <code className="font-mono bg-green-100 px-1 rounded">PopoverClose</code> on a
                  Cancel or X button so the user always knows how to dismiss.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Set an explicit width via{' '}
                  <code className="font-mono bg-green-100 px-1 rounded">className="w-64"</code> on{' '}
                  <code className="font-mono bg-green-100 px-1 rounded">PopoverContent</code>.
                  Without a width the panel will collapse to the width of its narrowest child.
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
                  Don't nest another Popover or DropdownMenu inside a Popover. Overlapping floating
                  panels create z-index conflicts and confuse click-outside detection — flatten the
                  hierarchy instead.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't use Popover for a list of navigation links or action items. Keyboard users
                  expect arrow-key navigation in those cases — reach for DropdownMenu which provides
                  that out of the box.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't rely solely on click-outside to dismiss when the panel contains a form with
                  unsaved data. Warn the user or disable click-outside by controlling the open state
                  manually.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">API Reference</h2>

        {[
          {
            name: 'Popover',
            rows: [
              ['open', 'boolean', '—', 'Controlled open state.'],
              ['onOpenChange', '(open: boolean) => void', '—', 'Called when open state changes.'],
              ['defaultOpen', 'boolean', 'false', 'Initial open state for uncontrolled mode.'],
            ],
          },
          {
            name: 'PopoverTrigger',
            rows: [
              [
                'asChild',
                'boolean',
                'false',
                'Forward props onto the single child element instead of wrapping in a span.',
              ],
            ],
          },
          {
            name: 'PopoverContent',
            rows: [
              [
                'side',
                '"top" | "right" | "bottom" | "left"',
                '"bottom"',
                'Which side to render on. Flips automatically near viewport edges.',
              ],
              ['align', '"start" | "center" | "end"', '"start"', 'Alignment along the side axis.'],
              ['sideOffset', 'number', '6', 'Gap in pixels between trigger and panel.'],
              ['className', 'string', '—', 'Additional classes on the panel div.'],
            ],
          },
          {
            name: 'PopoverClose',
            rows: [
              [
                'asChild',
                'boolean',
                'false',
                'Forward the close handler onto the single child element.',
              ],
              ['className', 'string', '—', 'Additional classes on the default close button.'],
            ],
          },
        ].map(({ name, rows }) => (
          <div key={name} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-800">{name}</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-36">
                    Prop
                  </th>
                  <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-56">
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
          </div>
        ))}
      </section>
    </div>
  ),
}

function ControlledInline() {
  const [open, setOpen] = useState(false)
  return (
    <div className="py-6 flex items-center gap-3 justify-center border border-gray-200 rounded-xl">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">{open ? 'Close' : 'Open'}</Button>
        </PopoverTrigger>
        <PopoverContent className="w-52 p-4">
          <p className="text-sm text-gray-700">Controlled popover.</p>
        </PopoverContent>
      </Popover>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        Force open
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
        Force close
      </Button>
    </div>
  )
}
