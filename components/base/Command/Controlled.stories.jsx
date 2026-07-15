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
          <span className="flex items-center gap-1">
            or press
            <kbd className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
              ⌘
            </kbd>
            <kbd className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
              K
            </kbd>
          </span>
        </div>
      </div>

      <div className="px-4 py-3 bg-white border border-gray-200 rounded-lg min-h-[40px]">
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
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">open</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onOpenChange</code> to control
        the palette from outside. You can skip{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">CommandTrigger</code> and use
        your own button — the global ⌘K shortcut still works.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          controlled — open/close state managed externally
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <ControlledDemo />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use controlled mode when open state is driven by external logic',
                body: 'Opening the palette after a route change, closing it after a successful action, or syncing it with a URL param — controlled mode gives you full control from outside the component.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'For standard use, uncontrolled mode is simpler',
                body: 'If you just need a ⌘K palette with a trigger button and no external open state management, skip open/onOpenChange — uncontrolled mode handles everything automatically.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The global ⌘K shortcut still fires without CommandTrigger',
                body: 'In controlled mode without CommandTrigger, ⌘K calls onOpenChange(true) directly on the Command root. Focus management and Escape behavior work the same as uncontrolled.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always call setOpen(false) inside onSelect in controlled mode',
                body: "The dialog won't close automatically in controlled mode — you own the open state. Call setOpen(false) in each onSelect callback to close the palette after selection.",
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
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
