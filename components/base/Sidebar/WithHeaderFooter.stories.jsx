import {
  BarChart2,
  HelpCircle,
  Home,
  LogOut,
  Package,
  Settings,
  TrendingUp,
  User,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarSub,
  SidebarTrigger,
} from './Sidebar'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Sidebar/With Header & Footer',
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
        title: 'Put the logo and SidebarTrigger in SidebarHeader',
        body: 'The header is pinned to the top and always visible. Placing the trigger here ensures users always have a way to collapse the sidebar, even after scrolling a long nav list.',
      },
      {
        title: 'Reserve SidebarFooter for user profile, account switching, and logout',
        body: 'These are expected at the bottom of every navigation sidebar by convention. Users look to the bottom-left for their account — meeting this expectation reduces cognitive load.',
      },
    ],
  },
  {
    heading: 'When not to use',
    cards: [
      {
        title: "Don't put primary navigation in SidebarFooter",
        body: 'Footer is for user-centric actions (profile, logout). Primary navigation belongs in SidebarContent inside SidebarGroup — mixing them disrupts the expected layout.',
      },
    ],
  },
  {
    heading: 'Accessibility',
    cards: [
      {
        title: 'Footer user-info text must hide gracefully in collapsed mode',
        body: 'Wrap user name and email in SidebarItemLabel (or use the same transition classes) so they fade out in icon-only mode without causing layout breakage or overflow.',
      },
    ],
  },
  {
    heading: 'Advice',
    cards: [
      {
        title: 'SidebarContent scrolls; Header and Footer stay pinned',
        body: 'The layout is flex-col with SidebarContent taking flex-1 and overflow-y-auto. This means only the nav area scrolls — the trigger and user actions are always reachable.',
      },
    ],
  },
]

export const WithHeaderFooter = {
  name: 'With Header & Footer',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        A full sidebar layout with a branded header, grouped navigation in the scrollable content
        area, and a user profile + logout in the footer.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SidebarHeader</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SidebarFooter</code> are pinned
        while <code className="font-mono bg-gray-100 px-1 rounded text-xs">SidebarContent</code>{' '}
        scrolls.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          branded header + grouped navigation + user footer
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <SidebarProvider>
            <div className="flex h-[480px] border border-gray-200 rounded-lg overflow-hidden w-full">
              <Sidebar>
                <SidebarHeader>
                  <SidebarTrigger />
                  <div className="ml-2 flex items-center gap-2 min-w-0">
                    <div className="size-6 rounded-md bg-violet-600 shrink-0" aria-hidden="true" />
                    <span className="font-bold text-gray-900 text-sm truncate">PersonalMgmt</span>
                  </div>
                </SidebarHeader>

                <SidebarContent>
                  <SidebarGroup label="Overview">
                    <SidebarItem icon={<Home className="size-4" />} label="Dashboard" active />
                  </SidebarGroup>

                  <SidebarGroup label="Modules">
                    <SidebarItem icon={<Package className="size-4" />} label="Inventory" badge={5}>
                      <SidebarSub>
                        <SidebarItem label="Products" />
                        <SidebarItem label="Categories" />
                        <SidebarItem label="Stock Alerts" badge={5} />
                      </SidebarSub>
                    </SidebarItem>

                    <SidebarItem icon={<TrendingUp className="size-4" />} label="Trading">
                      <SidebarSub>
                        <SidebarItem label="Portfolio" />
                        <SidebarItem label="Open Trades" />
                        <SidebarItem label="History" />
                      </SidebarSub>
                    </SidebarItem>

                    <SidebarItem icon={<BarChart2 className="size-4" />} label="Analytics" />
                  </SidebarGroup>

                  <SidebarGroup label="System">
                    <SidebarItem icon={<Settings className="size-4" />} label="Settings" />
                    <SidebarItem icon={<HelpCircle className="size-4" />} label="Help & Support" />
                  </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                  <div className="flex items-center gap-2.5 px-1 py-1 mb-1 min-w-0">
                    <div className="size-7 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                      <User className="size-3.5 text-violet-600" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1 overflow-hidden transition-[opacity,width] duration-200">
                      <span className="text-xs font-semibold text-gray-800 truncate">
                        Rafael Cahya
                      </span>
                      <span className="text-[10px] text-gray-400 truncate">cahya@example.com</span>
                    </div>
                  </div>
                  <SidebarItem icon={<LogOut className="size-4" />} label="Log out" />
                </SidebarFooter>
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
  <Sidebar>
    {/* Pinned top — logo + trigger */}
    <SidebarHeader>
      <SidebarTrigger />
      <Logo />
    </SidebarHeader>

    {/* Scrollable nav */}
    <SidebarContent>
      <SidebarGroup label="Modules">
        <SidebarItem icon={<PackageIcon />} label="Inventory" badge={5}>
          <SidebarSub>
            <SidebarItem label="Products" />
          </SidebarSub>
        </SidebarItem>
      </SidebarGroup>
    </SidebarContent>

    {/* Pinned bottom — user + logout */}
    <SidebarFooter>
      <UserProfile />
      <SidebarItem icon={<LogOutIcon />} label="Log out" />
    </SidebarFooter>
  </Sidebar>
</SidebarProvider>`}</code>
      </pre>
    </div>
  ),
}
