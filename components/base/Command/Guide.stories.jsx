import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Settings,
  Search,
  Plus,
  RefreshCw,
  LogOut,
} from 'lucide-react'
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

// ─── API table helper ─────────────────────────────────────────────────────────

const HEADERS = ['Prop', 'Type', 'Default', 'Description']

function ApiTable({ rows }) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50">
            {HEADERS.map((h) => (
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
              <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500 whitespace-nowrap">
                {type}
              </td>
              <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
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
            ⌘
          </kbd>{' '}
          <kbd className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
            K
          </kbd>{' '}
          /{' '}
          <kbd className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
            Ctrl
          </kbd>{' '}
          <kbd className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
            K
          </kbd>
          . Supports real-time filtering, grouped items, keyboard navigation, and empty state.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Press{' '}
          <kbd className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
            ⌘
          </kbd>{' '}
          <kbd className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
            K
          </kbd>{' '}
          anywhere on this page or click the trigger below to open the palette. Type to filter, use
          arrow keys to navigate.
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
                  'Root. Provides query/open state + global ⌘K listener.',
                ],
                [
                  'CommandTrigger',
                  '<button>',
                  'Opens the dialog on click. Renders a styled search button with optional shortcut hint.',
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
                  'Labeled group. Hides itself when all its items are filtered out.',
                ],
                [
                  'CommandItem',
                  '<div data-command-item>',
                  "Result row. Hidden when label doesn't match query. Calls onSelect + closes on click/Enter.",
                ],
                ['CommandSeparator', '<hr>', 'Visual divider between groups.'],
                ['CommandEmpty', '<div>', 'Shown when no CommandItem in the list is visible.'],
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

      {/* Keyboard Navigation */}
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
                ['⌘K / Ctrl+K', 'Open the palette from anywhere on the page'],
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

      {/* Shortcut Variant */}
      <Section title="Shortcut Variants">
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Both <code className="font-mono bg-gray-100 px-1 rounded text-xs">CommandTrigger</code>{' '}
          and <code className="font-mono bg-gray-100 px-1 rounded text-xs">CommandItem</code>{' '}
          support a{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">shortcutVariant</code> prop.
          When a key is held down while the palette is open, matching shortcuts highlight in violet.
        </p>
        <SubSection
          title="chip (default)"
          description="Each key token renders as an individual <kbd> chip with border and background."
        >
          <Preview>
            <Command>
              <CommandTrigger className="w-64" shortcutVariant="chip" />
              <CommandDialog>
                <CommandInput placeholder="Search…" />
                <CommandList>
                  <CommandGroup label="Go to">
                    <CommandItem
                      icon={LayoutDashboard}
                      label="Dashboard"
                      shortcut="G H"
                      onSelect={() => {}}
                    />
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
                  <CommandGroup label="Actions">
                    <CommandItem icon={Plus} label="Add stock" shortcut="N S" onSelect={() => {}} />
                    <CommandItem
                      icon={RefreshCw}
                      label="Refresh data"
                      shortcut="⌘ R"
                      onSelect={() => {}}
                    />
                  </CommandGroup>
                  <CommandEmpty />
                </CommandList>
              </CommandDialog>
            </Command>
          </Preview>
        </SubSection>

        <SubSection
          title="text"
          description="Shortcut is shown as plain monospace text with letter-spacing. Less visual weight — useful in compact contexts."
        >
          <Preview>
            <Command>
              <CommandTrigger className="w-64" shortcutVariant="text" />
              <CommandDialog>
                <CommandInput placeholder="Search…" />
                <CommandList>
                  <CommandGroup label="Go to">
                    <CommandItem
                      icon={LayoutDashboard}
                      label="Dashboard"
                      shortcut="G H"
                      shortcutVariant="text"
                      onSelect={() => {}}
                    />
                    <CommandItem
                      icon={Package}
                      label="Inventory"
                      shortcut="G I"
                      shortcutVariant="text"
                      onSelect={() => {}}
                    />
                    <CommandItem
                      icon={TrendingUp}
                      label="Trades"
                      shortcut="G T"
                      shortcutVariant="text"
                      onSelect={() => {}}
                    />
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup label="Actions">
                    <CommandItem
                      icon={Plus}
                      label="Add stock"
                      shortcut="N S"
                      shortcutVariant="text"
                      onSelect={() => {}}
                    />
                    <CommandItem
                      icon={RefreshCw}
                      label="Refresh data"
                      shortcut="⌘ R"
                      shortcutVariant="text"
                      onSelect={() => {}}
                    />
                  </CommandGroup>
                  <CommandEmpty />
                </CommandList>
              </CommandDialog>
            </Command>
          </Preview>
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
                  title: 'Use Command for a global ⌘K palette that works from any page',
                  body: 'Navigation, quick-create actions, account options — heterogeneous commands that are hard to reach from the current page but easy to invoke via keyboard.',
                },
                {
                  title: 'Use it when the action list is long or dynamic and needs filtering',
                  body: 'Power users expect to type and narrow down — if there are 10+ commands, real-time filtering and keyboard navigation make the palette far faster than a menu.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: 'Use Select for choosing a single value from a short, stable list',
                  body: 'Status, category, product type — these are value-pickers, not command dispatchers. Select is simpler and semantically correct for single-value choices.',
                },
                {
                  title: 'Use DropdownMenu for contextual actions tied to a specific element',
                  body: 'Row actions, avatar menus, inline edit controls — these are anchored to an element on the page. Command is for global, context-free actions.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'CommandDialog renders in a portal with focus trapped inside',
                  body: 'Focus stays inside the dialog while it is open. Escape always closes and restores focus to the trigger. Items navigate with ↑ ↓ and select with Enter — no mouse required.',
                },
                {
                  title: 'Always include CommandEmpty — never leave the list silently blank',
                  body: 'CommandEmpty provides a visible "No results" state for both sighted users and screen readers. A blank dialog looks broken and gives users no signal.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title:
                    'Show shortcut hints that actually work — keep palette and global keybinds in sync',
                  body: 'If G I appears as a shortcut hint in the palette, pressing G I anywhere on the page should also open Inventory. Hints that only work inside the palette mislead users.',
                },
                {
                  title:
                    'Separate destructive items with CommandSeparator and place them at the bottom',
                  body: 'Log out, delete — these need visual distance from safe navigation. A separator + bottom placement makes destructive actions intentional, not accidental.',
                },
                {
                  title: 'Keep item labels short and action-oriented',
                  body: '"Add stock", "Open trades" — not "Navigate to the inventory management page". Dense labels defeat the purpose of a power-user tool.',
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
        <SubSection
          title="Command"
          description="Root component. Provides open state + global ⌘K listener."
        >
          <ApiTable
            rows={[
              ['open', 'boolean', '—', 'Controlled open state. Omit for uncontrolled.'],
              [
                'onOpenChange',
                '(open: boolean) => void',
                '—',
                'Called when open state changes — required when using controlled mode.',
              ],
            ]}
          />
        </SubSection>

        <SubSection title="CommandTrigger" description="Button that opens the dialog on click.">
          <ApiTable
            rows={[
              [
                'children',
                'ReactNode',
                '—',
                'Custom trigger content. When omitted, renders a default search button.',
              ],
              [
                'shortcutVariant',
                '"chip" | "text"',
                '"chip"',
                'How the ⌘K hint is displayed — styled kbd chips or plain monospace text.',
              ],
              ['className', 'string', '—', 'Extra classes merged onto the trigger button.'],
            ]}
          />
        </SubSection>

        <SubSection title="CommandInput" description="Controlled search input inside the dialog.">
          <ApiTable
            rows={[
              [
                'placeholder',
                'string',
                '"Type to search…"',
                'Placeholder text shown when the input is empty.',
              ],
            ]}
          />
        </SubSection>

        <SubSection
          title="CommandGroup"
          description="Labeled group of items. Auto-hides when all its children are filtered out."
        >
          <ApiTable
            rows={[
              [
                'label',
                'string',
                '—',
                'Group heading shown above items. Omit for an unlabeled group.',
              ],
            ]}
          />
        </SubSection>

        <SubSection title="CommandItem" description="Individual result row.">
          <ApiTable
            rows={[
              [
                'label',
                'string',
                '—',
                'Display text and filter target. Required for filtering to work.',
              ],
              ['icon', 'LucideIcon', '—', 'Optional leading icon component.'],
              [
                'shortcut',
                'string',
                '—',
                'Keyboard shortcut hint — space-separated tokens: "G I", "⌘ R".',
              ],
              [
                'shortcutVariant',
                '"chip" | "text"',
                '"chip"',
                'How shortcut tokens are displayed. Active keys highlight in violet while held.',
              ],
              [
                'onSelect',
                '() => void',
                '—',
                'Called when the item is clicked or activated via Enter. Dialog closes automatically.',
              ],
            ]}
          />
        </SubSection>
      </Section>

      {/* Usage Examples */}
      <Section title="Usage Examples">
        <SubSection title="Import">
          <Code>{`import {
  Command, CommandTrigger, CommandDialog,
  CommandInput, CommandList, CommandGroup,
  CommandItem, CommandSeparator, CommandEmpty,
} from '@/components/base/Command/Command'`}</Code>
        </SubSection>

        <SubSection title="Uncontrolled (default)">
          <Code>{`<Command>
  <CommandTrigger className="w-64" />   {/* ⌘K also works globally */}
  <CommandDialog>
    <CommandInput placeholder="Search commands…" />
    <CommandList>
      <CommandGroup label="Navigation">
        <CommandItem icon={LayoutDashboard} label="Dashboard" onSelect={() => router.push('/')} />
        <CommandItem icon={Package} label="Inventory" shortcut="G I" onSelect={() => router.push('/inventory')} />
      </CommandGroup>
      <CommandEmpty />
    </CommandList>
  </CommandDialog>
</Command>`}</Code>
        </SubSection>

        <SubSection title="Controlled">
          <Code>{`const [open, setOpen] = useState(false)

<Command open={open} onOpenChange={setOpen}>
  <button onClick={() => setOpen(true)}>Open palette</button>
  <CommandDialog>
    <CommandInput placeholder="Search…" />
    <CommandList>
      <CommandItem label="Dashboard" onSelect={() => { router.push('/'); setOpen(false) }} />
      <CommandEmpty />
    </CommandList>
  </CommandDialog>
</Command>`}</Code>
        </SubSection>

        <SubSection title="Text shortcut variant">
          <Code>{`{/* trigger shows ⌘K as plain text */}
<CommandTrigger className="w-64" shortcutVariant="text" />

{/* items show shortcut as plain text with letter-spacing */}
<CommandItem
  icon={Package}
  label="Inventory"
  shortcut="G I"
  shortcutVariant="text"
  onSelect={() => {}}
/>`}</Code>
        </SubSection>
      </Section>
    </div>
  ),
}
