import { useState } from 'react'
import { LayoutDashboard, Package, TrendingUp, Settings, Search, User, LogOut } from 'lucide-react'
import {
  Command,
  CommandTrigger,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandEmpty,
} from './Command'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Command' }
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
  <div className="flex flex-col gap-3 p-6 bg-gray-50 border border-gray-200 rounded-lg mb-3">
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

// ─── Story ────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Command</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A keyboard-driven command palette triggered by{' '}
          <kbd className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
            ⌘K
          </kbd>{' '}
          /{' '}
          <kbd className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
            Ctrl+K
          </kbd>
          . Supports real-time filtering, grouped items, keyboard navigation, and empty state —
          built from scratch with no cmdk or Radix.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Press{' '}
          <kbd className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
            ⌘K
          </kbd>{' '}
          anywhere on this page or click the trigger below to open the palette.
        </p>
        <Preview>
          <Command>
            <CommandTrigger className="w-64" />
            <CommandDialog>
              <CommandInput placeholder="Search commands…" />
              <CommandList>
                <CommandGroup label="Navigation">
                  <CommandItem icon={LayoutDashboard} label="Dashboard" onSelect={() => {}} />
                  <CommandItem
                    icon={Package}
                    label="Inventory"
                    shortcut="G I"
                    onSelect={() => {}}
                  />
                  <CommandItem
                    icon={TrendingUp}
                    label="Trades"
                    shortcut="G T"
                    onSelect={() => {}}
                  />
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup label="Account">
                  <CommandItem icon={Settings} label="Settings" onSelect={() => {}} />
                  <CommandItem icon={LogOut} label="Log out" onSelect={() => {}} />
                </CommandGroup>
                <CommandEmpty />
              </CommandList>
            </CommandDialog>
          </Command>
        </Preview>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy">
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide block mb-3">
            Structure
          </span>
          <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl">
            <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
              Command
            </span>
            <div className="flex flex-col gap-2 mt-1">
              <div className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-500">
                CommandTrigger
              </div>
              <div className="relative p-3 border border-dashed border-violet-300 rounded-lg">
                <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-violet-500">
                  CommandDialog
                </span>
                <div className="flex flex-col gap-1.5 mt-1">
                  <div className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-500">
                    CommandInput
                  </div>
                  <div className="relative p-3 border border-dashed border-blue-300 rounded-lg">
                    <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-blue-500">
                      CommandList
                    </span>
                    <div className="flex flex-col gap-1.5 mt-1">
                      <div className="relative p-2 border border-dashed border-blue-200 rounded">
                        <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-blue-400">
                          CommandGroup
                        </span>
                        <div className="flex gap-1.5 mt-1 flex-wrap">
                          {['CommandItem', 'CommandItem'].map((t, i) => (
                            <div
                              key={i}
                              className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] text-gray-400"
                            >
                              {t}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] text-gray-400">
                        CommandSeparator
                      </div>
                      <div className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] text-gray-400">
                        CommandEmpty
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
                  'Command',
                  '<div> (Context Root)',
                  'Root. Provides query/open state + global Cmd+K listener.',
                ],
                [
                  'CommandTrigger',
                  '<button>',
                  'Opens the dialog on click. Renders a default search button if no children passed.',
                ],
                [
                  'CommandDialog',
                  'createPortal → <div>',
                  'Modal overlay + panel. Handles ↑ ↓ Enter Escape keyboard navigation.',
                ],
                [
                  'CommandInput',
                  '<input>',
                  'Controlled search input. Auto-focused on open. Shows clear button when query is set.',
                ],
                [
                  'CommandList',
                  '<div data-command-list>',
                  'Scrollable results container. Scopes CommandEmpty and group visibility checks.',
                ],
                [
                  'CommandGroup',
                  '<div>',
                  'Labeled group. Hides itself (display: none) when all its items are filtered out.',
                ],
                [
                  'CommandItem',
                  '<div data-command-item>',
                  "Result row. Hidden (HTML hidden attr) when label doesn't match query. Calls onSelect + closes on click/Enter.",
                ],
                ['CommandSeparator', '<hr>', 'Visual divider between groups.'],
                [
                  'CommandEmpty',
                  '<div>',
                  'Shown when no CommandItem in the list is visible. Hidden otherwise.',
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
  Command, CommandTrigger, CommandDialog,
  CommandInput, CommandList, CommandGroup,
  CommandItem, CommandSeparator, CommandEmpty,
} from '@/components/base/Command/Command'`}</Code>
        </SubSection>

        <SubSection title="Uncontrolled (default)">
          <Code>{`<Command>
  <CommandTrigger />         {/* click or press ⌘K */}
  <CommandDialog>
    <CommandInput placeholder="Search…" />
    <CommandList>
      <CommandGroup label="Navigation">
        <CommandItem icon={LayoutDashboard} label="Dashboard" onSelect={() => router.push('/')} />
        <CommandItem icon={Package} label="Inventory" shortcut="G I" onSelect={() => {}} />
      </CommandGroup>
      <CommandEmpty />
    </CommandList>
  </CommandDialog>
</Command>`}</Code>
        </SubSection>

        <SubSection title="Controlled">
          <Code>{`const [open, setOpen] = useState(false)

<Command open={open} onOpenChange={setOpen}>
  <button onClick={() => setOpen(true)}>Open</button>
  <CommandDialog>
    <CommandInput />
    <CommandList>
      <CommandItem label="Dashboard" onSelect={() => {}} />
      <CommandEmpty />
    </CommandList>
  </CommandDialog>
</Command>`}</Code>
        </SubSection>
      </Section>

      {/* Keyboard */}
      <Section title="Keyboard Navigation">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Key', 'Action'].map((h) => (
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
                ['⌘K / Ctrl+K', 'Open the command palette from anywhere on the page'],
                ['↑ / ↓', 'Move focus between visible (non-filtered) items'],
                ['Enter', 'Select the focused item — calls onSelect and closes the palette'],
                ['Escape', 'Close the palette and clear the search query'],
                [
                  'Type',
                  'Filter items in real-time — groups with no matching items hide automatically',
                ],
              ].map(([key, action]) => (
                <tr key={key} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                    {key}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                    {action}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* API */}
      <Section title="API Reference">
        <SubSection title="Command" description="Root component.">
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
                  ['open', 'boolean', '—', 'Controlled open state.'],
                  [
                    'onOpenChange',
                    '(open: boolean) => void',
                    '—',
                    'Called when open state changes.',
                  ],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
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

        <SubSection title="CommandItem" description="Individual result row.">
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
                    'label',
                    'string',
                    '—',
                    'Display text and filter target. Required for filtering.',
                  ],
                  ['icon', 'LucideIcon', '—', 'Optional leading icon.'],
                  [
                    'shortcut',
                    'string',
                    '—',
                    'Keyboard shortcut hint shown on the right. Space-separated keys: "G I".',
                  ],
                  [
                    'onSelect',
                    '() => void',
                    '—',
                    'Called when item is clicked or activated via Enter.',
                  ],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
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

        <SubSection title="CommandGroup" description="Labeled group of items.">
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
                    'label',
                    'string',
                    '—',
                    'Group heading text shown above items. Omit for an unlabeled group.',
                  ],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
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
    </div>
  ),
}
