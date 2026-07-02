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

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Press{' '}
        <kbd className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
          ⌘K
        </kbd>{' '}
        or click the trigger to open. Type to filter items in real time.{' '}
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

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">default trigger</span>
        <Command>
          <CommandTrigger className="w-64" />
          <CommandDialog>
            <CommandInput placeholder="Search commands…" />
            <CommandList>
              <CommandItem
                icon={LayoutDashboard}
                label="Dashboard"
                onSelect={() => alert('Dashboard')}
              />
              <CommandItem icon={Package} label="Inventory" onSelect={() => alert('Inventory')} />
              <CommandItem icon={TrendingUp} label="Trades" onSelect={() => alert('Trades')} />
              <CommandItem icon={Settings} label="Settings" onSelect={() => alert('Settings')} />
              <CommandItem icon={LogOut} label="Log out" onSelect={() => alert('Log out')} />
              <CommandEmpty />
            </CommandList>
          </CommandDialog>
        </Command>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">custom trigger</span>
        <Command>
          <CommandTrigger className="w-64 justify-between">
            <span>Open palette</span>
            <kbd className="text-[10px] font-mono bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-gray-400">
              ⌘K
            </kbd>
          </CommandTrigger>
          <CommandDialog>
            <CommandInput placeholder="What do you need?" />
            <CommandList>
              <CommandItem icon={LayoutDashboard} label="Dashboard" onSelect={() => {}} />
              <CommandItem icon={Package} label="Inventory" onSelect={() => {}} />
              <CommandItem icon={TrendingUp} label="Trades" onSelect={() => {}} />
              <CommandEmpty />
            </CommandList>
          </CommandDialog>
        </Command>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<Command>
  <CommandTrigger className="w-64" />   {/* ⌘K also works globally */}
  <CommandDialog>
    <CommandInput placeholder="Search commands…" />
    <CommandList>
      <CommandItem icon={LayoutDashboard} label="Dashboard" onSelect={() => router.push('/')} />
      <CommandItem icon={Package}         label="Inventory"  onSelect={() => router.push('/inventory')} />
      <CommandItem icon={TrendingUp}      label="Trades"     onSelect={() => router.push('/trades')} />
      <CommandEmpty />
    </CommandList>
  </CommandDialog>
</Command>`}</code>
      </pre>
    </div>
  ),
}
