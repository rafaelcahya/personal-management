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
const meta = { title: 'Command/With Shortcuts' }
export default meta

export const WithShortcuts = {
  name: 'With Shortcuts',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Pass a <code className="font-mono bg-gray-100 px-1 rounded text-xs">shortcut</code> string
        to <code className="font-mono bg-gray-100 px-1 rounded text-xs">CommandItem</code>.
        Space-separated tokens render as individual{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">&lt;kbd&gt;</code> chips on the
        right side of the row.
      </p>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">items with keyboard shortcut hints</span>
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
                <CommandItem icon={Package} label="Inventory" shortcut="G I" onSelect={() => {}} />
                <CommandItem icon={TrendingUp} label="Trades" shortcut="G T" onSelect={() => {}} />
                <CommandItem icon={Settings} label="Settings" shortcut="G S" onSelect={() => {}} />
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

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
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
