import { Home, Package, Settings, TrendingUp } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarOverlay,
  SidebarProvider,
  SidebarTrigger,
} from './Sidebar'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Sidebar/Mobile Drawer',
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
        title: 'defaultOpen=false for mobile-first designs',
        body: 'The drawer should start closed on mobile — content should lead, not the nav. Users open it intentionally via the trigger in the top navbar.',
      },
    ],
  },
  {
    heading: 'When not to use',
    cards: [
      {
        title: "Don't omit SidebarOverlay for mobile layouts",
        body: 'Without SidebarOverlay, users cannot dismiss the drawer by tapping outside it. The only way to close would be the X trigger inside the panel — which is easy to miss.',
      },
    ],
  },
  {
    heading: 'Accessibility',
    cards: [
      {
        title: 'Escape key closes the drawer automatically',
        body: 'SidebarProvider registers a keydown listener for Escape when the mobile drawer is open. No extra setup is needed — this gives keyboard users a reliable dismiss path.',
      },
    ],
  },
  {
    heading: 'Advice',
    cards: [
      {
        title: 'Place a SidebarTrigger in the top navbar, not just inside the sidebar',
        body: 'The trigger inside the sidebar shows an X to close. The trigger in the top navbar is the open button — users need both. Without the navbar trigger, there is no way to open the drawer after it closes.',
      },
    ],
  },
]

function MobileDrawerDemo() {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="relative flex flex-col h-[500px] w-full max-w-sm border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
        <header className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shrink-0">
          <SidebarTrigger />
          <span className="font-semibold text-gray-800 text-sm">My App</span>
        </header>

        <SidebarOverlay />

        <Sidebar>
          <SidebarHeader>
            <SidebarTrigger />
            <span className="ml-2 font-semibold text-gray-800 text-sm">Navigation</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup label="Main">
              <SidebarItem icon={<Home className="size-4" />} label="Dashboard" active />
              <SidebarItem icon={<Package className="size-4" />} label="Inventory" badge={3} />
              <SidebarItem icon={<TrendingUp className="size-4" />} label="Trading" />
            </SidebarGroup>
            <SidebarGroup label="Account">
              <SidebarItem icon={<Settings className="size-4" />} label="Settings" />
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-4">
          <p className="text-sm text-gray-500">
            Tap the menu icon in the header to open the drawer.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            On mobile the sidebar renders as a portal-mounted panel. The overlay closes it on
            backdrop click or Escape key.
          </p>
        </main>
      </div>
    </SidebarProvider>
  )
}

export const MobileDrawer = {
  name: 'Mobile Drawer',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        On screens <code className="font-mono bg-gray-100 px-1 rounded text-xs">{'<='} 768px</code>,
        the sidebar renders as a portal-mounted panel sliding in from the left.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SidebarOverlay</code> renders
        the backdrop — clicking it closes the drawer. Pressing Escape also closes it.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">mobile drawer — tap the menu icon to open</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <MobileDrawerDemo />
        </div>
      </div>

      <BestPractices items={bpItems} />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SidebarProvider defaultOpen={false}>
  {/* Overlay — click backdrop to close */}
  <SidebarOverlay />

  {/* Drawer slides in from the left on mobile */}
  <Sidebar>
    <SidebarHeader>
      <SidebarTrigger />  {/* shows X when open */}
    </SidebarHeader>
    <SidebarContent>...</SidebarContent>
  </Sidebar>

  <main>
    {/* Trigger in top navbar */}
    <SidebarTrigger />
    ...
  </main>
</SidebarProvider>`}</code>
      </pre>
    </div>
  ),
}
