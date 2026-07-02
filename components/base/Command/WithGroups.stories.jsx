import {
  LayoutDashboard,
  Package,
  TrendingUp,
  BarChart2,
  Settings,
  User,
  Bell,
  LogOut,
  FileText,
  HelpCircle,
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
const meta = { title: 'Command/With Groups' }
export default meta

export const WithGroups = {
  name: 'With Groups',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">CommandGroup</code> to
        organize items under labeled sections.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">CommandSeparator</code> adds a
        visual divider. When you filter, groups with no matching items disappear automatically.
      </p>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">
          grouped — type "set" to see Settings group persist while others collapse
        </span>
        <Command>
          <CommandTrigger className="w-64" />
          <CommandDialog>
            <CommandInput placeholder="Search…" />
            <CommandList>
              <CommandGroup label="Navigation">
                <CommandItem icon={LayoutDashboard} label="Dashboard" onSelect={() => {}} />
                <CommandItem icon={Package} label="Inventory" onSelect={() => {}} />
                <CommandItem icon={TrendingUp} label="Trades" onSelect={() => {}} />
                <CommandItem icon={BarChart2} label="Analytics" onSelect={() => {}} />
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup label="Settings">
                <CommandItem icon={User} label="Profile" onSelect={() => {}} />
                <CommandItem icon={Bell} label="Notifications" onSelect={() => {}} />
                <CommandItem icon={Settings} label="Preferences" onSelect={() => {}} />
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup label="Help">
                <CommandItem icon={FileText} label="Documentation" onSelect={() => {}} />
                <CommandItem icon={HelpCircle} label="Support" onSelect={() => {}} />
              </CommandGroup>
              <CommandEmpty />
            </CommandList>
          </CommandDialog>
        </Command>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">unlabeled group — no group heading</span>
        <Command>
          <CommandTrigger className="w-64" />
          <CommandDialog>
            <CommandInput placeholder="Search…" />
            <CommandList>
              <CommandGroup>
                <CommandItem icon={LayoutDashboard} label="Dashboard" onSelect={() => {}} />
                <CommandItem icon={Package} label="Inventory" onSelect={() => {}} />
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem icon={LogOut} label="Log out" onSelect={() => {}} />
              </CommandGroup>
              <CommandEmpty />
            </CommandList>
          </CommandDialog>
        </Command>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<Command>
  <CommandTrigger />
  <CommandDialog>
    <CommandInput placeholder="Search…" />
    <CommandList>
      <CommandGroup label="Navigation">
        <CommandItem icon={LayoutDashboard} label="Dashboard" onSelect={() => {}} />
        <CommandItem icon={Package}         label="Inventory"  onSelect={() => {}} />
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup label="Account">
        <CommandItem icon={Settings} label="Settings" onSelect={() => {}} />
        <CommandItem icon={LogOut}   label="Log out"  onSelect={() => {}} />
      </CommandGroup>
      <CommandEmpty />
    </CommandList>
  </CommandDialog>
</Command>`}</code>
      </pre>
    </div>
  ),
}
