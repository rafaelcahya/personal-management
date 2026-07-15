import { BarChart2, Home, Package, Settings, TrendingUp } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarTrigger,
} from './Sidebar'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Sidebar/Basic',
}

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

const bpItems = [
  {
    heading: 'When to use',
    cards: [
      {
        title: 'Always give every SidebarItem an icon',
        body: 'In collapsed mode only the icon is visible to sighted users. Items without icons become invisible — they have no clickable surface at 56px width.',
      },
      {
        title: 'Group related items with SidebarGroup and a descriptive label',
        body: 'Labels help users scan a long nav list. They collapse to zero height automatically when the sidebar is in icon-only mode — no extra handling needed.',
      },
    ],
  },
  {
    heading: 'When not to use',
    cards: [
      {
        title: "Don't use Sidebar for 2–4 destinations",
        body: 'A horizontal NavMenu is less chrome for small apps. Sidebar is optimized for 5+ distinct pages — it adds unnecessary visual weight below that threshold.',
      },
    ],
  },
  {
    heading: 'Accessibility',
    cards: [
      {
        title: 'Use active on exactly one item at a time',
        body: 'active sets aria-current="page" and the violet highlight. Multiple active items break both the visual indication and the screen reader announcement of the current page.',
      },
    ],
  },
  {
    heading: 'Advice',
    cards: [
      {
        title: 'Keep group labels short and noun-form',
        body: 'Labels like "Main", "Account", and "Settings" scan instantly. Long labels take up too much space in expanded mode and lose meaning when truncated.',
      },
    ],
  },
]

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        A simple sidebar with navigation items and no collapse behavior. The{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">active</code> prop marks the
        current page with a violet background and sets{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">aria-current="page"</code>.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">sidebar with grouped navigation items</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <SidebarProvider>
            <div className="flex h-80 border border-gray-200 rounded-lg overflow-hidden w-full">
              <Sidebar>
                <SidebarHeader>
                  <SidebarTrigger />
                  <span className="ml-2 font-semibold text-gray-800 text-sm">My App</span>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarGroup label="Main">
                    <SidebarItem icon={<Home className="size-4" />} label="Dashboard" active />
                    <SidebarItem icon={<Package className="size-4" />} label="Inventory" />
                    <SidebarItem icon={<TrendingUp className="size-4" />} label="Trading" />
                    <SidebarItem icon={<BarChart2 className="size-4" />} label="Analytics" />
                  </SidebarGroup>
                  <SidebarGroup label="Settings">
                    <SidebarItem icon={<Settings className="size-4" />} label="Preferences" />
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
              <main className="flex-1 p-4 bg-gray-50">
                <p className="text-sm text-gray-500">Main content area</p>
              </main>
            </div>
          </SidebarProvider>
        </div>
      </div>

      <BestPractices items={bpItems} />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SidebarProvider>
  <div className="flex h-screen">
    <Sidebar>
      <SidebarHeader>
        <SidebarTrigger />
        <span>My App</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup label="Main">
          <SidebarItem icon={<HomeIcon />} label="Dashboard" active />
          <SidebarItem icon={<PackageIcon />} label="Inventory" />
          <SidebarItem icon={<TrendingUpIcon />} label="Trading" />
        </SidebarGroup>
        <SidebarGroup label="Settings">
          <SidebarItem icon={<SettingsIcon />} label="Preferences" />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    <main className="flex-1">...</main>
  </div>
</SidebarProvider>`}</code>
      </pre>
    </div>
  ),
}
