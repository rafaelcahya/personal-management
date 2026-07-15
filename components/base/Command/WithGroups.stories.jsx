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

export const Labeled = {
  name: 'Labeled Groups',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass a <code className="font-mono bg-gray-100 px-1 rounded text-xs">label</code> prop to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">CommandGroup</code> to add a
        section heading. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">CommandSeparator</code> between
        groups for visual breathing room. When filtering, groups with no matching items disappear
        automatically — type <code className="font-mono bg-gray-100 px-1 rounded text-xs">set</code>{' '}
        to see Settings persist while others collapse.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">labeled groups — type to filter per group</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
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
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use labeled groups when actions fall into distinct semantic categories',
                body: 'Navigation, Actions, Account, Help — labels help users scan and understand the palette structure at a glance, especially when there are 6+ items.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't label groups by technical origin",
                body: 'Avoid "API items" or "DB actions" — users think in terms of tasks, not data sources. Labels should reflect what users are trying to do, not where the data comes from.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Groups auto-hide when all their items are filtered out',
                body: 'No need to manage group visibility manually — CommandGroup handles it. Type to filter and watch groups with no matching items disappear automatically.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep each group to 3–5 items; use CommandSeparator between groups',
                body: 'Long groups defeat the purpose of filtering. Use CommandSeparator for visual breathing room — even unlabeled groups benefit from separator spacing next to labeled ones.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<CommandList>
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
</CommandList>`}</code>
      </pre>
    </div>
  ),
}

export const Unlabeled = {
  name: 'Unlabeled Groups',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Omit the <code className="font-mono bg-gray-100 px-1 rounded text-xs">label</code> prop to
        create a group with no heading. Use this when the grouping is structural (e.g. separating
        destructive actions) rather than categorical — the items speak for themselves.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">unlabeled groups — structural separation only</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <Command>
            <CommandTrigger className="w-64" />
            <CommandDialog>
              <CommandInput placeholder="Search…" />
              <CommandList>
                <CommandGroup>
                  <CommandItem icon={LayoutDashboard} label="Dashboard" onSelect={() => {}} />
                  <CommandItem icon={Package} label="Inventory" onSelect={() => {}} />
                  <CommandItem icon={TrendingUp} label="Trades" onSelect={() => {}} />
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem icon={Settings} label="Settings" onSelect={() => {}} />
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
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use unlabeled groups for structural separation, not categorization',
                body: 'Isolating "Log out" at the bottom via a separator is clearer than labeling a group "Session". Use unlabeled when the items speak for themselves.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't mix labeled and unlabeled groups in the same palette",
                body: 'Mixing creates inconsistent visual rhythm — the palette looks unfinished. Pick one style and apply it throughout all groups.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always pair unlabeled groups with a CommandSeparator above them',
                body: 'Without a separator, unlabeled groups merge visually with adjacent items — users cannot tell where one group ends and another begins.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Unlabeled groups work best when items are self-explanatory and few',
                body: 'If users need context to understand why items are grouped, add a label. Unlabeled groups are a structural tool — not a way to avoid naming things.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* no label prop — group is structural, not categorical */}
<CommandGroup>
  <CommandItem icon={LayoutDashboard} label="Dashboard" onSelect={() => {}} />
  <CommandItem icon={Package}         label="Inventory"  onSelect={() => {}} />
</CommandGroup>
<CommandSeparator />
<CommandGroup>
  <CommandItem icon={LogOut} label="Log out" onSelect={() => {}} />
</CommandGroup>`}</code>
      </pre>
    </div>
  ),
}
