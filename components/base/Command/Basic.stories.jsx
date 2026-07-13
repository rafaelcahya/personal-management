import { LayoutDashboard, Package, TrendingUp, Settings, LogOut } from 'lucide-react'
import {
  Command,
  CommandTrigger,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from './Command'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Command/Basic' }
export default meta

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full max-w-2xl">
    {items.map(({ heading, cards }) => (
      <div key={heading}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {heading}
        </p>
        <div className="flex flex-col gap-3">
          {cards.map(({ title, body }) => (
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
)

export const WithoutChip = {
  name: 'Without Chip',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          shortcutVariant=&quot;text&quot;
        </code>{' '}
        to show the shortcut as plain text instead of styled chips. The shortcut hint is still
        visible but takes less visual weight — useful when the trigger appears in a compact or
        low-emphasis context.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          shortcutVariant=&quot;text&quot; — plain ⌘K label
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <Command>
            <CommandTrigger className="w-64" shortcutVariant="text" />
            <CommandDialog>
              <CommandInput placeholder="Search commands…" />
              <CommandList>
                <CommandItem icon={LayoutDashboard} label="Dashboard" onSelect={() => {}} />
                <CommandItem icon={Package} label="Inventory" onSelect={() => {}} />
                <CommandItem icon={TrendingUp} label="Trades" onSelect={() => {}} />
                <CommandItem icon={Settings} label="Settings" onSelect={() => {}} />
                <CommandItem icon={LogOut} label="Log out" onSelect={() => {}} />
                <CommandEmpty />
              </CommandList>
            </CommandDialog>
          </Command>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use text variant in compact or low-emphasis contexts',
                body: 'Sidebars, toolbars, and secondary nav areas benefit from text variant — chip borders add visual noise in areas where the trigger is not the focal point.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use text variant in the main app header",
                body: 'Chip variant is visually distinct and passively teaches users the shortcut. In the header where the trigger is prominent, chip styling is the right choice.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The ⌘K shortcut is always active regardless of shortcutVariant',
                body: 'shortcutVariant only controls how the hint looks — not the behavior. Both chip and text modes trigger the same global keyboard listener.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Be consistent — pick one variant per palette and apply it throughout',
                body: "Don't mix chip and text variants across items in the same dialog. Pick the right variant for the context and use it for both CommandTrigger and CommandItem.",
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Command>
  <CommandTrigger className="w-64" shortcutVariant="text" />
  <CommandDialog>
    <CommandInput placeholder="Search commands…" />
    <CommandList>
      <CommandItem icon={LayoutDashboard} label="Dashboard" onSelect={() => {}} />
      <CommandEmpty />
    </CommandList>
  </CommandDialog>
</Command>`}</code>
      </pre>
    </div>
  ),
}

export const WithChip = {
  name: 'With Chip',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Default behavior — shortcut hint renders as two separate{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">&lt;kbd&gt;</code> chips. Press{' '}
        <kbd className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
          ⌘
        </kbd>{' '}
        <kbd className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
          K
        </kbd>{' '}
        or click the trigger to open. Use{' '}
        <kbd className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
          ↑
        </kbd>{' '}
        /{' '}
        <kbd className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
          ↓
        </kbd>{' '}
        to navigate,{' '}
        <kbd className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
          Enter
        </kbd>{' '}
        to select,{' '}
        <kbd className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
          Esc
        </kbd>{' '}
        to close.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          shortcutVariant=&quot;chip&quot; (default) — each key as a kbd chip
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <Command>
            <CommandTrigger className="w-64" />
            <CommandDialog>
              <CommandInput placeholder="Search commands…" />
              <CommandList>
                <CommandItem icon={LayoutDashboard} label="Dashboard" onSelect={() => {}} />
                <CommandItem icon={Package} label="Inventory" onSelect={() => {}} />
                <CommandItem icon={TrendingUp} label="Trades" onSelect={() => {}} />
                <CommandItem icon={Settings} label="Settings" onSelect={() => {}} />
                <CommandItem icon={LogOut} label="Log out" onSelect={() => {}} />
                <CommandEmpty />
              </CommandList>
            </CommandDialog>
          </Command>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use chip variant (default) in the main header or global search bar',
                body: 'Chip styling is visually distinct and passively teaches users the ⌘K shortcut. In prominent positions where the trigger draws the eye, chip is the right choice.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use chip in compact or secondary areas",
                body: 'Chip borders compete with surrounding UI in sidebars and toolbars. Use text variant instead when the trigger is not the focal point of the area.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always include CommandEmpty inside CommandList',
                body: 'Omitting CommandEmpty leaves the dialog visually blank when no items match the query — which looks broken. It shows automatically on no match and requires no extra logic.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep item labels short and action-oriented',
                body: '"Dashboard", "Add stock", "Log out" — not "Navigate to the inventory management page". Dense labels reduce the usefulness of a power-user tool.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* shortcutVariant defaults to "chip" */}
<Command>
  <CommandTrigger className="w-64" />
  <CommandDialog>
    <CommandInput placeholder="Search commands…" />
    <CommandList>
      <CommandItem icon={LayoutDashboard} label="Dashboard" onSelect={() => router.push('/')} />
      <CommandItem icon={Package}         label="Inventory"  onSelect={() => router.push('/inventory')} />
      <CommandEmpty />
    </CommandList>
  </CommandDialog>
</Command>`}</code>
      </pre>
    </div>
  ),
}
