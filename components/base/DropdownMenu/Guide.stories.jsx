import { useState } from 'react'
import {
  Download,
  FileText,
  LogOut,
  MoreHorizontal,
  Settings,
  Share2,
  Trash2,
  User,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './DropdownMenu'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'DropdownMenu' }
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
  <div className="flex flex-col gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3">
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

// ─── Demo helpers ─────────────────────────────────────────────────────────────

function OverviewDemo() {
  const [sidebar, setSidebar] = useState(true)
  const [theme, setTheme] = useState('system')
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="size-4" />
          Settings
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup label="Account">
          <DropdownMenuItem icon={User} label="Profile" shortcut="⌘P" onSelect={() => {}} />
          <DropdownMenuItem icon={Settings} label="Settings" onSelect={() => {}} />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          label="Show sidebar"
          checked={sidebar}
          onCheckedChange={setSidebar}
        />
        <DropdownMenuSeparator />
        <DropdownMenuGroup label="Theme">
          <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
            <DropdownMenuRadioItem value="light" label="Light" />
            <DropdownMenuRadioItem value="dark" label="Dark" />
            <DropdownMenuRadioItem value="system" label="System" />
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={Download} label="Export" />
          <DropdownMenuSubContent>
            <DropdownMenuItem icon={FileText} label="Export as CSV" onSelect={() => {}} />
            <DropdownMenuItem icon={FileText} label="Export as PDF" onSelect={() => {}} />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={LogOut} label="Logout" onSelect={() => {}} />
      </DropdownMenuContent>
    </DropdownMenu>
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
          <h1 className="text-3xl font-bold text-gray-900">DropdownMenu</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A dropdown menu built from scratch. Supports click and hover triggers, auto-positioning
          via viewport flip, nested submenus, keyboard navigation, checkbox items, and radio groups.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          <OverviewDemo />
        </Preview>
        <Code>{`import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuGroup, DropdownMenuSeparator,
  DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent,
} from '@/components/base/DropdownMenu/DropdownMenu'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Settings</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuGroup label="Account">
      <DropdownMenuItem icon={User} label="Profile" shortcut="⌘P" onSelect={() => {}} />
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuCheckboxItem label="Show sidebar" checked={sidebar} onCheckedChange={setSidebar} />
    <DropdownMenuSeparator />
    <DropdownMenuSub>
      <DropdownMenuSubTrigger icon={Download} label="Export" />
      <DropdownMenuSubContent>
        <DropdownMenuItem label="Export as CSV" onSelect={() => {}} />
      </DropdownMenuSubContent>
    </DropdownMenuSub>
    <DropdownMenuSeparator />
    <DropdownMenuItem icon={LogOut} label="Logout" onSelect={() => {}} />
  </DropdownMenuContent>
</DropdownMenu>`}</Code>
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="DropdownMenu is a composite of 12 sub-components. Each piece has a specific role in the open state, layout, and interaction model."
      >
        <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl mb-4 overflow-x-auto">
          <pre className="text-xs text-gray-700 leading-relaxed font-mono whitespace-pre">{`DropdownMenu                    ← open state + trigger mode
├── DropdownMenuTrigger         ← click or hover to open (asChild merges onto child)
└── DropdownMenuContent         ← portal, auto-positioned
    ├── DropdownMenuGroup (label?)
    │   ├── DropdownMenuItem    ← icon + label + shortcut
    │   └── ...
    ├── DropdownMenuSeparator
    ├── DropdownMenuCheckboxItem
    ├── DropdownMenuRadioGroup
    │   └── DropdownMenuRadioItem
    └── DropdownMenuSub
        ├── DropdownMenuSubTrigger   ← label + chevron →
        └── DropdownMenuSubContent   ← nested panel`}</pre>
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Part', 'Description'].map((h) => (
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
                ['DropdownMenu', 'Root provider — manages open state and trigger behavior.'],
                [
                  'DropdownMenuTrigger',
                  'Wraps the trigger element. Use asChild to avoid extra DOM nodes.',
                ],
                [
                  'DropdownMenuContent',
                  'Floating panel rendered via createPortal. Auto-positioned with viewport flip.',
                ],
                [
                  'DropdownMenuItem',
                  'Basic clickable item with optional icon, label, and shortcut.',
                ],
                ['DropdownMenuGroup', 'Groups items under an optional text label.'],
                ['DropdownMenuSeparator', 'Horizontal divider between sections.'],
                [
                  'DropdownMenuCheckboxItem',
                  'Toggle item — controlled via checked + onCheckedChange.',
                ],
                [
                  'DropdownMenuRadioGroup',
                  'Radio container — enforces single selection via value + onValueChange.',
                ],
                [
                  'DropdownMenuRadioItem',
                  'Radio item — belongs to the nearest DropdownMenuRadioGroup.',
                ],
                ['DropdownMenuSub', 'Submenu root — manages sub-open state independently.'],
                ['DropdownMenuSubTrigger', 'Item that opens the submenu on hover or → key.'],
                [
                  'DropdownMenuSubContent',
                  'Submenu floating panel — positions right, flips left near edge.',
                ],
              ].map(([part, desc]) => (
                <tr key={part} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                    {part}
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
                ['↑ / ↓', 'Navigate between focusable items. Wraps around. Skips disabled items.'],
                ['→', 'Open submenu and focus its first item (when on a SubTrigger).'],
                ['←', 'Close submenu and return focus to the SubTrigger.'],
                ['Enter / Space', 'Trigger the focused item (calls onSelect or toggles state).'],
                ['Escape', 'Close the current menu level. In a submenu, closes only the submenu.'],
                ['Tab', 'Close the entire dropdown and move browser focus out.'],
              ].map(([key, action]) => (
                <tr key={key} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-700 whitespace-nowrap">
                    {key}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-600">
                    {action}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Auto-positioning */}
      <Section
        title="Auto-positioning"
        description="DropdownMenuContent uses getBoundingClientRect() to position after render. Default placement is bottom-start (below trigger, left-aligned)."
      >
        <ul className="flex flex-col gap-2 text-sm text-gray-600 list-disc list-inside mb-4">
          <li>
            <strong>Vertical:</strong> flips above the trigger if insufficient space below.
          </li>
          <li>
            <strong>Horizontal:</strong> right-aligns if content would overflow the viewport right
            edge.
          </li>
          <li>
            <strong>Submenu:</strong> opens to the right by default, flips left if near the right
            edge.
          </li>
          <li>Recalculates on scroll and resize events.</li>
        </ul>
      </Section>

      {/* Best Practices */}
      <Section title="Best Practices">
        <div className="flex flex-col gap-8">
          {[
            {
              heading: 'When to use',
              items: [
                {
                  title: 'Use for contextual actions tied to a specific trigger',
                  body: 'Row action buttons (⋯), avatar menus, kebab menus — actions that belong to a specific item on the page. CheckboxItems for toggles, RadioGroup for single-select mode, submenus for grouped sub-actions.',
                },
                {
                  title: 'Use when actions are commands, not value selections',
                  body: 'Edit, Delete, Share, Export — dispatching a command that does something. If the selected value needs to show in the trigger after selection, use Select instead.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: "Don't put form fields, date pickers, or multi-step flows inside",
                  body: "DropdownMenu is not a Popover — menu items don't support arbitrary interactive content. Rich overlay content belongs in a Popover. Confirmation dialogs belong in an AlertDialog after selection.",
                },
                {
                  title: "Don't use hover trigger for primary navigation",
                  body: 'Hover causes accidental opens and is inaccessible on touch devices. Use hover only for desktop menu bars (File / View / Tools) where consecutive menus need quick scanning.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'Always use asChild on DropdownMenuTrigger when wrapping a Button',
                  body: 'Without asChild, DropdownMenuTrigger renders a span wrapper inside the Button — invalid nested interactive elements. aria-expanded and aria-haspopup="menu" are built in; never add them manually.',
                },
                {
                  title: "Keyboard navigation is fully automatic — don't suppress it",
                  body: "↑ ↓ navigate items, Enter/Space select, Escape closes. Disabled items are aria-disabled and skipped automatically. Don't intercept default key behavior inside menu items.",
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: 'Isolate destructive items at the bottom with a separator above',
                  body: 'Delete, Remove, Log out — visual distance from safe actions reduces accidental clicks. Bottom + separator is the standard pattern for irreversible actions.',
                },
                {
                  title: 'Use icons consistently — all items or none',
                  body: 'Mixing icon-bearing and icon-less items creates uneven leading alignment. Pick one approach and apply it throughout the menu. Keep labels short and verb-first: "Edit", "Export as CSV".',
                },
                {
                  title: 'Limit submenu nesting to 2 levels maximum',
                  body: 'A 3-deep submenu is always a sign the information architecture needs flattening — use a separate page or dialog. A submenu that reveals only 1 item should be a flat item instead.',
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

      {/* Shortcut Variants */}
      <Section title="Shortcut Variants">
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">DropdownMenuItem</code>{' '}
          supports a{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">shortcutVariant</code> prop
          to control how shortcut hints are rendered. When a key is held while the menu is open, the
          matching chip or character highlights in violet.
        </p>

        <SubSection
          title="chip (default)"
          description="Each space-separated token renders as an individual <kbd> chip with border and background."
        >
          <Preview>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  icon={Settings}
                  label="Settings"
                  shortcut="⌘ ,"
                  onSelect={() => {}}
                />
                <DropdownMenuItem icon={Trash2} label="Delete" shortcut="⌫" onSelect={() => {}} />
                <DropdownMenuItem icon={LogOut} label="Logout" shortcut="⌘ Q" onSelect={() => {}} />
              </DropdownMenuContent>
            </DropdownMenu>
          </Preview>
        </SubSection>

        <SubSection
          title="text"
          description="Shortcut renders as plain monospace text with letter-spacing — less visual weight for compact menus."
        >
          <Preview>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  icon={Settings}
                  label="Settings"
                  shortcut="⌘ ,"
                  shortcutVariant="text"
                  onSelect={() => {}}
                />
                <DropdownMenuItem
                  icon={Trash2}
                  label="Delete"
                  shortcut="⌫"
                  shortcutVariant="text"
                  onSelect={() => {}}
                />
                <DropdownMenuItem
                  icon={LogOut}
                  label="Logout"
                  shortcut="⌘ Q"
                  shortcutVariant="text"
                  onSelect={() => {}}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </Preview>
        </SubSection>
      </Section>

      {/* API Reference */}
      <Section title="API Reference">
        {[
          {
            name: 'DropdownMenu',
            desc: 'Root context provider. Manages open state and trigger behavior.',
            rows: [
              ['trigger', '"click" | "hover"', '"click"', 'How the menu is opened.'],
              ['children', 'ReactNode', '—', 'DropdownMenuTrigger + DropdownMenuContent.'],
            ],
          },
          {
            name: 'DropdownMenuTrigger',
            desc: 'Wraps the trigger element.',
            rows: [
              [
                'asChild',
                'boolean',
                'false',
                'Merge trigger props onto the child element instead of wrapping in a span.',
              ],
            ],
          },
          {
            name: 'DropdownMenuContent',
            desc: 'Floating panel rendered via createPortal.',
            rows: [['className', 'string', '—', 'Additional CSS classes on the floating panel.']],
          },
          {
            name: 'DropdownMenuItem',
            desc: 'Basic clickable item.',
            rows: [
              ['label', 'string', '—', 'Item text. Can also use children.'],
              ['icon', 'LucideIcon', '—', 'Optional icon component rendered before the label.'],
              [
                'shortcut',
                'string',
                '—',
                'Keyboard shortcut hint — space-separated tokens: "⌘ D", "F2". Display-only.',
              ],
              [
                'shortcutVariant',
                '"chip" | "text"',
                '"chip"',
                'How shortcut tokens are displayed. Active keys highlight in violet while held.',
              ],
              ['disabled', 'boolean', 'false', 'Disables interaction and skips keyboard nav.'],
              [
                'onSelect',
                '() => void',
                '—',
                'Called when the item is clicked or activated via keyboard.',
              ],
            ],
          },
          {
            name: 'DropdownMenuCheckboxItem',
            desc: 'Toggle item — controlled.',
            rows: [
              ['label', 'string', '—', 'Item text.'],
              ['checked', 'boolean', '—', 'Current checked state.'],
              [
                'onCheckedChange',
                '(checked: boolean) => void',
                '—',
                'Called with the new value when toggled.',
              ],
              ['disabled', 'boolean', 'false', 'Disables the item.'],
            ],
          },
          {
            name: 'DropdownMenuRadioGroup',
            desc: 'Radio container — enforces single selection.',
            rows: [
              ['value', 'string', '—', 'Currently selected radio value.'],
              [
                'onValueChange',
                '(value: string) => void',
                '—',
                'Called when a radio item is selected.',
              ],
            ],
          },
          {
            name: 'DropdownMenuRadioItem',
            desc: 'Radio item — belongs to nearest DropdownMenuRadioGroup.',
            rows: [
              ['value', 'string', '—', 'The value this item represents.'],
              ['label', 'string', '—', 'Item text.'],
              ['disabled', 'boolean', 'false', 'Disables the item.'],
            ],
          },
          {
            name: 'DropdownMenuSubTrigger',
            desc: 'Item that opens the submenu on hover or → key.',
            rows: [
              ['label', 'string', '—', 'Trigger text.'],
              ['icon', 'LucideIcon', '—', 'Optional icon.'],
              [
                'disabled',
                'boolean',
                'false',
                'Disables the trigger and prevents submenu from opening.',
              ],
            ],
          },
        ].map(({ name, desc, rows }) => (
          <SubSection key={name} title={name} description={desc}>
            <div className="overflow-x-auto mb-2">
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
                  {rows.map(([prop, type, def, d]) => (
                    <tr key={prop} className="even:bg-gray-50">
                      <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                        {prop}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
                        {type}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
                        {def}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                        {d}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SubSection>
        ))}
      </Section>

      {/* Usage Examples */}
      <Section title="Usage Examples" description="Copy-ready patterns for common scenarios.">
        <SubSection title="Row actions in a table">
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Product', 'Stock', 'Actions'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide ${i === 2 ? 'text-right' : 'text-left'}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {['iPhone 15', 'AirPods Pro', 'MacBook Air'].map((product, i) => (
                  <tr key={product}>
                    <td className="px-4 py-3 text-gray-800">{product}</td>
                    <td className="px-4 py-3 text-gray-500">{(i + 1) * 4} units</td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem label="Edit" onSelect={() => {}} />
                          <DropdownMenuItem label="Duplicate" onSelect={() => {}} />
                          <DropdownMenuSeparator />
                          <DropdownMenuItem icon={Trash2} label="Delete" onSelect={() => {}} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Code>{`<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm">
      <MoreHorizontal className="size-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem label="Edit" onSelect={handleEdit} />
    <DropdownMenuItem label="Duplicate" onSelect={handleDuplicate} />
    <DropdownMenuSeparator />
    <DropdownMenuItem icon={Trash2} label="Delete" onSelect={handleDelete} />
  </DropdownMenuContent>
</DropdownMenu>`}</Code>
        </SubSection>
      </Section>
    </div>
  ),
}
