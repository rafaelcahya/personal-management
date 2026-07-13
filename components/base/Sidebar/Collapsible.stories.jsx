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
  title: 'Sidebar/Collapsible',
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
        title: 'defaultCollapsed for space-constrained layouts',
        body: 'Start in icon-only mode when the sidebar would crowd a content-heavy main area on first load. Users can expand it whenever they need the full labels.',
      },
    ],
  },
  {
    heading: 'When not to use',
    cards: [
      {
        title: "Don't use collapsible mode if any item lacks an icon",
        body: 'In collapsed mode only icons are visible. Items without icons become completely invisible to sighted users — they cannot be clicked or discovered.',
      },
    ],
  },
  {
    heading: 'Accessibility',
    cards: [
      {
        title: 'Labels power both the visible text and the collapsed tooltip',
        body: 'The label prop is used for the visible label in expanded mode and the tooltip in collapsed mode. Keep labels short — they must be readable at tooltip width.',
      },
    ],
  },
  {
    heading: 'Advice',
    cards: [
      {
        title: 'Tooltips appear automatically on hover when collapsed',
        body: 'No extra setup needed — the component derives tooltip text from the label prop. Collapsed items without a label have no tooltip, making them inaccessible.',
      },
    ],
  },
]

export const Collapsible = {
  name: 'Collapsible',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Click the menu button to toggle between expanded (240px) and icon-only (56px) modes. In
        collapsed mode, labels and badges fade out and each item shows a tooltip on hover with its
        label. Group labels collapse to zero height. Start collapsed:{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">defaultCollapsed=true</code>.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          starts collapsed — click the trigger to expand
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <SidebarProvider defaultCollapsed>
            <div className="flex h-80 border border-gray-200 rounded-lg overflow-hidden w-full">
              <Sidebar>
                <SidebarHeader>
                  <SidebarTrigger />
                </SidebarHeader>
                <SidebarContent>
                  <SidebarGroup label="Main">
                    <SidebarItem icon={<Home className="size-4" />} label="Dashboard" active />
                    <SidebarItem
                      icon={<Package className="size-4" />}
                      label="Inventory"
                      badge={5}
                    />
                    <SidebarItem icon={<TrendingUp className="size-4" />} label="Trading" />
                    <SidebarItem icon={<BarChart2 className="size-4" />} label="Analytics" />
                  </SidebarGroup>
                  <SidebarGroup label="Account">
                    <SidebarItem icon={<Settings className="size-4" />} label="Settings" />
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
              <main className="flex-1 p-4 bg-gray-50">
                <p className="text-sm text-gray-500">Hover over icons to see tooltips</p>
              </main>
            </div>
          </SidebarProvider>
        </div>
      </div>

      <BestPractices items={bpItems} />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* Start in collapsed (icon-only) state */}
<SidebarProvider defaultCollapsed>
  <div className="flex h-screen">
    <Sidebar>
      <SidebarHeader>
        <SidebarTrigger />   {/* toggles collapsed */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup label="Main">
          {/* label fades out when collapsed, tooltip appears on hover */}
          <SidebarItem icon={<HomeIcon />} label="Dashboard" active />
          <SidebarItem icon={<PackageIcon />} label="Inventory" badge={5} />
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
