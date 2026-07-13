import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Settings,
  Search,
  Plus,
  RefreshCw,
  Moon,
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
const meta = { title: 'Command/Shortcuts' }
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

export const WithChip = {
  name: 'With Chip',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass a <code className="font-mono bg-gray-100 px-1 rounded text-xs">shortcut</code> string
        to <code className="font-mono bg-gray-100 px-1 rounded text-xs">CommandItem</code>.
        Space-separated tokens render as individual{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">&lt;kbd&gt;</code> chips on the
        right side of the row.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">items with keyboard shortcut hints</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <Command>
            <CommandTrigger className="w-64" />
            <CommandDialog>
              <CommandInput placeholder="Search commands…" />
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
                  <CommandItem
                    icon={Settings}
                    label="Settings"
                    shortcut="G S"
                    onSelect={() => {}}
                  />
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup label="Actions">
                  <CommandItem icon={Plus} label="New trade" shortcut="N T" onSelect={() => {}} />
                  <CommandItem icon={Plus} label="Add stock" shortcut="N S" onSelect={() => {}} />
                  <CommandItem
                    icon={Search}
                    label="Search inventory"
                    shortcut="/ I"
                    onSelect={() => {}}
                  />
                  <CommandItem
                    icon={RefreshCw}
                    label="Refresh data"
                    shortcut="⌘ R"
                    onSelect={() => {}}
                  />
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup label="Appearance">
                  <CommandItem
                    icon={Moon}
                    label="Toggle dark mode"
                    shortcut="⌘ D"
                    onSelect={() => {}}
                  />
                </CommandGroup>
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
                title: 'Show shortcut hints for frequently-used actions only',
                body: "G I for Inventory, ⌘ R for Refresh — shortcuts that users will reach often enough to memorize. Items users visit once a month don't need a shortcut hint.",
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't show shortcuts for rarely-used items",
                body: 'Shortcut hints on infrequent actions add visual noise without helping. Every extra chip competes for attention — reserve them for high-frequency commands.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Keep shortcuts consistent with your global keybindings',
                body: 'If G I is shown as a shortcut in the palette, pressing G then I anywhere on the page should also work. Showing a shortcut that only works inside the palette is misleading.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use space-separated tokens to express multi-key sequences',
                body: 'shortcut="G H" renders two chips (G then H); shortcut="⌘ R" renders ⌘ and R. Each space-separated token becomes its own kbd chip on the right side of the row.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* shortcut is space-separated — each token becomes a <kbd> chip */}
<CommandItem
  icon={LayoutDashboard}
  label="Dashboard"
  shortcut="G H"           {/* renders two chips: G and H */}
  onSelect={() => router.push('/')}
/>

<CommandItem
  icon={RefreshCw}
  label="Refresh data"
  shortcut="⌘ R"           {/* renders two chips: ⌘ and R */}
  onSelect={refetch}
/>`}</code>
      </pre>
    </div>
  ),
}

export const WithoutChip = {
  name: 'Without Chip',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          shortcutVariant=&quot;text&quot;
        </code>{' '}
        to <code className="font-mono bg-gray-100 px-1 rounded text-xs">CommandItem</code> to show
        the shortcut key as plain text instead of styled{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">&lt;kbd&gt;</code> chips. The
        key label is still visible but takes less visual weight.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          shortcutVariant=&quot;text&quot; — key label as plain text
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <Command>
            <CommandTrigger className="w-64" shortcutVariant="text" />
            <CommandDialog>
              <CommandInput placeholder="Search commands…" />
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
                  <CommandItem
                    icon={Settings}
                    label="Settings"
                    shortcut="G S"
                    shortcutVariant="text"
                    onSelect={() => {}}
                  />
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup label="Actions">
                  <CommandItem
                    icon={Plus}
                    label="New trade"
                    shortcut="N T"
                    shortcutVariant="text"
                    onSelect={() => {}}
                  />
                  <CommandItem
                    icon={Plus}
                    label="Add stock"
                    shortcut="N S"
                    shortcutVariant="text"
                    onSelect={() => {}}
                  />
                  <CommandItem
                    icon={Search}
                    label="Search inventory"
                    shortcut="/ I"
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
                <CommandSeparator />
                <CommandGroup label="Appearance">
                  <CommandItem
                    icon={Moon}
                    label="Toggle dark mode"
                    shortcut="⌘ D"
                    shortcutVariant="text"
                    onSelect={() => {}}
                  />
                </CommandGroup>
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
                title: 'Use text variant when the palette is dense and chip borders add noise',
                body: 'When items have long labels or many shortcuts, text mode keeps key hints readable without competing with icons and labels for visual weight.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't mix chip and text variants across items in the same dialog",
                body: 'Mixing creates visual inconsistency — some items look more prominent than others for no reason. Pick one shortcutVariant and apply it to all items in the palette.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Active key highlight still works in text variant',
                body: 'When a key is held down, matching shortcuts light up in violet in both chip and text modes. The visual feedback works regardless of which variant is used.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Apply shortcutVariant="text" to both CommandTrigger and CommandItem',
                body: 'For a consistent look, set shortcutVariant on both the trigger and items. The trigger shows ⌘K as plain text; items show their shortcut tokens as plain text.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<CommandItem
  icon={LayoutDashboard}
  label="Dashboard"
  shortcut="G H"
  shortcutVariant="text"
  onSelect={() => {}}
/>`}</code>
      </pre>
    </div>
  ),
}
