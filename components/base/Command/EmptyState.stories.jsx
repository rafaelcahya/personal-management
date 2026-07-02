import { LayoutDashboard, Package, TrendingUp, SearchX } from 'lucide-react'
import {
  Command,
  CommandTrigger,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from './Command'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Command/Empty State' }
export default meta

export const EmptyState = {
  name: 'Empty State',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">CommandEmpty</code> renders
        automatically when no items match the current query. Type something with no match to see it
        appear. Pass custom content or leave empty for the default "No results found." message.
      </p>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">default empty — type "xyz" to trigger</span>
        <Command>
          <CommandTrigger className="w-64" />
          <CommandDialog>
            <CommandInput placeholder="Search…" />
            <CommandList>
              <CommandGroup label="Navigation">
                <CommandItem icon={LayoutDashboard} label="Dashboard" onSelect={() => {}} />
                <CommandItem icon={Package} label="Inventory" onSelect={() => {}} />
                <CommandItem icon={TrendingUp} label="Trades" onSelect={() => {}} />
              </CommandGroup>
              <CommandEmpty />
            </CommandList>
          </CommandDialog>
        </Command>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">custom empty — with icon and description</span>
        <Command>
          <CommandTrigger className="w-64" />
          <CommandDialog>
            <CommandInput placeholder="Search…" />
            <CommandList>
              <CommandGroup label="Navigation">
                <CommandItem icon={LayoutDashboard} label="Dashboard" onSelect={() => {}} />
                <CommandItem icon={Package} label="Inventory" onSelect={() => {}} />
                <CommandItem icon={TrendingUp} label="Trades" onSelect={() => {}} />
              </CommandGroup>
              <CommandEmpty>
                <div className="flex flex-col items-center gap-2">
                  <SearchX className="size-8 text-gray-300" />
                  <p className="text-sm text-gray-400 font-medium">Nothing found</p>
                  <p className="text-xs text-gray-400">Try a different search term</p>
                </div>
              </CommandEmpty>
            </CommandList>
          </CommandDialog>
        </Command>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* Default message */}
<CommandEmpty />

{/* Custom content */}
<CommandEmpty>
  <div className="flex flex-col items-center gap-2">
    <SearchX className="size-8 text-gray-300" />
    <p className="text-sm font-medium text-gray-400">Nothing found</p>
    <p className="text-xs text-gray-400">Try a different search term</p>
  </div>
</CommandEmpty>`}</code>
      </pre>
    </div>
  ),
}
