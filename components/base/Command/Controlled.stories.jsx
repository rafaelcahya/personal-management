import { useState } from 'react'
import { LayoutDashboard, Package, TrendingUp, Settings, Keyboard } from 'lucide-react'
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandEmpty,
} from './Command'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Command/Controlled' }
export default meta

function ControlledDemo() {
  const [open, setOpen] = useState(false)
  const [lastAction, setLastAction] = useState(null)

  function select(label) {
    setLastAction(label)
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors"
        >
          Open palette
        </button>
        <button
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors"
        >
          Close
        </button>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Keyboard className="size-3.5" />
          <span>or press ⌘K</span>
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg min-h-[40px]">
        {lastAction ? (
          <p className="text-sm text-gray-700">
            Selected: <span className="font-medium text-violet-600">{lastAction}</span>
          </p>
        ) : (
          <p className="text-sm text-gray-400">No action selected yet</p>
        )}
      </div>

      <Command open={open} onOpenChange={setOpen}>
        <CommandDialog>
          <CommandInput placeholder="Search commands…" />
          <CommandList>
            <CommandGroup label="Navigation">
              <CommandItem
                icon={LayoutDashboard}
                label="Dashboard"
                shortcut="G H"
                onSelect={() => select('Dashboard')}
              />
              <CommandItem
                icon={Package}
                label="Inventory"
                shortcut="G I"
                onSelect={() => select('Inventory')}
              />
              <CommandItem
                icon={TrendingUp}
                label="Trades"
                shortcut="G T"
                onSelect={() => select('Trades')}
              />
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup label="Account">
              <CommandItem icon={Settings} label="Settings" onSelect={() => select('Settings')} />
            </CommandGroup>
            <CommandEmpty />
          </CommandList>
        </CommandDialog>
      </Command>
    </div>
  )
}

export const Controlled = {
  name: 'Controlled',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">open</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onOpenChange</code> to control
        the palette from outside. You can skip{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">CommandTrigger</code> and use
        your own button — the global ⌘K shortcut still works.
      </p>

      <ControlledDemo />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`const [open, setOpen] = useState(false)

{/* Your own trigger */}
<button onClick={() => setOpen(true)}>Open palette</button>

{/* Controlled Command — no CommandTrigger needed */}
<Command open={open} onOpenChange={setOpen}>
  <CommandDialog>
    <CommandInput placeholder="Search commands…" />
    <CommandList>
      <CommandGroup label="Navigation">
        <CommandItem
          icon={LayoutDashboard}
          label="Dashboard"
          shortcut="G H"
          onSelect={() => { router.push('/'); setOpen(false) }}
        />
      </CommandGroup>
      <CommandEmpty />
    </CommandList>
  </CommandDialog>
</Command>`}</code>
      </pre>
    </div>
  ),
}
