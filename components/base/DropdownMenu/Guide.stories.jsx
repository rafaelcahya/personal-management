import { useState } from 'react'
import { Download, FileText, LogOut, Settings, Share2, Trash2, User } from 'lucide-react'
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

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-3xl py-6 px-2">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">DropdownMenu</h1>
        <p className="text-base text-gray-500 leading-relaxed">
          A dropdown menu built from scratch. Supports click and hover triggers, auto-positioning
          via viewport flip, nested submenus, keyboard navigation, checkbox items, and radio groups.
        </p>
      </div>

      {/* Overview */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Overview</h2>
        <OverviewDemo />
        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
          <code>{`import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuGroup, DropdownMenuSeparator,
  DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent,
} from '@/components/base/DropdownMenu/DropdownMenu'

<DropdownMenu trigger="click">
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
</DropdownMenu>`}</code>
        </pre>
      </section>

      {/* Anatomy */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Anatomy</h2>
        <pre className="bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 text-xs text-gray-700 leading-relaxed overflow-x-auto">
          <code>{`DropdownMenu                    ← open state + trigger mode
├── DropdownMenuTrigger         ← click or hover to open
└── DropdownMenuContent         ← Portal, auto-positioned
    ├── DropdownMenuGroup (label?)
    │   ├── DropdownMenuItem    ← icon + label + shortcut
    │   └── DropdownMenuSeparator
    ├── DropdownMenuCheckboxItem
    ├── DropdownMenuRadioGroup
    │   └── DropdownMenuRadioItem
    └── DropdownMenuSub
        ├── DropdownMenuSubTrigger   ← label + chevron →
        └── DropdownMenuSubContent   ← nested panel`}</code>
        </pre>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-52">
                Part
              </th>
              <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
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
              ['DropdownMenuItem', 'Basic clickable item with optional icon, label, and shortcut.'],
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
                'Submenu floating panel — positioned to the right by default, flips left near edge.',
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

      {/* Keyboard navigation */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Keyboard Navigation</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-36">
                Key
              </th>
              <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              ['↑ / ↓', 'Navigate between focusable items. Wraps around. Skips disabled items.'],
              ['→', 'Open submenu and focus its first item (when on a SubTrigger).'],
              ['←', 'Close submenu and return focus to the SubTrigger.'],
              ['Enter / Space', 'Trigger the focused item (calls onSelect or toggles state).'],
              ['Escape', 'Close the current menu level. In a submenu, closes only the submenu.'],
              ['Tab', 'Close the entire dropdown and move browser focus out.'],
            ].map(([key, action]) => (
              <tr key={key}>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">{key}</td>
                <td className="py-2.5 text-xs text-gray-600">{action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Auto-positioning */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Auto-positioning</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">DropdownMenuContent</code>{' '}
          uses{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">
            getBoundingClientRect()
          </code>{' '}
          to position after render. Default placement is <strong>bottom-start</strong> (below the
          trigger, left-aligned). Automatically flips:
        </p>
        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 pl-1">
          <li>
            <strong>Vertical:</strong> flips above the trigger if insufficient space below
          </li>
          <li>
            <strong>Horizontal:</strong> right-aligns if content would overflow the viewport right
            edge
          </li>
          <li>
            <strong>Submenu:</strong> opens to the right by default, flips left if near the right
            edge
          </li>
          <li>Recalculates on scroll and resize events</li>
        </ul>
      </section>

      {/* API Reference */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">API Reference</h2>

        {[
          {
            name: 'DropdownMenu',
            props: [
              {
                prop: 'trigger',
                type: '"click" | "hover"',
                def: '"click"',
                desc: 'How the menu is opened.',
              },
              {
                prop: 'children',
                type: 'ReactNode',
                def: '—',
                desc: 'DropdownMenuTrigger + DropdownMenuContent.',
              },
            ],
          },
          {
            name: 'DropdownMenuTrigger',
            props: [
              {
                prop: 'asChild',
                type: 'boolean',
                def: 'false',
                desc: 'Merge trigger props onto the child element instead of wrapping in a span.',
              },
            ],
          },
          {
            name: 'DropdownMenuContent',
            props: [
              {
                prop: 'className',
                type: 'string',
                def: '—',
                desc: 'Additional CSS classes on the floating panel.',
              },
            ],
          },
          {
            name: 'DropdownMenuItem',
            props: [
              {
                prop: 'label',
                type: 'string',
                def: '—',
                desc: 'Item text. Can also use children.',
              },
              {
                prop: 'icon',
                type: 'LucideIcon',
                def: '—',
                desc: 'Optional icon component rendered before the label.',
              },
              {
                prop: 'shortcut',
                type: 'string',
                def: '—',
                desc: 'Display-only keyboard shortcut hint (e.g. "⌘P").',
              },
              {
                prop: 'disabled',
                type: 'boolean',
                def: 'false',
                desc: 'Disables interaction and skips keyboard nav.',
              },
              {
                prop: 'onSelect',
                type: '() => void',
                def: '—',
                desc: 'Called when the item is clicked or activated via keyboard.',
              },
            ],
          },
          {
            name: 'DropdownMenuCheckboxItem',
            props: [
              { prop: 'label', type: 'string', def: '—', desc: 'Item text.' },
              { prop: 'checked', type: 'boolean', def: '—', desc: 'Current checked state.' },
              {
                prop: 'onCheckedChange',
                type: '(checked: boolean) => void',
                def: '—',
                desc: 'Called with the new value when toggled.',
              },
              { prop: 'disabled', type: 'boolean', def: 'false', desc: 'Disables the item.' },
            ],
          },
          {
            name: 'DropdownMenuRadioGroup',
            props: [
              { prop: 'value', type: 'string', def: '—', desc: 'Currently selected radio value.' },
              {
                prop: 'onValueChange',
                type: '(value: string) => void',
                def: '—',
                desc: 'Called when a radio item is selected.',
              },
            ],
          },
          {
            name: 'DropdownMenuRadioItem',
            props: [
              { prop: 'value', type: 'string', def: '—', desc: 'The value this item represents.' },
              { prop: 'label', type: 'string', def: '—', desc: 'Item text.' },
              { prop: 'disabled', type: 'boolean', def: 'false', desc: 'Disables the item.' },
            ],
          },
          {
            name: 'DropdownMenuSubTrigger',
            props: [
              { prop: 'label', type: 'string', def: '—', desc: 'Trigger text.' },
              { prop: 'icon', type: 'LucideIcon', def: '—', desc: 'Optional icon.' },
              {
                prop: 'disabled',
                type: 'boolean',
                def: 'false',
                desc: 'Disables the trigger and prevents submenu from opening.',
              },
            ],
          },
        ].map(({ name, props }) => (
          <div key={name} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-800">{name}</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                    Prop
                  </th>
                  <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                    Type
                  </th>
                  <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                    Default
                  </th>
                  <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {props.map(({ prop, type, def, desc }) => (
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

      {/* Usage */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Usage</h2>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Row actions in a table</span>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Actions
                    </th>
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
                              ···
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
          </div>
        </div>
      </section>
    </div>
  ),
}
